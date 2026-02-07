import React from "react";
import styles from "./SerfBackground.module.css";

class SerfBackground extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <img src="/serf.png" alt="serfer" className={styles.image} />
      </div>
    );
  }
}

export default SerfBackground;
