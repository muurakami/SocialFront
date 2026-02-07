import React from "react";
import LinkCard from "./LinkCard";
import styles from "./LinksList.module.css";

class LinksList extends React.Component {
  render() {
    const { links } = this.props;

    return (
      <div className={styles.container}>
        <h2 className={styles.title}>
          <span className={styles.icon}>⚡</span>
          MY_LINKS
        </h2>

        <div className={styles.list}>
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        <button className={styles.addBtn}>
          <span className={styles.addIcon}>+</span>
          ADD_NEW_LINK
        </button>
      </div>
    );
  }
}

export default LinksList;
