import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import './App.css'
import SearchResults from './search-results'
import BookShelfType from './book-shelf-type'

class BooksApp extends Component {

  /**
   * currentlyReadingBooksShelfNameRef: This property contain reference value
   * of shelf, contains books currently being read by user.
   */
  currentlyReadingBooksShelfNameRef = "currentlyReading";

  /**
   * currentlyReadingBooksShelfTitle: This property contain title value
   * of shelf, contains books currently being read by user.
   */
  currentlyReadingBooksShelfTitle = "Currently Reading";

  /**
   * wantsToReadShelfNameRef: This property contains reference value of
   * shelf, contains books user want to read in near future.
   */
  wantsToReadShelfNameRef = "wantToRead";

  /**
   * wantsToReadShelfTitle: This property contains title value of
   * shelf, contains books user want to read in near future.
   */
  wantsToReadShelfTitle = "Want to Read";

  /**
   * hasReadBooksShelfRef: This property contain reference value of
   * shelf, contains books have been read by user.
   */
  hasReadBooksShelfRef = "read";

  /**
   * hasReadBooksShelfTitle: This property contain title value of
   * shelf, contains books have been read by user.
   */
  hasReadBooksShelfTitle = "Read";

  /**
   * noneRef: This property contain reference value of
   * noneRef.
   */
  noneRef = "none";

  state = {
    booksUnderShelves: [],
    booksUnderSearchResults: []
  }

  componentDidMount() {

    BooksAPI.getAll().then(books => {

      return this.updateSearchResultsOnInit(books);

    }).then((updatedStateObject) => {

      this.setState(updatedStateObject);
      console.log(`book has been moved to desired category.`);
    });
  }

  updateBookShelfRequest = (event, book) => {

    const shelfName = event.target.value;

    BooksAPI.update(book, shelfName)
      .then(result => {

        return BooksAPI.getAll();
      })
      .then(booksUnderShelves => {

        return this.updateSearchResultsAfterShelfUpdation(booksUnderShelves, book, shelfName);
      }).then(updatedStateObject => {

        this.setState(updatedStateObject);
        console.log(`book shelf has been updated to desired category.`);
      });
  }

  updateSearchResultsOnInit = (books) => {

    let updateSearchResultsPromise = new Promise((resolve, reject) => {

      var booksUnderSearchResultsModified = [];
      booksUnderSearchResultsModified = this.state.booksUnderSearchResults.map(bookUnderSearchResult => Object.assign({}, bookUnderSearchResult));

      this.state.booksUnderSearchResults.length && books.map(book => {

        booksUnderSearchResultsModified.find((bookInfo, index) => {

          if (bookInfo.id === book.id) {
            booksUnderSearchResultsModified[index].shelf = book.shelf;
            return true;
          }
        });
      });

      resolve({
        booksUnderShelves: books,
        booksUnderSearchResults: booksUnderSearchResultsModified
      });
    });

    return updateSearchResultsPromise;
  }

  updateSearchResultsAfterShelfUpdation = (booksUnderShelves, book, shelfName) => {

    let updateSearchResultsPromise = new Promise((resolve, reject) => {

      var booksUnderSearchResultsModified = [];
      booksUnderSearchResultsModified = this.state.booksUnderSearchResults.map(bookUnderSearchResult => Object.assign({}, bookUnderSearchResult));

      booksUnderSearchResultsModified.length && booksUnderSearchResultsModified.find((bookInfo, index) => {

        if (bookInfo.id === book.id) {
          booksUnderSearchResultsModified[index].shelf = shelfName;
        }
      });

      resolve(
        {
          booksUnderShelves: booksUnderShelves,
          booksUnderSearchResults: booksUnderSearchResultsModified
        }
      );
    });

    return updateSearchResultsPromise;
  }

  searchBooks = (bookSearchingNeedle) => {

    BooksAPI
      .search(bookSearchingNeedle)
      .then(searchResults => {

        return this.updateSearchResultsShelfAfterSearching(searchResults);
      })
      .then(searchResults => {

        return this.updateSearchResultsAfterSearching(searchResults);
      })
      .then(booksUnderSearchResultsModified => {

        this.setState({
          booksUnderSearchResults: booksUnderSearchResultsModified
        });
      });
  }

  updateSearchResultsShelfAfterSearching = (searchResults) => {

    let searchResultsPromise = new Promise(
      (resolve, reject) => {

        searchResults.length && searchResults.forEach((book, index) => {

          if (typeof book.shelf === "undefined") {

            book.shelf = this.noneRef;
          }
        });

        resolve(searchResults);
      }
    );

    return searchResultsPromise;
  }

  updateSearchResultsAfterSearching = (booksUnderSearchResults) => {

    let updateSearchResultsPromise = new Promise((resolve, reject) => {

      var booksUnderSearchResultsModified = [];
      booksUnderSearchResultsModified = booksUnderSearchResults.map(bookUnderSearchResult => Object.assign({}, bookUnderSearchResult));

      this.state.booksUnderShelves.length && this.state.booksUnderShelves.map(book => {

        booksUnderSearchResultsModified.find((bookInfo, index) => {

          if (bookInfo.id === book.id) {

            booksUnderSearchResultsModified[index].shelf = book.shelf;
            return true;
          }
        });
      });

      resolve(booksUnderSearchResultsModified);
    });

    return updateSearchResultsPromise;
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
            noneRefString={this.noneRef}
            updateBookShelfRequestFunc={this.updateBookShelfRequest}
          />
        )} />

        <Route exact path="/" render={() => (

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>

            <div className="list-books-content">
              <div>
                <BookShelfType booksUnderShelvesArr={this.state.booksUnderShelves}
                  shelfNameRef={this.currentlyReadingBooksShelfNameRef}
                  shelfNameTitle={this.currentlyReadingBooksShelfTitle}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                  noneRefString={this.noneRef}
                  updateBookShelfRequestFunc={this.updateBookShelfRequest}
                />
                <BookShelfType booksUnderShelvesArr={this.state.booksUnderShelves}
                  shelfNameRef={this.wantsToReadShelfNameRef}
                  shelfNameTitle={this.wantsToReadShelfTitle}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                  noneRefString={this.noneRef}
                  updateBookShelfRequestFunc={this.updateBookShelfRequest}
                />
                <BookShelfType booksUnderShelvesArr={this.state.booksUnderShelves}
                  shelfNameRef={this.hasReadBooksShelfRef}
                  shelfNameTitle={this.hasReadBooksShelfTitle}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                  noneRefString={this.noneRef}
                  updateBookShelfRequestFunc={this.updateBookShelfRequest}
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