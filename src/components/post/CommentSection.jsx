import React from "react";
import Avatar from "../ui/Avatar";
import styles from "./CommentSection.module.css";

class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      editingCommentId: null,
      editContent: "",
    };
  }

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

  handleNewCommentChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  handleSubmitComment = (e) => {
    e.preventDefault();
    const { newComment } = this.state;
    const { onAddComment } = this.props;

    if (!newComment.trim()) return;

    if (onAddComment) {
      onAddComment(newComment);
    }

    this.setState({ newComment: "" });
  };

  handleEditComment = (comment) => {
    this.setState({
      editingCommentId: comment.id,
      editContent: comment.content,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      editingCommentId: null,
      editContent: "",
    });
  };

  handleSaveEdit = (commentId) => {
    const { editContent } = this.state;
    const { onEditComment } = this.props;

    if (!editContent.trim()) return;

    if (onEditComment) {
      onEditComment(commentId, editContent);
    }

    this.setState({
      editingCommentId: null,
      editContent: "",
    });
  };

  handleEditContentChange = (e) => {
    this.setState({ editContent: e.target.value });
  };

  handleDeleteComment = (commentId) => {
    const { onDeleteComment } = this.props;

    if (confirm("Are you sure you want to delete this comment?")) {
      if (onDeleteComment) {
        onDeleteComment(commentId);
      }
    }
  };

  render() {
    const { comments, currentUser } = this.props;
    const { newComment, editingCommentId, editContent } = this.state;

    return (
      <div className={styles.container}>
        <form onSubmit={this.handleSubmitComment} className={styles.commentForm}>
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.firstName || "User"}
            size={32}
          />
          <input
            type="text"
            className={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChange={this.handleNewCommentChange}
            maxLength={500}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </form>

        <div className={styles.commentsList}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              const isOwnComment = currentUser && comment.author.id === currentUser.id;
              const isEditing = editingCommentId === comment.id;

              return (
                <div key={comment.id} className={styles.comment}>
                  <Avatar
                    src={comment.author.avatar}
                    alt={comment.author.firstName}
                    size={32}
                  />

                  <div className={styles.commentBody}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>
                        {comment.author.firstName} {comment.author.lastName}
                      </span>
                      <span className={styles.commentTime}>
                        {this.formatDate(comment.createdAt)}
                      </span>
                      {comment.editedAt && (
                        <span className={styles.edited} title={`Edited ${new Date(comment.editedAt).toLocaleString()}`}>
                          · Edited
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className={styles.editForm}>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={editContent}
                          onChange={this.handleEditContentChange}
                          maxLength={500}
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
                            onClick={() => this.handleSaveEdit(comment.id)}
                            disabled={!editContent.trim()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={styles.commentContent}>{comment.content}</p>

                        {isOwnComment && (
                          <div className={styles.commentActions}>
                            <button
                              className={styles.commentAction}
                              onClick={() => this.handleEditComment(comment)}
                            >
                              Edit
                            </button>
                            <button
                              className={`${styles.commentAction} ${styles.commentActionDanger}`}
                              onClick={() => this.handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    );
  }
}

export default CommentSection;
