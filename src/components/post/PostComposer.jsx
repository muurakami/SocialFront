import React from "react";
import Avatar from "../ui/Avatar";
import LiquidButton from "../ui/LiquidButton";
import styles from "./PostComposer.module.css";

class PostComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      images: [],
      imagePreviews: [],
      isSubmitting: false,
    };
    this.textareaRef = React.createRef();
    this.fileInputRef = React.createRef();
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

  handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const { images } = this.state;

    if (images.length + files.length > 4) {
      alert("You can only upload up to 4 images per post");
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    this.setState((prev) => ({
      images: [...prev.images, ...validFiles],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));

    e.target.value = "";
  };

  handleRemoveImage = (index) => {
    this.setState((prev) => {
      URL.revokeObjectURL(prev.imagePreviews[index]);
      return {
        images: prev.images.filter((_, i) => i !== index),
        imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
      };
    });
  };

  handleImageButtonClick = () => {
    this.fileInputRef.current?.click();
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { content, images } = this.state;
    const { onSubmit } = this.props;

    if (!content.trim() && images.length === 0) return;

    this.setState({ isSubmitting: true });

    try {
      await onSubmit(content, images);
      this.setState({ 
        content: "", 
        images: [], 
        imagePreviews: [] 
      });
      if (this.textareaRef.current) {
        this.textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  componentWillUnmount() {
    this.state.imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }

  render() {
    const { user } = this.props;
    const { content, imagePreviews, images, isSubmitting } = this.state;

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

        {imagePreviews.length > 0 && (
          <div className={styles.imagePreview}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className={styles.previewItem}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => this.handleRemoveImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.actions}>
            <input
              ref={this.fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={this.handleImageSelect}
              className={styles.fileInput}
              aria-label="Upload images"
            />
            <button
              type="button"
              className={styles.iconButton}
              onClick={this.handleImageButtonClick}
              disabled={images.length >= 4}
              aria-label="Add images"
              title="Add images (max 4)"
            >
              <span className={styles.icon}>🖼</span>
              {images.length > 0 && (
                <span className={styles.badge}>{images.length}</span>
              )}
            </button>
            <span className={styles.charCount} aria-live="polite">
              {content.length}/5000
            </span>
          </div>
          <LiquidButton
            type="submit"
            disabled={(!content.trim() && images.length === 0) || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </LiquidButton>
        </div>
      </form>
    );
  }
}

export default PostComposer;
