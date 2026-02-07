import React from "react";
import styles from "./LiquidInput.module.css";

class LiquidInput extends React.Component {
  render() {
    const {
      type = "text",
      placeholder,
      value,
      onChange,
      maxLength,
      className = "",
      ...rest
    } = this.props;

    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`${styles.input} ${className}`}
        {...rest}
      />
    );
  }
}

export default LiquidInput;
