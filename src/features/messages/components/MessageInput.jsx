import React from "react";
import styles from "./MessageInput.module.css";

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
    this.textareaRef = React.createRef();
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value });
    this.adjustHeight();
  };

  adjustHeight = () => {
    const textarea = this.textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { message } = this.state;
    const { onSend } = this.props;

    if (!message.trim()) return;

    onSend(message);
    this.setState({ message: "" });
    
    if (this.textareaRef.current) {
      this.textareaRef.current.style.height = "auto";
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e);
    }
  };

  render() {
    const { message } = this.state;

    return (
      <form className={styles.container} onSubmit={this.handleSubmit}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={this.textareaRef}
            className={styles.textarea}
            placeholder="Type a message..."
            value={message}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            rows={1}
            aria-label="Message"
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <span className={styles.sendIcon}>➤</span>
          </button>
        </div>
      </form>
    );
  }
}

export default MessageInput;
