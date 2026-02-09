import React from "react";
import styles from "./Toast.module.css";

class Toast extends React.Component {
  componentDidMount() {
    const { duration = 3000, onClose } = this.props;
    if (duration > 0 && onClose) {
      this.timeout = setTimeout(onClose, duration);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const { message, type = "info", onClose } = this.props;

    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };

    return (
      <div
        className={`${styles.toast} ${styles[type]}`}
        role="alert"
        aria-live="polite"
      >
        <div className={styles.icon}>{icons[type]}</div>
        <p className={styles.message}>{message}</p>
        {onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
}

class ToastContainer extends React.Component {
  static instance = null;

  constructor(props) {
    super(props);
    this.state = {
      toasts: [],
    };
    ToastContainer.instance = this;
  }

  static show(message, type = "info", duration = 3000) {
    if (ToastContainer.instance) {
      const toast = {
        id: Date.now(),
        message,
        type,
        duration,
      };
      
      ToastContainer.instance.setState((prev) => ({
        toasts: [...prev.toasts, toast],
      }));
    }
  }

  handleClose = (id) => {
    this.setState((prev) => ({
      toasts: prev.toasts.filter((toast) => toast.id !== id),
    }));
  };

  render() {
    const { toasts } = this.state;

    return (
      <div className={styles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => this.handleClose(toast.id)}
          />
        ))}
      </div>
    );
  }
}

export default ToastContainer;
export { Toast };
