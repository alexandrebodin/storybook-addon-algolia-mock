import React from 'react';
import faker from 'faker';
import lunr from 'lunr';
import { InstantSearch } from 'react-instantsearch-dom';

const genStore = ({ documents, fields }) => {
  const idx = lunr(function() {
    this.ref('objectID');

    fields.forEach(fieldName => {
      this.field(fieldName);
    });

    this.pipeline.remove(lunr.stemmer);
    this.searchPipeline.remove(lunr.stemmer);

    Object.values(documents).forEach(function(doc) {
      this.add(doc);
    }, this);
  });

  return {
    _documents: documents,
    search({ query, page = 0, hitsPerPage = 20 }) {
      if (query.length === 0) return [];

      const searchResults = idx.search(query);

      const hits = searchResults.map(({ ref }) => {
        // TODO: extract hilights for ex
        return documents[ref];
      });

      return {
        hits: hits.slice(page * hitsPerPage, hitsPerPage * (page + 1)),
        page,
        nbHits: hits.length,
        nbPages: Math.ceil(hits.length / hitsPerPage),
        hitsPerPage,
        processingTimeMS: 1,
        query,
        params: '', //'query=jimmie+paint&attributesToRetrieve=firstname,lastname&hitsPerPage=50',
      };
    },
  };
};

const genData = ({ size, fields }) => {
  return Array(size)
    .fill(0)
    .reduce(acc => {
      const objectID = faker.random.uuid();

      const doc = fields.reduce((acc, field) => {
        acc[field] = faker.lorem.text();
        return acc;
      }, {});

      acc[objectID] = {
        ...doc,
        objectID,
      };

      return acc;
    }, {});
};

const createCustomClient = ({ size = 10, fields = ['name'] } = {}) => {
  const data = genData({ size, fields });
  const store = genStore({ documents: data, fields });

  return {
    search(requests) {
      return Promise.resolve({
        results: requests.map(r => store.search(r.params)),
      });
    },
    searchForFacetValues(requests) {
      console.log('searchForFacetValues', requests);
    },
  };
};

const withInstantSearchMock = ({ size = 100, fields = ['text'] }) => {
  const customClient = createCustomClient({ size, fields });

  return storyFn => (
    <InstantSearch indexName="storbook" searchClient={customClient}>
      {storyFn()}
    </InstantSearch>
  );
};

export default withInstantSearchMock;
