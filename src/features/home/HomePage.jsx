import React from "react";
import MatrixRain from "./components/MatrixRain";
import SamuraiBackground from "./components/SerfBackground";
import ASCIISphere from "./components/ASCIISphere"; // Новый импорт
import HeroContent from "./components/HeroContent";
import styles from "./HomePage.module.css";

class HomePage extends React.Component {
  handleJoinClick = () => {
    window.location.href = "/register";
  };

  render() {
    return (
      <div className={styles.page}>
        <MatrixRain />
        <SamuraiBackground />
        <ASCIISphere />
        <HeroContent onJoinClick={this.handleJoinClick} />
      </div>
    );
  }
}

export default HomePage;
