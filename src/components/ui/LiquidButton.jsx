import React from "react";
import styles from "./LiquidButton.module.css";

class LiquidButton extends React.Component {
  render() {
    const {
      children,
      onClick,
      type = "button",
      variant = "primary",
      disabled = false,
      ...rest
    } = this.props;

    const buttonClass =
      variant === "secondary" ? styles.secondary : styles.primary;

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${styles.button} ${buttonClass}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
}

export default LiquidButton;
