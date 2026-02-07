import React from "react";
import LiquidInput from "../../../components/ui/LiquidInput";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./EditProfileModal.module.css";
import UserService from "../../../services/UserService";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      avatarFile: null,
      avatarPreview: user.avatar || null,
      isLoading: false,
      error: null,
      success: null,
    };
  }

  componentDidMount() {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this.handleEscapeKey);
  }

  componentWillUnmount() {
    document.body.style.overflow = "unset";
    document.removeEventListener("keydown", this.handleEscapeKey);
  }

  handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      this.props.onClose();
    }
  };

  handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.setState({ error: "File size must be less than 5MB" });
        return;
      }

      this.setState({
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
        error: null,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null, success: null });

    try {
      const { user } = this.props;
      const { firstName, lastName, bio, location, website, avatarFile } =
        this.state;

      const updatedUser = await UserService.updateProfile(user.id, {
        firstName,
        lastName,
        bio,
        location,
        website,
      });

      if (avatarFile) {
        await UserService.uploadAvatar(user.id, avatarFile);
      }

      this.setState({
        success: "Profile updated!",
        isLoading: false,
      });

      if (this.props.onSave) {
        this.props.onSave(updatedUser);
      }

      setTimeout(() => {
        this.props.onClose();
      }, 1000);
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      avatarPreview,
      isLoading,
      error,
      success,
    } = this.state;

    return (
      <div className={styles.backdrop} onClick={this.handleBackdropClick}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>EDIT_PROFILE</h2>
            <button
              className={styles.closeBtn}
              onClick={this.props.onClose}
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={this.handleSubmit} className={styles.form}>
            {error && <div className={styles.errorAlert}>{error}</div>}
            {success && <div className={styles.successAlert}>{success}</div>}

            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className={styles.avatarLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleAvatarChange}
                  className={styles.fileInput}
                />
                <span className={styles.uploadBtn}>CHANGE_AVATAR</span>
              </label>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>FIRST_NAME</label>
                <LiquidInput
                  type="text"
                  value={firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>LAST_NAME</label>
                <LiquidInput
                  type="text"
                  value={lastName}
                  onChange={(e) => this.setState({ lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                BIO <span className={styles.charCount}>{bio.length}/160</span>
              </label>
              <textarea
                className={styles.textarea}
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 160) {
                    this.setState({ bio: e.target.value });
                  }
                }}
                rows={4}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={this.props.onClose}
                disabled={isLoading}
              >
                CANCEL
              </button>

              <EncryptButton type="submit" disabled={isLoading}>
                {isLoading ? "SAVING..." : "SAVE_CHANGES"}
              </EncryptButton>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProfileModal;
