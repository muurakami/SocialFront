import React from "react";
import styles from "./AntigravityButton.module.css";

class AntigravityButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      particles: [],
      isHovered: false,
    };
    this.buttonRef = React.createRef();
    this.animationFrameId = null;
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  createParticles = () => {
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    return particles;
  };

  handleMouseEnter = () => {
    this.setState({
      isHovered: true,
      particles: this.createParticles(),
    });
  };

  handleMouseLeave = () => {
    this.setState({
      isHovered: false,
      particles: [],
    });
  };

  handleClick = (e) => {
    const { onClick } = this.props;
    
    if (this.buttonRef.current) {
      const rect = this.buttonRef.current.getBoundingClientRect();
      const rippleCount = 3;
      
      for (let i = 0; i < rippleCount; i++) {
        setTimeout(() => {
          this.createRipple(
            e.clientX - rect.left,
            e.clientY - rect.top
          );
        }, i * 100);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  createRipple = (x, y) => {
    if (!this.buttonRef.current) return;

    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.buttonRef.current.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  render() {
    const { children, className = "", disabled, type = "button" } = this.props;
    const { particles, isHovered } = this.state;

    return (
      <button
        ref={this.buttonRef}
        className={`${styles.button} ${isHovered ? styles.hovered : ""} ${className}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        disabled={disabled}
        type={type}
      >
        <span className={styles.content}>{children}</span>

        {isHovered && (
          <div className={styles.particlesContainer}>
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={styles.particle}
                style={{
                  left: `${particle.x}%`,
                  bottom: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  animationDuration: `${particle.speedY}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className={styles.glow} />
      </button>
    );
  }
}

export default AntigravityButton;
