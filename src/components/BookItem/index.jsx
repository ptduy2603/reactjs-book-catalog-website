import { useState } from "react";
import styles from "./BookItem.module.scss";

function BookItem({ book, handleDeleteBook }) {
  const [isShowDetail, setIsShowDetail] = useState(false);

  const handleShowBookDetail = () => setIsShowDetail(true);
  const handleHideBookDetail = () => setIsShowDetail(false);

  const handleDeleteBtnClick = (event) => {
    event.stopPropagation();
    handleDeleteBook(book);
  };

  return (
    <>
      <li className={styles.wrapper} onClick={handleShowBookDetail}>
        <div className={styles["book__info"]}>
          <p className={styles.name}>{book?.name}</p>
        </div>
        <div className={styles["book__options"]} onClick={handleDeleteBtnClick}>
          <i className="fa-solid fa-trash"></i>
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
    </>
  );
}

export default BookItem;
