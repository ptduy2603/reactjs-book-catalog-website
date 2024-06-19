import styles from "./CustomButton.module.scss";

function CustomButton({ title, icon, handleOnClick = () => {} }) {
  return (
    <>
      <button className={styles.wrapper} onClick={handleOnClick}>
        {icon}
        <span>{title}</span>
      </button>
    </>
  );
}

export default CustomButton;
