import { useCallback, useEffect, useState } from "react";

import {
  fetchBooksFromDatabase,
  insertNewBook,
  deleteBookById,
  updateBook,
} from "./services/bookServices";
import Title from "./components/Title";
import "./assets/styles/main.scss";
import BookItem from "./components/BookItem";
import CustomButton from "./components/CustomButton";
import BookModal from "./components/BookModal";
import AppLoading from "./components/AppLoading";

function App() {
  const [books, setBooks] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isShowAddBookModal, setIsShowAddBookModal] = useState(false);
  const [groupCriteria, setGroupCriteria] = useState("publicationYear");

  // function handles covert raw data from firebase to a list of book
  const handleConvertData = useCallback((doc) => {
    const { publication_year, ...rest } = doc.data();

    return {
      id: doc?.id,
      publicationYear: publication_year,
      ...rest,
    };
  }, []);

  // function handles group book by given criterions
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

  // function handles sort books by given criterions
  const handleSortBooks = useCallback((bookList) => {
    const result = bookList.map((list) => [
      Number(list[0]),
      list[1].sort((obj1, obj2) => {
        if (obj1?.name.toLowerCase() > obj2?.name.toLowerCase()) return 1;
        if (obj1?.name.toLowerCase() < obj2?.name.toLowerCase()) return -1;
        return 0;
      }),
    ]);
    return result.sort((a, b) => a[0] - b[0]).reverse();
  }, []);

  // function handles delete books
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

  // function handles edit books
  const handleEditBook = useCallback(
    async (book) => {
      console.log("Updated book:", book);
      try {
        const { publicationYear, ...rest } = book;
        const updatedBook = publicationYear
          ? { publication_year: publicationYear, ...rest }
          : book;

        const updatedBooks = books.filter((item) => item?.id !== book?.id);
        updatedBooks.push(book);

        setBooks(updatedBooks);
        window.alert("Edit book successfully!");
        await updateBook(updatedBook);
      } catch (err) {
        console.error(err);
      }
    },
    [books]
  );

  // function handles render books with all of criterions
  const handleRenderBooks = useCallback(() => {
    let filteredBooks = books.filter((book) => Boolean(book[groupCriteria]));

    filteredBooks = handleGroupBooks(filteredBooks, groupCriteria);
    filteredBooks = handleSortBooks(filteredBooks);

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
                handleEditBook={handleEditBook}
              />
            ))}
          </ul>
        </div>
      );
    });
  }, [
    books,
    groupCriteria,
    handleGroupBooks,
    handleSortBooks,
    handleEditBook,
    handleDeleteBook,
  ]);

  // function handles add a new book
  const handleAddNewBook = async (book) => {
    setIsAppLoading(true);

    const { publicationYear, ...rest } = book;
    const newBook = publicationYear
      ? { publication_year: publicationYear, ...rest }
      : book;

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

  // function handles recommend a good book by given conditions
  const handleRecommendGoodBook = () => {
    // A good book should be published at least 3 years ago or earlier
    const currentYear = new Date().getFullYear();
    let filteredBooks = books.filter(
      (book) =>
        book?.publicationYear && currentYear - book?.publicationYear >= 3
    );

    // From all these books, pick ones with the highest rating
    let maxRating = 0;
    let results = [];

    filteredBooks.forEach((book) => {
      if (book?.rating && book?.rating > maxRating) {
        maxRating = book?.rating;
        results = [];
        results.push(book);
      } else if (book?.rating && book?.rating === maxRating) results.push(book);
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

    return goodBook;
  };

  const handleChangeGroupCriteria = (e) => {
    setIsAppLoading(true);
    setTimeout(() => {
      setIsAppLoading(false);
      setGroupCriteria(e.target.value);
    }, 500);
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

          <span className="options__label">Group by : </span>
          <select
            defaultValue="publicationYear"
            name="group_criteria"
            id="group_criteria"
            onChange={handleChangeGroupCriteria}
          >
            <option value="publicationYear">Publication year</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {isAppLoading ? (
          <AppLoading />
        ) : (
          <>
            <h2>Recommended book</h2>
            <BookItem
              book={handleRecommendGoodBook()}
              handleDeleteBook={handleDeleteBook}
              handleEditBook={handleEditBook}
            />
            {handleRenderBooks()}

            <h2>
              Books without{" "}
              {groupCriteria === "publicationYear" ? "a year" : groupCriteria}
            </h2>
            <ul className="book__list">
              {books
                .filter((book) => !book[groupCriteria])
                .map((filteredBook) => (
                  <BookItem
                    book={filteredBook}
                    key={filteredBook?.id}
                    handleDeleteBook={handleDeleteBook}
                    handleEditBook={handleEditBook}
                  />
                ))}
            </ul>

            {isShowAddBookModal && (
              <BookModal
                formTitle="Add book"
                handleMainFeature={handleAddNewBook}
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
