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
    const emoji = theme === "dark" ? "🌙" : "☀️";

    return (
      <button
        className={styles.toggle}
        onClick={this.toggleTheme}
        aria-label="Toggle theme"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <span className={styles.emoji}>{emoji}</span>
      </button>
    );
  }
}

export default ThemeToggle;
