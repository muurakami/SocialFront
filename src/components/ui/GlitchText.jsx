import React from "react";
import styles from "./GlitchText.module.css";

class GlitchText extends React.Component {
  render() {
    const { children, className = "" } = this.props;

    return (
      <div className={`${styles.glitch} ${className}`} data-text={children}>
        {children}
        <span className={styles.glitchLayer1} aria-hidden="true">
          {children}
        </span>
        <span className={styles.glitchLayer2} aria-hidden="true">
          {children}
        </span>
      </div>
    );
  }
}

export default GlitchText;
