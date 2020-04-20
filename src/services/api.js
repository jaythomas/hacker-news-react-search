import debounce from './debounce'

// Debounce this bad boy to reduce the amount of API calls
export const search = debounce(text => {
  return fetch(`http://hn.algolia.com/api/v1/search?query=${encodeURIComponent(text)}`, {
    method: 'GET'
  }).then(response => response.json())
}, 250)
