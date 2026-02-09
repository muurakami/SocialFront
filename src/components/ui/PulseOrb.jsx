import React from "react";
import styles from "./PulseOrb.module.css";

class PulseOrb extends React.Component {
  render() {
    const { size = 200, color = "var(--color-primary)", className = "" } = this.props;

    return (
      <div
        className={`${styles.orb} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <div
          className={styles.core}
          style={{ background: color }}
        />
        <div
          className={styles.ring1}
          style={{ borderColor: color }}
        />
        <div
          className={styles.ring2}
          style={{ borderColor: color }}
        />
        <div
          className={styles.ring3}
          style={{ borderColor: color }}
        />
      </div>
    );
  }
}

export default PulseOrb;
