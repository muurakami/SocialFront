import React from "react";
import styles from "./Skeleton.module.css";

class Skeleton extends React.Component {
  render() {
    const {
      variant = "text",
      width,
      height,
      count = 1,
      className = "",
    } = this.props;

    const skeletonClass = `${styles.skeleton} ${styles[variant]} ${className}`;
    const style = { width, height };

    if (count > 1) {
      return (
        <div className={styles.group}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className={skeletonClass} style={style} />
          ))}
        </div>
      );
    }

    return <div className={skeletonClass} style={style} />;
  }
}

export default Skeleton;
