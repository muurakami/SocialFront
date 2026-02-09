import React from "react";
import Avatar from "../../../components/ui/Avatar";
import Skeleton from "../../../components/ui/Skeleton";
import styles from "./GroupList.module.css";

class GroupList extends React.Component {
  renderSkeleton() {
    return Array.from({ length: 4 }).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.skeletonItem}>
        <Skeleton variant="avatar" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="title" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    ));
  }

  render() {
    const { groups, selectedGroup, onSelectGroup, isLoading } = this.props;

    if (isLoading) {
      return <div className={styles.list}>{this.renderSkeleton()}</div>;
    }

    if (groups.length === 0) {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No groups yet</p>
        </div>
      );
    }

    return (
      <div className={styles.list}>
        {groups.map((group) => {
          const isSelected = selectedGroup?.id === group.id;

          return (
            <div
              key={group.id}
              className={`${styles.item} ${isSelected ? styles.selected : ""} ${!group.isJoined ? styles.notJoined : ""}`}
              onClick={() => onSelectGroup(group)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectGroup(group);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Group: ${group.name}`}
            >
              <Avatar
                src={group.avatar}
                alt={group.name}
                size={48}
              />

              <div className={styles.info}>
                <div className={styles.header}>
                  <h3 className={styles.name}>{group.name}</h3>
                  {group.isPrivate && (
                    <span className={styles.privateBadge} title="Private group">🔒</span>
                  )}
                </div>
                <p className={styles.memberCount}>
                  {group.memberCount.toLocaleString()} members
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default GroupList;
