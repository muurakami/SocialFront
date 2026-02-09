import React from "react";
import styles from "./PageTransition.module.css";

class PageTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEntering: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isEntering: false });
    }, 50);
  }

  render() {
    const { children } = this.props;
    const { isEntering } = this.state;

    return (
      <div className={`${styles.transition} ${isEntering ? styles.entering : styles.entered}`}>
        {children}
      </div>
    );
  }
}

export default PageTransition;
