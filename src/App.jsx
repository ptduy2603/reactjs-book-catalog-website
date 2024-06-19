import { useCallback, useEffect, useState } from "react";

import {
  fetchBooksFromDatabase,
  insertNewBook,
  deleteBookById,
} from "./services/bookServices";
import Title from "./components/Title";
import "./assets/styles/main.scss";
import BookItem from "./components/BookItem";
import CustomButton from "./components/CustomButton";
import AddBookModal from "./components/AddBookModal";
import AppLoading from "./components/AppLoading";

function App() {
  const [books, setBooks] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isShowAddBookModal, setIsShowAddBookModal] = useState(false);

  // function handle covert raw data from firebase to a list of book
  const handleConvertData = useCallback((doc) => {
    const { publication_year, ...rest } = doc.data();

    return {
      id: doc?.id,
      publicationYear: publication_year,
      ...rest,
    };
  }, []);

  // function handle group book by given criterions
  // grouping criteria depends on groupField the argument
  const handleGroupBooks = useCallback((bookList, groupField) => {
    const resultBooks = bookList.reduce((result, currentBook) => {
      const value = currentBook[groupField];

      if (!result[value]) result[value] = [currentBook];
      else result[value]?.push(currentBook);

      return result;
    }, {});

    return Object.entries(resultBooks);
  }, []);

  // function handle sort books by given criterions
  const handleSortBooksByYear = useCallback((bookList) => {
    const result = bookList.map((list) => [list[0], list[1].sort()]);
    return result.sort((a, b) => a[0] - b[0]).reverse();
  }, []);

  const handleDeleteBook = useCallback(
    async (selectedBook) => {
      const confirmation = window.confirm(
        `Are you sure want to delete ${selectedBook?.name} ?`
      );

      if (confirmation) {
        setIsAppLoading(true);
        setBooks(books.filter((book) => book?.id !== selectedBook?.id));
        try {
          await deleteBookById(selectedBook?.id);
          window.alert("Delete book successfully!");
          setIsAppLoading(false);
        } catch (err) {
          setIsAppLoading(false);
          console.error(err);
        }
      }
    },
    [books]
  );

  // function handle render books with all of criterions
  const handleRenderBooks = useCallback(() => {
    let filteredBooks = books.filter((book) => Boolean(book?.publicationYear));

    filteredBooks = handleGroupBooks(filteredBooks, "publicationYear");
    filteredBooks = handleSortBooksByYear(filteredBooks);

    return filteredBooks.map((list, index) => {
      return (
        <div key={index}>
          <h3 className="category">{list?.[0]}</h3>
          <ul className="book__list">
            {list?.[1].map((book) => (
              <BookItem
                key={book?.id}
                book={book}
                setBooks={setBooks}
                handleDeleteBook={handleDeleteBook}
              />
            ))}
          </ul>
        </div>
      );
    });
  }, [books, handleGroupBooks, handleSortBooksByYear, handleDeleteBook]);

  // function handles add a new book
  const handleAddNewBook = async (book) => {
    setIsAppLoading(true);
    const { publicationYear, ...rest } = book;
    const newBook = { publication_year: publicationYear, ...rest };

    try {
      const data = await insertNewBook(newBook);
      const bookList = data?.docs?.map(handleConvertData);
      setBooks(!bookList?.length ? [] : bookList);
      window.alert("Add new book successfully!");
      setIsAppLoading(false);
    } catch (err) {
      setIsAppLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await fetchBooksFromDatabase();
        const bookList = data?.docs?.map(handleConvertData);
        console.log("Fetch books from database");

        setBooks(!bookList?.length ? [] : bookList);
        setIsAppLoading(false);
      } catch (err) {
        console.error("fetch books error: " + err);
      }
    };

    fetchBooks();
  }, [handleConvertData]);

  // function handles recommend a good book by given conditions
  const handleRecommendGoodBook = () => {
    // A good book should be published at least 3 years ago or earlier
    const currentYear = new Date().getFullYear();
    let filteredBooks = books.filter(
      (book) => currentYear - book?.publicationYear >= 3
    );

    // From all these books, pick ones with the highest rating
    let maxRating = 0;
    let results = [];

    filteredBooks.forEach((book) => {
      if (book?.rating > maxRating) {
        maxRating = book?.rating;
        results = [];
        results.push(book);
      } else if (book?.rating === maxRating) results.push(book);
    });

    //If there are several good books matching the criteria - pick one at random
    var goodBook;
    if (results.length > 1) {
      // random an integer from 0 to results.length - 1
      const randomIndex = Math.floor(Math.random() * results.length);
      goodBook = results?.[randomIndex];
    } else {
      goodBook = results?.[0];
    }

    window.alert(
      `Good book for you is : ${goodBook?.name} (${goodBook?.authors.join(
        ","
      )}) which has publication year is ${
        goodBook?.publicationYear
      } and rating is ${goodBook?.rating}!`
    );
  };

  return (
    <main className="container">
      <>
        <Title text="Book Catalog Website" />

        <div className="options">
          <CustomButton
            title="Add new book"
            icon={<i className="fa-solid fa-plus"></i>}
            handleOnClick={() => setIsShowAddBookModal(true)}
          />

          <CustomButton
            title="Recommend a good book"
            icon={<i className="fa-solid fa-lightbulb"></i>}
            handleOnClick={handleRecommendGoodBook}
          />
        </div>

        {isAppLoading ? (
          <AppLoading />
        ) : (
          <>
            <h2>Recommended books</h2>
            {handleRenderBooks()}

            <h2>Books without a year</h2>
            <ul className="book__list">
              {books
                .filter((book) => !book?.publicationYear)
                .map((filteredBook) => (
                  <BookItem
                    key={filteredBook?.id}
                    book={filteredBook}
                    setBooks={setBooks}
                    handleDeleteBook={handleDeleteBook}
                  />
                ))}
            </ul>

            {isShowAddBookModal && (
              <AddBookModal
                handleAddNewBook={handleAddNewBook}
                handleCloseModal={() => setIsShowAddBookModal(false)}
              />
            )}
          </>
        )}
      </>
    </main>
  );
}

export default App;
