import { useState } from "react";

import styles from "./AddBookModal.module.scss";
import CustomButton from "../CustomButton";

function AddBookModal({ handleCloseModal, handleAddNewBook }) {
  const [name, setName] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [rating, setRating] = useState("");
  const [ISBN, setISBN] = useState("");
  const [errors, setErrors] = useState({});

  const handleValidateData = () => {
    let errors = {};

    if (!name.trim()) errors.name = "Name is required!";

    if (!authors.trim())
      errors.authors = "Book should have at least one author!";

    if (Object.keys(errors).length) {
      return setErrors(errors);
    } else {
      const newBook = {
        name: name.trim(),
        authors: authors
          .trim()
          .split(",")
          .map((item) => item.trim()),
        rating: Number(rating) || 0,
      };

      if (publicationYear.trim())
        newBook.publicationYear = publicationYear.trim();
      if (ISBN.trim()) newBook.ISBN = ISBN.trim();

      handleAddNewBook(newBook);
      handleCloseModal();
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.form}>
          <h2>Add new book</h2>
          <div className={styles["form__group"]}>
            <label htmlFor="name">Name*: </label>
            <input
              type="text"
              id="name"
              autoFocus
              spellCheck="false"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setErrors({ ...errors, name: "" })}
            />
            {errors?.name && (
              <span className={styles.error}>{errors?.name}</span>
            )}
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="authors">
              List of authors (seperate with ,)*:{" "}
            </label>
            <input
              type="text"
              id="authors"
              spellCheck="false"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              onFocus={() => setErrors({ ...errors, authors: "" })}
            />
            {errors?.authors && (
              <span className={styles.error}>{errors?.authors}</span>
            )}
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="publicationYear">Publication year: </label>
            <input
              type="number"
              id="publicationYear"
              min={1800}
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
            />
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="rating">Rating: </label>
            <input
              type="number"
              min={0}
              max={10}
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="ISBN">ISBN: </label>
            <input
              type="text"
              id="ISBN"
              value={ISBN}
              onChange={(e) => setISBN(e.target.value)}
            />
          </div>

          <div
            className={styles["form__group"] + " " + styles["form__controls"]}
          >
            <CustomButton title="Cancel" handleOnClick={handleCloseModal} />

            <CustomButton title="Add" handleOnClick={handleValidateData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBookModal;
