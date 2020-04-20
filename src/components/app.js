import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { query } from '../reducers/search'
import PropTypes from 'prop-types'

import './app.css'

function mapStateToProps(state) {
  return {
    error: state.error,
    loading: state.loading,
    queryText: state.queryText,
    results: state.results
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ query }, dispatch)
}

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const loadingText = this.props.loading ? <span>&nbsp; Loading...</span> : null
    const results = this.props.results.map(result =>
      <div className="result" key={ result.objectID }>
        <a href={ result.url }>{ result.title }</a> by { result.author }
      </div>
    )
    const resultsContainer = this.props.error ? null : <div className="results">{ results.length ? results : 'No results' }</div>
    const errorMessage = this.props.error ? <div className="error-message">{ this.props.error }</div> : null
    return (
      <div className="App">
        <h2>
          Hacker News search.
        </h2>
        <input
          onChange={event => this.props.query(event.target.value)}
          placeholder="Type something in"
          type="text"
          value={this.props.queryText}
        />
        { loadingText }
        { resultsContainer }
        { errorMessage }
      </div>
    )
  }
}

App.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  query: PropTypes.func,
  queryText: PropTypes.string,
  results: PropTypes.array
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
