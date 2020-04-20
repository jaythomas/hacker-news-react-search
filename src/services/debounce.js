// Debounce that returns a placeholder promise
// so we can seamlessly debounce API promises
export default function debounce(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments

    return new Promise(function(resolve) {
      const later = function() {
        timeout = null
        resolve(func.apply(context, args))
      }

      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    })
  }
}
