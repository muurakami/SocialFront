import React from "react";
import styles from "./MagneticCard.module.css";

class MagneticCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
    };
    this.cardRef = React.createRef();
  }

  handleMouseMove = (e) => {
    if (!this.cardRef.current) return;

    const rect = this.cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    this.setState({ x, y, rotateX, rotateY });
  };

  handleMouseLeave = () => {
    this.setState({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
    });
  };

  render() {
    const { children, className = "" } = this.props;
    const { x, y, rotateX, rotateY } = this.state;

    return (
      <div
        ref={this.cardRef}
        className={`${styles.card} ${className}`}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <div
          className={styles.glow}
          style={{
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(0, 255, 136, 0.3), transparent 50%)`,
          }}
        />
        {children}
      </div>
    );
  }
}

export default MagneticCard;
