import React from "react";
import styles from "./DynamicIsland.module.css";

class DynamicIsland extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };
  }

  handleToggle = () => {
    this.setState((prev) => ({ isExpanded: !prev.isExpanded }));
  };

  render() {
    const { 
      icon, 
      title, 
      subtitle, 
      expandedContent,
      position = "top",
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <div 
        className={`${styles.island} ${isExpanded ? styles.expanded : ""} ${styles[position]}`}
        onClick={this.handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleToggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className={styles.compact}>
          <span className={styles.icon}>{icon}</span>
          {!isExpanded && (
            <div className={styles.info}>
              <span className={styles.title}>{title}</span>
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
          )}
        </div>

        {isExpanded && expandedContent && (
          <div className={styles.expandedContent}>
            {expandedContent}
          </div>
        )}
      </div>
    );
  }
}

export default DynamicIsland;
