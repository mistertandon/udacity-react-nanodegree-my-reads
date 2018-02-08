import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import './App.css'
import SearchResults from './search-results'
import CurrentlyRead from './currently-read'
import WantRead from './want-read'
import HasRead from './has-read'

class BooksApp extends Component {

  /**
   * wantsToReadShelfNameRef: This property contains reference value of
   * shelf, contains books user want to read in near future.
   */
  wantsToReadShelfNameRef = "wantToRead";

  /**
   * currentlyReadingBooksShelfNameRef: This property contain reference value
   * of shelf, contains books currently being read by user.
   */
  currentlyReadingBooksShelfNameRef = "currentlyReading";

  /**
   * hasReadBooksShelfRef: This property contain reference value of
   * shelf, contains books have been read by user.
   */
  hasReadBooksShelfRef = "read";

  state = {
    booksUnderShelves: [],
    booksUnderSearchResults: []
  }

  componentDidMount() {

    BooksAPI.getAll().then(books => {

      this.setState({
        booksUnderShelves: books
      });
    });
  }

  searchBooks = (bookSearchingNeedle) => {

    BooksAPI
      .search(bookSearchingNeedle)
      .then(searchResults => {

        this.setState({ booksUnderSearchResults: searchResults });
      });
  }

  render() {

    return (

      <div className="app">

        <Route path="/search" render={() => (

          <SearchResults booksUnderSearchResultsArr={this.state.booksUnderSearchResults}
            searchBooksFunc={this.searchBooks}
            wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
            currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
            hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
          />
        )} />

        <Route exact path="/" render={() => (

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            <div className="list-books-content">
              <div>
                <CurrentlyRead booksUnderShelvesArr={this.state.booksUnderShelves}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                />

                <WantRead booksUnderShelvesArr={this.state.booksUnderShelves}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                />

                <HasRead booksUnderShelvesArr={this.state.booksUnderShelves}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp