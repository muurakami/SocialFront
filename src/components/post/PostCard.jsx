import React from "react";
import Avatar from "../ui/Avatar";
import styles from "./PostCard.module.css";

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: props.post.isLiked || false,
      likeCount: props.post.likeCount || 0,
      showComments: false,
    };
  }

  handleLike = async () => {
    const { post, onLike } = this.props;
    const { isLiked } = this.state;

    // Оптимистичный UI
    this.setState((prev) => ({
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      await onLike(post.id);
    } catch (error) {
      // Откат при ошибке
      this.setState({
        isLiked: isLiked,
        likeCount: this.props.post.likeCount,
      });
    }
  };

  toggleComments = () => {
    this.setState((prev) => ({ showComments: !prev.showComments }));
  };

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  render() {
    const { post } = this.props;
    const { isLiked, likeCount, showComments } = this.state;

    return (
      <article
        className={styles.card}
        aria-label={`Post by ${post.author.firstName}`}
      >
        <div className={styles.header}>
          <Avatar
            src={post.author.avatar}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            size={48}
          />
          <div className={styles.authorInfo}>
            <h3 className={styles.authorName}>
              {post.author.firstName} {post.author.lastName}
            </h3>
            <time className={styles.timestamp} dateTime={post.createdAt}>
              {this.formatDate(post.createdAt)}
            </time>
          </div>
        </div>

        <div className={styles.content}>
          <p>{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className={styles.images}>
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className={styles.image}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions} role="group" aria-label="Post actions">
          <button
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ""}`}
            onClick={this.handleLike}
            aria-label={isLiked ? "Unlike" : "Like"}
            aria-pressed={isLiked}
          >
            <span className={styles.icon}>{isLiked ? "♥" : "♡"}</span>
            <span className={styles.count}>{likeCount}</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={this.toggleComments}
            aria-label="Comment"
            aria-expanded={showComments}
          >
            <span className={styles.icon}>💬</span>
            <span className={styles.count}>{post.commentCount || 0}</span>
          </button>

          <button className={styles.actionBtn} aria-label="Share">
            <span className={styles.icon}>↗</span>
          </button>
        </div>

        {showComments && (
          <div className={styles.comments}>
            {/* Здесь будет компонент комментариев */}
            <p className={styles.commentsPlaceholder}>Comments section...</p>
          </div>
        )}
      </article>
    );
  }
}

export default PostCard;
