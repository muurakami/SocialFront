import React from "react";
import LinkCard from "./LinkCard";
import styles from "./LinksGrid.module.css";

class LinksGrid extends React.Component {
  render() {
    const { links, onSubscribe } = this.props;

    if (links.length === 0) {
      return (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚠</div>
          <h3 className={styles.emptyTitle}>NO_LINKS_FOUND</h3>
          <p className={styles.emptyText}>
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {links.map((link) => (
          <LinkCard key={link.id} link={link} onSubscribe={onSubscribe} />
        ))}
      </div>
    );
  }
}

export default LinksGrid;
