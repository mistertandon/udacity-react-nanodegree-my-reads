import React from 'react';

const HasRead = (props) => (

  <div className="bookshelf">
    <h2 className="bookshelf-title">Read</h2>
    <div className="bookshelf-books">
      <ol className="books-grid">
        {
          props.booksUnderShelvesArr.length &&
          props.booksUnderShelvesArr.filter(book => book.shelf === props.hasReadBooksShelfRefString)
            .map(book => (

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
                      <select defaultValue={book.shelf} name={book.id} onChange={
                        (event) => {
                          props.updateBookStatusRequestFromShelfFunc(event, book)
                        }
                      }>
                        <option value={props.noneRefString} disabled>Move to...</option>
                        <option value={props.currentlyReadingBooksShelfNameRefString}>Currently Reading</option>
                        <option value={props.wantsToReadShelfNameRefString}>Want to Read</option>
                        <option value={props.hasReadBooksShelfRefString}>Read</option>
                        <option value={props.noneRefString}>None</option>
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
)

export default HasRead;