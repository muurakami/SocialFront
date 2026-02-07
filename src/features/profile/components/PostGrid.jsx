import React from "react";
import styles from "./PostGrid.module.css";

class PostGrid extends React.Component {
  handlePostClick = (post) => {
    if (this.props.onPostClick) {
      this.props.onPostClick(post);
    }
  };

  render() {
    const { posts, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}>LOADING_POSTS...</div>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>NO_POSTS_YET</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {posts.map((post) => (
          <div
            key={post.id}
            className={styles.gridItem}
            onClick={() => this.handlePostClick(post)}
          >
            {post.images && post.images.length > 0 ? (
              <>
                <img
                  src={post.images[0]}
                  alt={post.content || "Post"}
                  className={styles.postImage}
                />
                <div className={styles.overlay}>
                  <div className={styles.stats}>
                    <span className={styles.stat}>
                      <span className={styles.icon}>♥</span>
                      {post.likeCount || 0}
                    </span>
                    <span className={styles.stat}>
                      <span className={styles.icon}>💬</span>
                      {post.commentCount || 0}
                    </span>
                  </div>
                </div>
                {post.images.length > 1 && (
                  <div className={styles.multipleIcon}>⊞</div>
                )}
              </>
            ) : (
              <div className={styles.textPost}>
                <p className={styles.textContent}>{post.content}</p>
                <div className={styles.textOverlay}>
                  <div className={styles.stats}>
                    <span className={styles.stat}>
                      <span className={styles.icon}>♥</span>
                      {post.likeCount || 0}
                    </span>
                    <span className={styles.stat}>
                      <span className={styles.icon}>💬</span>
                      {post.commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default PostGrid;
