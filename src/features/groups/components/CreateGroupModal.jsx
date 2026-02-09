import React from "react";
import LiquidInput from "../../../components/ui/LiquidInput";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./CreateGroupModal.module.css";

class CreateGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      isPrivate: false,
      avatar: "",
    };
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.body.style.overflow = "";
  }

  handleClickOutside = (event) => {
    if (this.modalRef.current === event.target) {
      this.props.onClose();
    }
  };

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  handleTogglePrivate = () => {
    this.setState((prev) => ({ isPrivate: !prev.isPrivate }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, description, isPrivate, avatar } = this.state;
    const { onCreate } = this.props;

    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim(),
      isPrivate,
      avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === "Escape") {
      this.props.onClose();
    }
  };

  render() {
    const { onClose } = this.props;
    const { name, description, isPrivate } = this.state;

    return (
      <div
        className={styles.overlay}
        ref={this.modalRef}
        onKeyDown={this.handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title} id="modal-title">
              CREATE_GROUP
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={this.handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Group Name *</label>
              <LiquidInput
                type="text"
                placeholder="Enter group name"
                value={name}
                onChange={this.handleChange("name")}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe what this group is about..."
                value={description}
                onChange={this.handleChange("description")}
                rows={4}
                maxLength={500}
              />
              <span className={styles.charCount}>
                {description.length}/500
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isPrivate}
                  onChange={this.handleTogglePrivate}
                />
                <span className={styles.checkboxText}>
                  <span className={styles.checkboxIcon}>🔒</span>
                  Private Group
                </span>
                <span className={styles.checkboxHint}>
                  Only approved members can see posts
                </span>
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                CANCEL
              </button>
              <EncryptButton type="submit">
                CREATE
              </EncryptButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateGroupModal;
