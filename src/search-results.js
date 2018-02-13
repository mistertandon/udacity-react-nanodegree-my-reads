import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchResults extends Component {

  state = {
    bookSearchingNeedle: ""
  }

  setBookSearchingNeedle = (bookSearchingNeedle) => {

    this.setState({ bookSearchingNeedle: bookSearchingNeedle });

    if (this.state.bookSearchingNeedle) {
      this.props.searchBooksFunc(this.state.bookSearchingNeedle);
    }

  }

  updateBookStatusRequestFromShelf = (event) => {

    this.props.updateBookStatusRequestFromShelfFunc(event.target.name, event.target.value);
  }

  render() {

    const { booksUnderSearchResultsArr, wantsToReadShelfNameRefString, currentlyReadingBooksShelfNameRefString, hasReadBooksShelfRefString, noneRefString } = this.props;

    return (

      <div className="search-books">
        <div className="search-books-bar">

          <Link to="/"
            className="close-search">Close</Link>

          <div className="search-books-input-wrapper">
            {/*
            NOTES: The search from BooksAPI is limited to a particular set of search terms.
            You can find these search terms here:
            https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

            However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
            you don't find a specific author or title. Every search is limited by search terms.
          */
            }
            <input type="text"
              onChange={(event) => { this.setBookSearchingNeedle(event.target.value) }}
              placeholder="Search by title or author"
              value={this.state.bookSearchingNeedle} />

          </div>
        </div>
        {
          booksUnderSearchResultsArr.length && (

            <div className="search-books-results">
              <ol className="books-grid">
                {
                  booksUnderSearchResultsArr.map(book => (

                    <li key={book.id}>
                      <div className="book">
                        <div className="book-top">
                          {
                            typeof book.imageLinks.thumbnail !== "undefined" &&
                            (
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                            )
                          }
                          {
                            typeof book.imageLinks.thumbnail === "undefined" &&
                            (
                              <div className="book-cover" style={{ width: 128, height: 193 }}></div>
                            )
                          }
                          <div className="book-shelf-changer">
                            <select defaultValue={book.shelf} name={book.id} onChange={this.updateBookStatusRequestFromShelf}>
                              <option value={noneRefString} disabled>Move to...</option>
                              <option value={currentlyReadingBooksShelfNameRefString}>Currently Reading</option>
                              <option value={wantsToReadShelfNameRefString}>Want to Read</option>
                              <option value={hasReadBooksShelfRefString}>Read</option>
                              <option value={noneRefString}>None</option>
                            </select>
                          </div>
                        </div>
                        <div className="book-title">{book.title}</div>
                      </div>
                    </li>
                  ))
                }
              </ol>
            </div>
          )
        }
      </div>
    )
  }
}

export default SearchResults;