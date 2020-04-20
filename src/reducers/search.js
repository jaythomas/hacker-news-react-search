import { search } from '../services/api'

const initialState = {
  error: '',
  loading: false,
  queryText: '',
  results: []
}

const reducerMap = {
  updateQueryText: (state, action) => ({ ...state, queryText: action.text }),
  updateResults: (state, action) => ({ ...state, results: action.results }),
  updateSearch: (state, action) => ({ ...state, ...action.status })
}

export function query(text) {
  return dispatch => {
    // Upating the query text is a separate dispatch outside of the network request so we
    // can immediately benefit from any local state changes to the input (if we need to).
    dispatch(updateQueryText(text))
    dispatch(updateSearch({ loading: true }))
    search(text)
      .then(({ hits }) => {
        dispatch(updateSearch({ loading: false }))
        dispatch(updateResults(hits))
      })
      .catch(error => {
        dispatch(updateSearch({ loading: false, error: error.message }))
      })
  }
}

export function updateQueryText(text) {
  return { type: 'updateQueryText', text }
}

export function updateResults(results) {
  return { type: 'updateResults', results }
}

export function updateSearch(status) {
  return { type: 'updateSearch', status }
}

export function reducer(state = initialState, action) {
  // Return a new state from the reducer map or default to the current state
  return reducerMap[action.type] ? reducerMap[action.type](state, action) : state
}
