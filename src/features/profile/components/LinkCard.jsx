import React from "react";
import styles from "./LinkCard.module.css";

class LinkCard extends React.Component {
  render() {
    const { link } = this.props;

    return (
      <div className={styles.card} style={{ "--link-color": link.color }}>
        <div className={styles.header}>
          <div className={styles.indicator} />
          <h3 className={styles.name}>{link.name}</h3>
          {link.unread > 0 && (
            <span className={styles.badge}>{link.unread}</span>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.members}>
            {link.members.toLocaleString()} members
          </span>
        </div>
      </div>
    );
  }
}

export default LinkCard;
