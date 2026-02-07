import React from "react";
import styles from "./Avatar.module.css";

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageError: false,
    };
  }

  handleError = () => {
    this.setState({ imageError: true });
  };

  getInitials() {
    const { alt } = this.props;
    if (!alt) return "?";

    const names = alt.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return alt.substring(0, 2).toUpperCase();
  }

  render() {
    const { src, alt, size = 40, onClick } = this.props;
    const { imageError } = this.state;

    const style = {
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size / 2.5}px`,
    };

    if (!src || imageError) {
      return (
        <div
          className={styles.avatar}
          style={style}
          onClick={onClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          aria-label={alt}
        >
          {this.getInitials()}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={styles.avatar}
        style={style}
        onError={this.handleError}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        loading="lazy"
      />
    );
  }
}

export default Avatar;
