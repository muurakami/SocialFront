import React from "react";
import styles from "./BentoGrid.module.css";

class BentoGrid extends React.Component {
  render() {
    const { children, className = "" } = this.props;

    return (
      <div className={`${styles.bentoGrid} ${className}`}>
        {children}
      </div>
    );
  }
}

class BentoCard extends React.Component {
  render() {
    const { 
      children, 
      className = "", 
      span = "1",
      hover3d = false,
      glow = false,
    } = this.props;

    const cardRef = React.createRef();
    const [transform, setTransform] = React.useState("");

    const handleMouseMove = (e) => {
      if (!hover3d || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    const handleMouseLeave = () => {
      if (hover3d) {
        setTransform("");
      }
    };

    return (
      <div
        ref={cardRef}
        className={`${styles.bentoCard} ${styles[`span${span}`]} ${glow ? styles.glow : ""} ${className}`}
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  }
}

export default BentoGrid;
export { BentoCard };
