import React from "react";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./HeroContent.module.css";

class HeroContent extends React.Component {
  handleLoginClick = () => {
    window.location.href = "/login";
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.glitch} data-text="NETWORK">
              NETWORK
            </span>
          </h1>

          <p className={styles.subtitle}>// Anonymous social platform</p>

          <p className={styles.description}>
            Enter the grid. Share encrypted thoughts.
            <br />
            Stay invisible. Stay connected.
          </p>

          <div className={styles.buttons}>
            <EncryptButton onClick={this.handleLoginClick}>LOGIN</EncryptButton>

            <EncryptButton onClick={this.props.onJoinClick}>
              JOIN_NOW
            </EncryptButton>
          </div>

          <div className={styles.footer}>
            <span className={styles.status}>● ONLINE</span>
            <span className={styles.version}>v2.0.26</span>
          </div>
        </div>
      </div>
    );
  }
}

export default HeroContent;
