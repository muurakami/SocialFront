import React from "react";
import styles from "./EncryptButton.module.css";

class EncryptButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayText: props.children,
    };
    this.chars = "!<>-_\\/[]{}—=+*^?#________"; // Символы для шифрования
    this.intervalId = null;
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  encrypt = () => {
    const { children } = this.props;
    const finalText = children.toString();
    let iteration = 0;

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.setState({
        displayText: finalText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return finalText[index];
            }
            if (char === " ") return " ";
            return this.chars[Math.floor(Math.random() * this.chars.length)];
          })
          .join(""),
      });

      iteration += 1 / 3; // Скорость расшифровки

      if (iteration >= finalText.length) {
        clearInterval(this.intervalId);
        this.setState({ displayText: finalText });
      }
    }, 30); // 30ms между кадрами
  };

  decrypt = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.setState({ displayText: this.props.children });
  };

  render() {
    const {
      onClick,
      type = "button",
      variant = "primary",
      className = "",
      ...rest
    } = this.props;
    const { displayText } = this.state;

    return (
      <button
        type={type}
        onClick={onClick}
        onMouseEnter={this.encrypt}
        onMouseLeave={this.decrypt}
        className={`${styles.button} ${styles[variant]} ${className}`}
        {...rest}
      >
        <span className={styles.text}>{displayText}</span>
      </button>
    );
  }
}

export default EncryptButton;
