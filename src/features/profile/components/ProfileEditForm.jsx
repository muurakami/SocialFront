import React from "react";
import LiquidInput from "../../../components/ui/LiquidInput";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./ProfileEditForm.module.css";

class ProfileEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      location: props.user.location || "",
      bio: props.user.bio || "",
    };
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSave(this.state);
  };

  render() {
    const { onCancel } = this.props;
    const { firstName, lastName, location, bio } = this.state;

    return (
      <div className={styles.card}>
        <h2 className={styles.title}>
          <span className={styles.icon}>✎</span>
          EDIT_PROFILE
        </h2>

        <form onSubmit={this.handleSubmit} className={styles.form}>
          <LiquidInput
            type="text"
            placeholder="FIRST_NAME"
            value={firstName}
            onChange={this.handleChange("firstName")}
            required
          />

          <LiquidInput
            type="text"
            placeholder="LAST_NAME"
            value={lastName}
            onChange={this.handleChange("lastName")}
            required
          />

          <LiquidInput
            type="text"
            placeholder="LOCATION"
            value={location}
            onChange={this.handleChange("location")}
          />

          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="BIO"
              value={bio}
              onChange={this.handleChange("bio")}
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <EncryptButton type="submit" variant="primary">
              SAVE_CHANGES
            </EncryptButton>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelBtn}
            >
              [ CANCEL ]
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ProfileEditForm;
