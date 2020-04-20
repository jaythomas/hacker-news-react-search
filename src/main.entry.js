// Explanation on entry files: Webpack loads entry files and generates bundles in dist/ from these.
// This webpack entry file is the root of the app and output as the main bundle. If there were more
// pages in the app you could theoretically have separate entry files for them and load that bundles
// asynchronously to keep boot time and network traffic low and request those chunks of code as needed.
// Additionally, vendor files are less prone to change between builds so anything in this entry file
// originated from the node_modueles/ directory will automatically be extracted out into vendor.bundle.xxx.js

import { Provider } from 'react-redux'
import { reducer } from './reducers/search'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import React from 'react'
import ReactDom from 'react-dom'
import App from './components/app'

const store = createStore(reducer, applyMiddleware(thunk))

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-root')
)
