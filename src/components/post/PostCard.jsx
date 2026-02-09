import React from "react";
import Avatar from "../ui/Avatar";
import CommentSection from "./CommentSection";
import styles from "./PostCard.module.css";

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: props.post.isLiked || false,
      likeCount: props.post.likeCount || 0,
      isReposted: props.post.isReposted || false,
      repostCount: props.post.repostCount || 0,
      showComments: false,
      showShareMenu: false,
      copySuccess: false,
    };
  }

  handleLike = async () => {
    const { post, onLike } = this.props;
    const { isLiked } = this.state;

    this.setState((prev) => ({
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      if (onLike) {
        await onLike(post.id);
      }
    } catch (error) {
      this.setState({
        isLiked: isLiked,
        likeCount: this.props.post.likeCount,
      });
    }
  };

  handleRepost = () => {
    const { post, onRepost } = this.props;
    
    this.setState((prev) => ({
      isReposted: !prev.isReposted,
      repostCount: prev.isReposted ? prev.repostCount - 1 : prev.repostCount + 1,
    }));

    if (onRepost) {
      onRepost(post.id);
    }
  };

  handleShare = () => {
    const { post } = this.props;
    const postUrl = `${window.location.origin}/post/${post.id}`;
    
    navigator.clipboard.writeText(postUrl).then(() => {
      this.setState({ copySuccess: true });
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  toggleComments = () => {
    this.setState((prev) => ({ showComments: !prev.showComments }));
  };

  toggleMenu = () => {
    this.setState((prev) => ({ showMenu: !prev.showMenu }));
  };

  handleEdit = () => {
    this.setState({
      isEditing: true,
      showMenu: false,
      editContent: this.props.post.content,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isEditing: false,
      editContent: this.props.post.content,
    });
  };

  handleSaveEdit = () => {
    const { post, onEdit } = this.props;
    const { editContent } = this.state;

    if (!editContent.trim()) return;

    if (onEdit) {
      onEdit(post.id, editContent);
    }

    this.setState({ isEditing: false });
  };

  handleEditContentChange = (e) => {
    this.setState({ editContent: e.target.value });
  };

  handleDelete = () => {
    const { post, onDelete } = this.props;
    
    if (confirm("Are you sure you want to delete this post?")) {
      if (onDelete) {
        onDelete(post.id);
      }
    }
    
    this.setState({ showMenu: false });
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
    const { post, currentUser } = this.props;
    const { isLiked, likeCount, isReposted, repostCount, showComments, copySuccess, showMenu, isEditing, editContent } = this.state;

    const isOwnPost = currentUser && post.author.id === currentUser.id;

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
            <div className={styles.timeWrapper}>
              <time className={styles.timestamp} dateTime={post.createdAt}>
                {this.formatDate(post.createdAt)}
              </time>
              {post.editedAt && (
                <span className={styles.edited} title={`Edited ${new Date(post.editedAt).toLocaleString()}`}>
                  · Edited
                </span>
              )}
            </div>
          </div>

          {isOwnPost && (
            <div className={styles.menuContainer} ref={this.menuRef}>
              <button
                className={styles.menuButton}
                onClick={this.toggleMenu}
                aria-label="Post options"
                aria-expanded={showMenu}
              >
                ⋯
              </button>

              {showMenu && (
                <div className={styles.menu}>
                  <button
                    className={styles.menuItem}
                    onClick={this.handleEdit}
                  >
                    <span className={styles.menuIcon}>✎</span>
                    Edit
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                    onClick={this.handleDelete}
                  >
                    <span className={styles.menuIcon}>🗑</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.content}>
          {isEditing ? (
            <div className={styles.editForm}>
              <textarea
                className={styles.editTextarea}
                value={editContent}
                onChange={this.handleEditContentChange}
                rows={4}
                maxLength={5000}
              />
              <div className={styles.editActions}>
                <button
                  className={styles.editCancel}
                  onClick={this.handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className={styles.editSave}
                  onClick={this.handleSaveEdit}
                  disabled={!editContent.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p>{post.content}</p>
          )}
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
            title={isLiked ? "Unlike" : "Like"}
          >
            <span className={styles.icon}>{isLiked ? "♥" : "♡"}</span>
            <span className={styles.count}>{likeCount}</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={this.toggleComments}
            aria-label="Comment"
            aria-expanded={showComments}
            title="Comment"
          >
            <span className={styles.icon}>💬</span>
            <span className={styles.count}>{post.commentCount || 0}</span>
          </button>

          <button
            className={`${styles.actionBtn} ${isReposted ? styles.reposted : ""}`}
            onClick={this.handleRepost}
            aria-label={isReposted ? "Unrepost" : "Repost"}
            aria-pressed={isReposted}
            title={isReposted ? "Unrepost" : "Repost"}
          >
            <span className={styles.icon}>⟳</span>
            <span className={styles.count}>{repostCount}</span>
          </button>

          <button
            className={`${styles.actionBtn} ${copySuccess ? styles.copied : ""}`}
            onClick={this.handleShare}
            aria-label="Share"
            title={copySuccess ? "Link copied!" : "Copy link"}
          >
            <span className={styles.icon}>{copySuccess ? "✓" : "↗"}</span>
            {copySuccess && <span className={styles.copyText}>Copied!</span>}
          </button>
        </div>

        {showComments && (
          <CommentSection
            comments={post.comments || []}
            currentUser={currentUser}
            onAddComment={(content) => {
              const { onAddComment } = this.props;
              if (onAddComment) {
                onAddComment(post.id, content);
              }
            }}
            onEditComment={(commentId, newContent) => {
              const { onEditComment } = this.props;
              if (onEditComment) {
                onEditComment(post.id, commentId, newContent);
              }
            }}
            onDeleteComment={(commentId) => {
              const { onDeleteComment } = this.props;
              if (onDeleteComment) {
                onDeleteComment(post.id, commentId);
              }
            }}
          />
        )}
      </article>
    );
  }
}

export default PostCard;
