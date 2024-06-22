import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styles from "./BookModal.module.scss";
import CustomButton from "../CustomButton";
import { validateISBN } from "../../utils";

function BookModal({
  formTitle,
  handleCloseModal,
  handleMainFeature,
  initialBook,
}) {
  const [name, setName] = useState("");
  const [authors, setAuthors] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [rating, setRating] = useState("");
  const [ISBN, setISBN] = useState("");
  const [errors, setErrors] = useState({});

  const handleValidateData = async () => {
    let errors = {};

    if (!name.trim()) errors.name = "Name is required!";
    else if (name.trim().length > 100)
      errors.name = "Name can not be longer than 100 characters";

    if (!authors.trim())
      errors.authors = "Book should have at least one author!";

    // publication field validation
    if (publicationYear) {
      if (!Number.isInteger(Number(publicationYear)))
        errors.publicationYear = "Publication year must be an integer!";
      else if (Number.parseInt(publicationYear) <= 1800)
        errors.publicationYear = "Publication year must be greater than 1800!";
    }

    // rating field validation
    if (rating) {
      if (!Number.isInteger(Number(rating)))
        errors.rating = "Rating must be an integer!";
      else if (Number.parseInt(rating) < 0 || Number.parseInt(rating) > 10)
        errors.rating = "Rating must be from 0 to 10!";
    }

    // ISBN field validation (optional)
    if (ISBN.trim() && !validateISBN(ISBN.trim()))
      errors.ISBN = "ISBN is invalid!";

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

      if (initialBook) newBook.id = initialBook?.id;
      if (publicationYear) newBook.publicationYear = Number(publicationYear);
      if (ISBN.trim()) newBook.ISBN = ISBN.trim();

      handleCloseModal();
      await handleMainFeature(newBook);
    }
  };

  useEffect(() => {
    if (initialBook) {
      setName(initialBook?.name);
      setAuthors(initialBook?.authors.join(","));
      setPublicationYear(initialBook?.publicationYear || "");
      setRating(initialBook?.rating || "");
      setISBN(initialBook?.ISBN || "");
    }
  }, [initialBook]);

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.form}>
          <h2>{formTitle}</h2>
          <div className={styles["form__group"]}>
            <label htmlFor="name">Name*: </label>
            <input
              type="text"
              className={errors?.name && styles.error}
              maxLength={100}
              id="name"
              placeholder="Enter name..."
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
              className={errors?.authors && styles.error}
              id="authors"
              placeholder="Enter authors..."
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
              placeholder="Enter publication year..."
              min={1800}
              className={errors?.publicationYear && styles.error}
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              onFocus={() => setErrors({ ...errors, publicationYear: "" })}
            />
            {errors?.publicationYear && (
              <span className={styles.error}>{errors?.publicationYear}</span>
            )}
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="rating">Rating: </label>
            <input
              className={errors?.rating && styles?.error}
              type="number"
              min={0}
              max={10}
              placeholder="Enter rating..."
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              onFocus={() => setErrors({ ...errors, rating: "" })}
            />
            {errors?.rating && (
              <span className={styles.error}>{errors?.rating}</span>
            )}
          </div>

          <div className={styles["form__group"]}>
            <label htmlFor="ISBN">ISBN: </label>
            <input
              className={errors?.ISBN && styles?.error}
              type="text"
              id="ISBN"
              value={ISBN}
              placeholder="Enter ISBN..."
              onChange={(e) => setISBN(e.target.value)}
              onFocus={() => setErrors({ ...errors, ISBN: "" })}
            />
            {errors?.ISBN && (
              <span className={styles.error}>{errors?.ISBN}</span>
            )}
          </div>

          <div
            className={styles["form__group"] + " " + styles["form__controls"]}
          >
            <CustomButton title="Cancel" handleOnClick={handleCloseModal} />

            <CustomButton
              title={formTitle}
              handleOnClick={handleValidateData}
            />
          </div>
        </div>
      </div>
    </>
  );
}

BookModal.propTypes = {
  formTitle: PropTypes.string,
  handleCloseModal: PropTypes.func,
  handleMainFeature: PropTypes.func.isRequired,
  initialBook: PropTypes.object,
};

export default BookModal;
