import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import { Route, Link } from 'react-router-dom'
import './App.css'
import SearchResults from './searchResults'
import BookShelfType from './bookShelfType'

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

  /**
   * state: It contains application global state.
   */
  state = {
    booksUnderShelves: [],
    booksUnderSearchResults: []
  }

  /**
   * @description: This function initialize application state
   * immediate after component gets mounted.
   * @return none
   */
  componentDidMount() {

    BooksAPI.getAll().then(books => {

      return this.updateSearchResultsOnInit(books);

    }).then((updatedStateObject) => {
      /**
       * updatedStateObject: This object is feed from `updateSearchResultsOnInit`
       * function as a result of promise resolve.
       */
      this.setState(updatedStateObject);
      console.log(`book has been moved to desired category.`);
    });
  }

  /**
   * @description: This function updates shefl status of
   * a particular book. After getting shelf updates, it updates the
   * information for same book in search results if exists.
   * @param {Object} event: Option selection event information
   * @param {Object} book: Book object for which shelf update
   * request is made
   * @return none
   */
  updateBookShelfRequest = (event, book) => {

    const shelfName = event.target.value;

    BooksAPI.update(book, shelfName)
      .then(result => {

        return BooksAPI.getAll();
      })
      .then(booksUnderShelves => {

        return this.updateSearchResultsAfterShelfUpdation(booksUnderShelves, book, shelfName);
      }).then(updatedStateObject => {
        /**
         * `updatedStateObject` feed from `updateSearchResultsAfterShelfUpdation`
         * function as a result of promise resolve.
         */
        this.setState(updatedStateObject);
        console.log(`book shelf has been updated to desired category.`);
      });
  }

  /**
   * @description: This function updates the search results immediate
   * after component get mounted. It updates the shelf status of
   * books exist under search results, taking refernce of books exist
   * under different shelves (wantToRead, currentlyReading and read shelves).
   * @param {Array of objects} books: Books exist under different
   * shelves (wantToRead, currentlyReading and read shelves).
   */
  updateSearchResultsOnInit = (books) => {

    /**
     * `updateSearchResultsPromise` promise will
     * get resolved once books shelf status get update exist
     * under search results.
     */
    let updateSearchResultsPromise = new Promise((resolve, reject) => {

      /**
       * `booksUnderSearchResultsModified` contains copy of
       * `this.state.booksUnderSearchResults`. It is used to update
       * `this.state.booksUnderSearchResults` state.
       */
      var booksUnderSearchResultsModified = [];
      booksUnderSearchResultsModified = this.state.booksUnderSearchResults.map(bookUnderSearchResult => Object.assign({}, bookUnderSearchResult));

      /**
       * If `this.state.booksUnderSearchResults` is non empty, find
       * the book under search results and update the shelf.
       */
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

  /**
   * @description: This function is used to update shelf of books
   * exist under search results, once user made request to update
   * shelf of any book. It get called via `updateBookShelfRequest`
   * function.
   * @param {Array of Objects} booksUnderShelves: Array of Book
   * Objects exist under different shelves (wantToRead,
   * currentlyReading and read shelves).
   * @param {Object} book: Book object, whose shelf must update
   * @param {String} shelfName: Shelf name under which book needs to move
   */
  updateSearchResultsAfterShelfUpdation = (booksUnderShelves, book, shelfName) => {

    /**
     * `updateSearchResultsPromise` promise will take care of
     * search result updation process.
     */
    let updateSearchResultsPromise = new Promise((resolve, reject) => {

      /**
       * `booksUnderSearchResultsModified` contains copy of
       * `this.state.booksUnderSearchResults` state property.
       */
      var booksUnderSearchResultsModified = [];
      booksUnderSearchResultsModified = this.state.booksUnderSearchResults.map(bookUnderSearchResult => Object.assign({}, bookUnderSearchResult));

      booksUnderSearchResultsModified.length && booksUnderSearchResultsModified.find((bookInfo, index) => {

        if (bookInfo.id === book.id) {
          booksUnderSearchResultsModified[index].shelf = shelfName;
        }
      });

      /**
       * Updated state object pass to `resolve` function.
       */
      resolve(
        {
          booksUnderShelves: booksUnderShelves,
          booksUnderSearchResults: booksUnderSearchResultsModified
        }
      );
    });

    return updateSearchResultsPromise;
  }

  /**
   * @description: This function is used to get books list
   * based on search query named as `bookSearchingNeedle`.
   * @param {String} bookSearchingNeedle
   * @returns none
   */
  searchBooks = (bookSearchingNeedle) => {

    /**
     * Making request for search result using BooksAPI.search()
     * function.
     */
    BooksAPI
      .search(bookSearchingNeedle)
      .then(searchResults => {
        /**
         * Now we need to update search results, if book exist under
         * search results does not have `shelf ` property, then add it
         * with initial value `noneRef`
         */
        return this.updateSearchResultsShelfAfterSearching(searchResults);
      })
      .then(searchResults => {

        /**
         * Now we need to update search results according to the
         * books exist under different shelves.
         */
        return this.updateSearchResultsAfterSearching(searchResults);
      })
      .then(booksUnderSearchResultsModified => {

        /**
         * Update state with modified search results.
         */
        this.setState({
          booksUnderSearchResults: booksUnderSearchResultsModified
        });
      });
  }

  /**
   * @description: This function is used update search results,
   * once user search for books. If books exist under search
   * results do not have `shelf` property, then it adds `shelf`
   * property to book object with `noneRef` as initial value.
   * @param {Array of Object} searchResults
   * @return none
   */
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

  /**
   * @description: This function is used to update `shelf` property
   * of books exist under search results as per the books exist
   * under different shelves.
   * @param {Array of Objects} booksUnderSearchResults
   * @return none
   */
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

  /**
   * @description: Render application using components.
   */
  render() {

    return (

      <div className="app">
        {
          /**
           * Render books exist under search results using `SearchResults`
           * component
           */
        }
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
                {
                  /**
                   * Render books exist under currentlyReading shelf using `BookShelfType`
                   * component
                   */
                }
                <BookShelfType booksUnderShelvesArr={this.state.booksUnderShelves}
                  shelfNameRef={this.currentlyReadingBooksShelfNameRef}
                  shelfNameTitle={this.currentlyReadingBooksShelfTitle}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                  noneRefString={this.noneRef}
                  updateBookShelfRequestFunc={this.updateBookShelfRequest}
                />
                {
                  /**
                   * Render books exist under read shelf using `BookShelfType`
                   * component
                   */
                }
                <BookShelfType booksUnderShelvesArr={this.state.booksUnderShelves}
                  shelfNameRef={this.wantsToReadShelfNameRef}
                  shelfNameTitle={this.wantsToReadShelfTitle}
                  wantsToReadShelfNameRefString={this.wantsToReadShelfNameRef}
                  currentlyReadingBooksShelfNameRefString={this.currentlyReadingBooksShelfNameRef}
                  hasReadBooksShelfRefString={this.hasReadBooksShelfRef}
                  noneRefString={this.noneRef}
                  updateBookShelfRequestFunc={this.updateBookShelfRequest}
                />
                {
                  /**
                   * Render books exist under wantToRead shelf using `BookShelfType`
                   * component
                   */
                }
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