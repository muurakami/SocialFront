import React from "react";
import styles from "./ThemeToggle.module.css";

class ThemeToggle extends React.Component {
  constructor(props) {
    super(props);

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    this.state = {
      theme: initialTheme,
    };
  }

  componentDidMount() {
    this.applyTheme(this.state.theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  toggleTheme = () => {
    const newTheme = this.state.theme === "dark" ? "light" : "dark";
    this.setState({ theme: newTheme });
    this.applyTheme(newTheme);
  };
  render() {
    const { theme } = this.state;
    // Получаем вариант из пропсов (по умолчанию "fixed")
    const { variant = "fixed" } = this.props;

    const emoji = theme === "dark" ? "🌙" : "☀️";

    // Выбираем класс в зависимости от варианта
    const buttonClass =
      variant === "inline"
        ? `${styles.toggle} ${styles.toggleInline}`
        : styles.toggle;

    return (
      <button
        className={buttonClass}
        onClick={this.toggleTheme}
        aria-label="Toggle theme"
        type="button" // Важно, чтобы не сабмитил формы
      >
        <span className={styles.emoji}>{emoji}</span>
      </button>
    );
  }
}

export default ThemeToggle;
