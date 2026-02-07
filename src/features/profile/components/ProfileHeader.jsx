import React from "react";
import Avatar from "../../../components/ui/Avatar";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./ProfileHeader.module.css";

class ProfileHeader extends React.Component {
  render() {
    const { user, isEditing, onEditToggle } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <Avatar
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            size={120}
          />
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>ONLINE</span>
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>
            {user.firstName} {user.lastName}
          </h1>
          <p className={styles.email}>{user.email}</p>
          <p className={styles.meta}>
            Joined{" "}
            {new Date(user.joinedAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <EncryptButton
            onClick={onEditToggle}
            variant={isEditing ? "secondary" : "primary"}
          >
            {isEditing ? "CANCEL_EDIT" : "EDIT_PROFILE"}
          </EncryptButton>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
