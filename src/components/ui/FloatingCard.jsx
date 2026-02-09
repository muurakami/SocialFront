import React from "react";
import styles from "./FloatingCard.module.css";

class FloatingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  render() {
    const { 
      children, 
      className = "",
      elevation = "medium",
      glow = false,
    } = this.props;
    const { isHovered } = this.state;

    return (
      <div
        className={`${styles.card} ${styles[elevation]} ${glow ? styles.glow : ""} ${className}`}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        {glow && isHovered && <div className={styles.glowEffect} />}
        {children}
      </div>
    );
  }
}

export default FloatingCard;
