import assert from 'assert'
import flushPromises from 'flush-promises'
import { createStore } from 'redux'
import {
  query,
  reducer,
  updateQueryText,
  updateResults,
  updateSearch
} from './search'

// We don't want to do any actual network requests in the unit tests
jest.mock('../services/api', () => {
  return {
    __esModule: true,
    search: () => new Promise(resolve => {
      resolve({
        hits: [
          {
            author: 'John Carmack',
            title: 'The privacy-oriented search engine',
            url: 'https://duckduckgo.com/'
          },
          {
            author: 'Ken Thompson',
            title: 'The Twitter lynch mob dumping ground',
            url: 'https://www.wikipedia.org/'
          }
        ]
      })
    })
  }
})

describe('search store', () => {
  test('exports a reducer', () => {
    assert.strictEqual(typeof reducer, 'function')
  })

  test('initial state', () => {
    const store = createStore(reducer)
    const state = store.getState()
    assert.strictEqual(state.error, '', 'should have an empty error state')
    assert.strictEqual(state.loading, false, "shouldn't think it's loading anything")
    assert.strictEqual(state.queryText, '', 'the search input should be in an empty state')
    assert(Array.isArray(state.results))
    assert.strictEqual(state.results.length, 0, 'should have no results initially')
  })

  test('updateQueryText()', () => {
    const store = createStore(reducer)
    store.dispatch(updateQueryText('foobar'))
    assert.strictEqual(store.getState().queryText, 'foobar', 'should see our query text')
  })

  test('updateResults()', () => {
    const store = createStore(reducer)
    const item1 = 'foo'
    const item2 = 'bar'
    store.dispatch(updateResults([item1, item2]))
    const { results } = store.getState()
    assert.strictEqual(results.length, 2)
    assert.strictEqual(results[0], item1)
    assert.strictEqual(results[1], item2)
  })

  test('updateSearch()', () => {
    const store = createStore(reducer)

    store.dispatch(updateSearch({ loading: true }))
    assert(store.getState().loading, 'should be loading now')
    assert.strictEqual(store.getState().error, '', 'error message should be unaffected by the loading state change')

    store.dispatch(updateSearch({ loading: false, error: 'new error' }))
    assert.strictEqual(store.getState().loading, false)
    assert.strictEqual(store.getState().error, 'new error')
  })

  test('query()', async () => {
    const store = createStore(reducer)

    // Bind dispatch the way redux-thunk would
    query("doesn't matter")(store.dispatch)
    await flushPromises()
    const state = store.getState()
    assert.strictEqual(state.results.length, 2)
    assert.strictEqual(state.results[0].author, 'John Carmack')
    assert.strictEqual(state.results[0].url, 'https://duckduckgo.com/')
    assert.strictEqual(state.results[1].author, 'Ken Thompson')
    assert.strictEqual(state.results[1].url, 'https://www.wikipedia.org/')
    assert.strictEqual(state.loading, false, 'should no longer be loading')
    assert.strictEqual(state.error, '', 'no error should have occured')
  })
})
