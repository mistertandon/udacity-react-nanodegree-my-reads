import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DebounceInput } from 'react-debounce-input';

class SearchResults extends Component {

  state = {
    bookSearchingNeedle: ""
  }

  render() {

    const { booksUnderSearchResultsArr, searchBooksFunc,
      wantsToReadShelfNameRefString, currentlyReadingBooksShelfNameRefString, hasReadBooksShelfRefString, noneRefString,
      updateBookShelfRequestFunc } = this.props;

    return (

      <div className="search-books">
        <div className="search-books-bar">

          <Link to="/"
            className="close-search">Close</Link>

          <div className="search-books-input-wrapper">
            {
              /**
               * Search will get trigger after atleast 2 charaters
               * in search field with debounce time of 300ms
               */
            }
            <DebounceInput minLength={2}
              debounceTimeout={300}
              onChange={
                (event) => {

                  this.setState({ bookSearchingNeedle: event.target.value });

                  if (this.state.bookSearchingNeedle) {
                    searchBooksFunc(this.state.bookSearchingNeedle);
                  }
                }
              }
              value={this.state.bookSearchingNeedle}
              placeholder="Search by title or author"
            />

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
                            typeof book.imageLinks !== "undefined" &&
                            (
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                            )
                          }
                          {
                            typeof book.imageLinks === "undefined" &&
                            (
                              <div className="book-cover" style={{ width: 128, height: 193 }}></div>

                            )
                          }
                          <div className="book-shelf-changer">
                            <select defaultValue={book.shelf} name={book.id} onChange={
                              (event) => {

                                event.preventDefault();
                                /**
                                 * Calling `updateBookShelfRequestFunc` to update book shelf
                                 * with selected one.
                                 */
                                updateBookShelfRequestFunc(event, book);
                              }
                            }>
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