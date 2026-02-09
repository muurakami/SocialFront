import React from "react";
import PostCard from "../../../components/post/PostCard";
import Skeleton from "../../../components/ui/Skeleton";
import styles from "./PostGrid.module.css";

class PostGrid extends React.Component {
  handleLike = (postId) => {
    const { onLike } = this.props;
    if (onLike) {
      onLike(postId);
    }
  };

  handleRepost = (postId) => {
    const { onRepost } = this.props;
    if (onRepost) {
      onRepost(postId);
    }
  };

  handleEdit = (postId, newContent) => {
    const { onEdit } = this.props;
    if (onEdit) {
      onEdit(postId, newContent);
    }
  };

  handleDelete = (postId) => {
    const { onDelete } = this.props;
    if (onDelete) {
      onDelete(postId);
    }
  };

  handleAddComment = (postId, content) => {
    const { onAddComment } = this.props;
    if (onAddComment) {
      onAddComment(postId, content);
    }
  };

  handleEditComment = (postId, commentId, newContent) => {
    const { onEditComment } = this.props;
    if (onEditComment) {
      onEditComment(postId, commentId, newContent);
    }
  };

  handleDeleteComment = (postId, commentId) => {
    const { onDeleteComment } = this.props;
    if (onDeleteComment) {
      onDeleteComment(postId, commentId);
    }
  };

  renderSkeletons() {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.skeletonCard}>
        <div className={styles.skeletonHeader}>
          <Skeleton variant="avatar" />
          <div style={{ flex: 1 }}>
            <Skeleton variant="title" width="40%" />
            <Skeleton variant="text" width="20%" />
          </div>
        </div>
        <Skeleton variant="text" count={3} />
      </div>
    ));
  }

  render() {
    const { posts, isLoading, currentUser } = this.props;

    if (isLoading) {
      return <div className={styles.feed}>{this.renderSkeletons()}</div>;
    }

    if (!posts || posts.length === 0) {
      return (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>NO_POSTS_YET</p>
          <p className={styles.emptySubtext}>Share your first thought with the network</p>
        </div>
      );
    }

    return (
      <div className={styles.feed}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={this.handleLike}
            onRepost={this.handleRepost}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
            onAddComment={this.handleAddComment}
            onEditComment={this.handleEditComment}
            onDeleteComment={this.handleDeleteComment}
          />
        ))}
      </div>
    );
  }
}

export default PostGrid;
