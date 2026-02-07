import React from "react";
import Avatar from "../ui/Avatar";
import LiquidButton from "../ui/LiquidButton";
import styles from "./PostComposer.module.css";

class PostComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      isSubmitting: false,
    };
    this.textareaRef = React.createRef();
  }

  handleChange = (e) => {
    this.setState({ content: e.target.value });
    this.adjustTextareaHeight();
  };

  adjustTextareaHeight = () => {
    const textarea = this.textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { content } = this.state;
    const { onSubmit } = this.props;

    if (!content.trim()) return;

    this.setState({ isSubmitting: true });

    try {
      await onSubmit(content);
      this.setState({ content: "" });
      if (this.textareaRef.current) {
        this.textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { user } = this.props;
    const { content, isSubmitting } = this.state;

    return (
      <form className={styles.composer} onSubmit={this.handleSubmit}>
        <div className={styles.header}>
          <Avatar
            src={user?.avatar}
            alt={user ? `${user.firstName} ${user.lastName}` : "User"}
            size={48}
          />
          <textarea
            ref={this.textareaRef}
            className={styles.textarea}
            placeholder="What's on your mind?"
            value={content}
            onChange={this.handleChange}
            rows={1}
            maxLength={5000}
            aria-label="Post content"
          />
        </div>

        <div className={styles.footer}>
          <span className={styles.charCount} aria-live="polite">
            {content.length}/5000
          </span>
          <LiquidButton
            type="submit"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </LiquidButton>
        </div>
      </form>
    );
  }
}

export default PostComposer;
