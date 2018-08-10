import { storiesOf } from '@storybook/react';
import React from 'react';
import { Hits, SearchBox, Pagination, HitsPerPage } from 'react-instantsearch-dom';
import withInstantSearchMock from '../../src/index';

// load styling
// TODO: make a cleaner inmport
var link = document.createElement('link');
link.id = 'algolia_styles';
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/algolia-min.css';
document.head.appendChild(link);

// generate an InstantSearch with an index size of 100 docs with field text
// you can search with lunr search language (https://lunrjs.com/guides/searching.html)
// start with typing '*'

storiesOf('Test', module)
  .addDecorator(withInstantSearchMock({ size: 100, fields: ['text'] }))
  .add('First', () => {
    return (
      <div>
        <div style={{ margin: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <SearchBox />
          </div>
          <HitsPerPage
            defaultRefinement={5}
            items={[{ value: 5, label: 'Show 5 hits' }, { value: 10, label: 'Show 10 hits' }]}
          />
          <Hits
            hit
            hitComponent={({ hit }) => {
              return (
                <div style={{ flex: '1 0 400px' }}>
                  <h3>{hit.objectID}</h3>
                  <p> {hit.text} </p>
                </div>
              );
            }}
          />
        </div>
        <Pagination />
      </div>
    );
  });
