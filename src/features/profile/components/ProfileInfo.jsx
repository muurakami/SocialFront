import React from "react";
import EncryptButton from "../../../components/ui/EncryptButton";
import styles from "./ProfileInfo.module.css";

class ProfileInfo extends React.Component {
  render() {
    const { user, onEdit } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.names}>
            <h1 className={styles.username}>
              {user.firstName} {user.lastName}
            </h1>
            <p className={styles.handle}>
              @{user.firstName.toLowerCase()}_{user.lastName.toLowerCase()}
            </p>
          </div>
          <EncryptButton onClick={onEdit} className={styles.editBtn}>
            EDIT_PROFILE
          </EncryptButton>
        </div>

        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        <div className={styles.stats}>
          {/* Статистика (Posts, Followers и т.д.) */}
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>posts</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>followers</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>following</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileInfo;
