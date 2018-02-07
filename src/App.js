import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends Component {

  /**
   * hasReadBooksShelfRef: This property contain reference value of
   * shelf, contains books have been read by user.
   */
  hasReadBooksShelfRef = "read";

  /**
   * currentlyReadingBooksShelfNameRef: This property contain reference value
   * of shelf, contains books currently being read by user.
   */
  currentlyReadingBooksShelfNameRef = "currentlyReading";

  /**
   * wantsToReadShelfNameRef: This property contains reference value of
   * shelf, contains books user want to read in near future.
   */
  wantsToReadShelfNameRef = "wantToRead";

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    hasReadBooksShelf: [],
    currentlyReadingBooksShelf: [],
    wantsToReadBooksShelf: [],
    bookSearchingNeedle: ''
  }

  componentDidMount() {

    var hasReadBooks = [];
    var currentlyReadingBooks = [];
    var wantsToReadBooks = [];

    BooksAPI.getAll().then(books => {

      books.forEach((book) => {

        var isShelMatched = false;

        if (!isShelMatched && (book.shelf === this.hasReadBooksShelfRef)) {
          hasReadBooks.push(book);
          isShelMatched = true;
        }

        if (!isShelMatched && (book.shelf === this.currentlyReadingBooksShelfNameRef)) {
          currentlyReadingBooks.push(book);
          isShelMatched = true;
        }

        if (!isShelMatched && (book.shelf === this.wantsToReadShelfNameRef)) {
          wantsToReadBooks.push(book);
          isShelMatched = true;
        }
      });

      this.setState({
        hasReadBooksShelf: hasReadBooks,
        currentlyReadingBooksShelf: currentlyReadingBooks,
        wantsToReadBooksShelf: wantsToReadBooks
      });

    });
  }

  setBookSearchingNeedle = (bookSearchingNeedle) => {
    console.log(bookSearchingNeedle);
  }

  searchBooks = (event) => {

    const needle = event.target.value;
    BooksAPI.search(needle).then(books => {
      console.log(books);
    });

  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text"
                  onChange={(event) => { this.setBookSearchingNeedle(event.target.value) }}
                  placeholder="Search by title or author"
                  value={this.state.bookSearchingNeedle} />

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">

                        {
                          this.state.currentlyReadingBooksShelf.map(book => (
                            <li key={book.id}>
                              <div className="book">
                                <div className="book-top">
                                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                  <div className="book-shelf-changer">
                                    <select>
                                      <option value="none" disabled>Move to...</option>
                                      <option value="currentlyReading">Currently Reading</option>
                                      <option value="wantToRead">Want to Read</option>
                                      <option value="read">Read</option>
                                      <option value="none">None</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors.join(", ")}</div>
                              </div>
                            </li>
                          ))
                        }

                      </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">
                        {
                          this.state.wantsToReadBooksShelf.map(book => (
                            <li key={book.id}>
                              <div className="book">
                                <div className="book-top">
                                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                  <div className="book-shelf-changer">
                                    <select>
                                      <option value="none" disabled>Move to...</option>
                                      <option value="currentlyReading">Currently Reading</option>
                                      <option value="wantToRead">Want to Read</option>
                                      <option value="read">Read</option>
                                      <option value="none">None</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors.join(", ")}</div>
                              </div>
                            </li>
                          ))

                        }
                      </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">
                        {
                          this.state.hasReadBooksShelf.map(book => (
                            <li key={book.id}>
                              <div className="book">
                                <div className="book-top">
                                  <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                  <div className="book-shelf-changer">
                                    <select>
                                      <option value="none" disabled>Move to...</option>
                                      <option value="currentlyReading">Currently Reading</option>
                                      <option value="wantToRead">Want to Read</option>
                                      <option value="read">Read</option>
                                      <option value="none">None</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors.join(", ")}</div>
                              </div>
                            </li>
                          ))
                        }
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="open-search">
                <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default BooksApp
