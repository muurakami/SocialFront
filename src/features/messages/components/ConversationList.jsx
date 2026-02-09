import React from "react";
import Avatar from "../../../components/ui/Avatar";
import Skeleton from "../../../components/ui/Skeleton";
import styles from "./ConversationList.module.css";

class ConversationList extends React.Component {
  formatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  }

  renderSkeleton() {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.skeletonItem}>
        <Skeleton variant="avatar" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
    ));
  }

  render() {
    const { conversations, selectedConversation, onSelectConversation, isLoading } = this.props;

    if (isLoading) {
      return <div className={styles.list}>{this.renderSkeleton()}</div>;
    }

    if (conversations.length === 0) {
      return (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No conversations yet</p>
        </div>
      );
    }

    return (
      <div className={styles.list}>
        {conversations.map((conversation) => {
          const isSelected = selectedConversation?.id === conversation.id;
          const hasUnread = conversation.unreadCount > 0;

          return (
            <div
              key={conversation.id}
              className={`${styles.item} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelectConversation(conversation)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectConversation(conversation);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Conversation with ${conversation.participant.firstName}`}
            >
              <div className={styles.avatarWrapper}>
                <Avatar
                  src={conversation.participant.avatar}
                  alt={conversation.participant.firstName}
                  size={56}
                />
                {conversation.participant.isOnline && (
                  <div className={styles.onlineIndicator} aria-label="Online" />
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.header}>
                  <h3 className={styles.name}>
                    {conversation.participant.firstName} {conversation.participant.lastName}
                  </h3>
                  <span className={styles.time}>
                    {this.formatTimestamp(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                <div className={styles.preview}>
                  <p className={`${styles.lastMessage} ${hasUnread ? styles.unread : ""}`}>
                    {conversation.lastMessage.content}
                  </p>
                  {hasUnread && (
                    <span className={styles.unreadBadge} aria-label="Unread messages">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ConversationList;
