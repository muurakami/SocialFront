import React, { useMemo } from "react";
import ThemeToggle from "../../components/ui/ThemeToggle";
import styles from "./AuthLayout.module.css";

const generateAscii = () => {
  const chars = "01@#%&?!/|\\-_.:;*~";
  const count = (window.innerWidth / 6) * (window.innerHeight / 12);
  let result = "";
  for (let i = 0; i < count; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

class AuthLayout extends React.Component {
  constructor(props) {
    super(props);
    this.asciiArt = generateAscii();
  }

  render() {
    return (
      <div className={styles.container}>
        <ThemeToggle />

        <div className={styles.backgroundLayer} />

        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />

        <div className={styles.grid} />

        <pre className={styles.ascii}>{this.asciiArt}</pre>

        <div className={styles.scanlines} />

        <div className={styles.content}>{this.props.children}</div>

        <div className={styles.vignette} />
      </div>
    );
  }
}

export default AuthLayout;
