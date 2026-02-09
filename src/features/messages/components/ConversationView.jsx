import React from "react";
import Avatar from "../../../components/ui/Avatar";
import MessageInput from "./MessageInput";
import styles from "./ConversationView.module.css";

class ConversationView extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  }

  groupMessagesByDate(messages) {
    const groups = {};
    
    messages.forEach(message => {
      const dateKey = new Date(message.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  }

  render() {
    const { conversation, messages, currentUser, onSendMessage, isLoading } = this.props;

    const messageGroups = this.groupMessagesByDate(messages);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.participantInfo}>
            <Avatar
              src={conversation.participant.avatar}
              alt={conversation.participant.firstName}
              size={40}
            />
            <div className={styles.details}>
              <h3 className={styles.name}>
                {conversation.participant.firstName} {conversation.participant.lastName}
              </h3>
              {conversation.participant.isOnline && (
                <span className={styles.status}>Active now</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.messages}>
          {isLoading ? (
            <div className={styles.loading}>Loading messages...</div>
          ) : (
            <>
              {messageGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.messageGroup}>
                  <div className={styles.dateDivider}>
                    <span className={styles.dateLabel}>
                      {this.formatDate(group.date)}
                    </span>
                  </div>

                  {group.messages.map((message, index) => {
                    const isOwn = message.senderId === currentUser.id;
                    const showAvatar = !isOwn && (
                      index === group.messages.length - 1 ||
                      group.messages[index + 1]?.senderId !== message.senderId
                    );

                    return (
                      <div
                        key={message.id}
                        className={`${styles.message} ${isOwn ? styles.own : styles.other}`}
                      >
                        {!isOwn && (
                          <div className={styles.avatarSpace}>
                            {showAvatar && (
                              <Avatar
                                src={conversation.participant.avatar}
                                alt={conversation.participant.firstName}
                                size={28}
                              />
                            )}
                          </div>
                        )}

                        <div className={styles.bubble}>
                          <p className={styles.content}>{message.content}</p>
                          <span className={styles.timestamp}>
                            {this.formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={this.messagesEndRef} />
            </>
          )}
        </div>

        <MessageInput onSend={onSendMessage} />
      </div>
    );
  }
}

export default ConversationView;
