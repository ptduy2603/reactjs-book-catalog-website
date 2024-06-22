import { useState } from "react";
import PropTypes from "prop-types";

import styles from "./BookItem.module.scss";
import BookModal from "../BookModal";
function BookItem({ book, handleDeleteBook, handleEditBook }) {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);

  const handleShowBookDetail = () => setIsShowDetail(true);
  const handleHideBookDetail = () => setIsShowDetail(false);

  const handleDeleteBtnClick = (event) => {
    event.stopPropagation();
    handleDeleteBook(book);
  };

  const handleShowEditBookModal = (e) => {
    e.stopPropagation();
    setIsShowEditModal(true);
  };

  return (
    <>
      <li className={styles.wrapper} onClick={handleShowBookDetail}>
        <div className={styles["book__info"]}>
          <p className={styles.name}>{book?.name}</p>
        </div>

        <div className={styles["book__options"]}>
          <button onClick={handleShowEditBookModal}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button onClick={handleDeleteBtnClick}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>

      {isShowDetail && (
        <div className={styles.modal}>
          <div className={styles["modal__content"]}>
            <button
              className={styles["close__btn"]}
              onClick={handleHideBookDetail}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3>{book?.name}</h3>
            <p>List of authors: {book?.authors.join(" , ")}</p>
            <p>Publication year : {book?.publicationYear || "Unknown"}</p>
            <p>Rating : {book?.rating || "Unknown"}</p>
            <p>ISBN : {book?.ISBN || "Unknown"}</p>
          </div>
        </div>
      )}

      {isShowEditModal && (
        <BookModal
          formTitle="Edit book"
          initialBook={book}
          handleCloseModal={() => setIsShowEditModal(false)}
          handleMainFeature={handleEditBook}
        />
      )}
    </>
  );
}

BookItem.propTypes = {
  book: PropTypes.object.isRequired,
  handleDeleteBook: PropTypes.func.isRequired,
  handleEditBook: PropTypes.func.isRequired,
};

export default BookItem;
