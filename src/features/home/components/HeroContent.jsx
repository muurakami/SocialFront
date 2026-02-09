import React from "react";
import EncryptButton from "../../../components/ui/EncryptButton";
import AntigravityButton from "../../../components/ui/AntigravityButton";
import GlitchText from "../../../components/ui/GlitchText";
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
            <GlitchText>NETWORK</GlitchText>
          </h1>

          <p className={styles.subtitle}>// Anonymous social platform</p>

          <p className={styles.description}>
            Enter the grid. Share encrypted thoughts.
            <br />
            Stay invisible. Stay connected.
          </p>

          <div className={styles.buttons}>
            <AntigravityButton onClick={this.props.onJoinClick}>
              JOIN US
            </AntigravityButton>
          </div>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <button 
              onClick={this.handleLoginClick} 
              className={styles.loginLink}
              type="button"
            >
              Login
            </button>
          </p>

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
