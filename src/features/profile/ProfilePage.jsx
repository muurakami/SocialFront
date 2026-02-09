import React from "react";
import PostGrid from "./components/PostGrid";
import EditProfileModal from "./components/EditProfileModal";
import styles from "./ProfilePage.module.css";
import UserService from "../../services/UserService";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user || null,
      posts: [],
      isLoadingPosts: true,
      isEditModalOpen: false,
    };
  }

  async componentDidMount() {
    await this.fetchFullUserProfile();
    await this.loadUserPosts();

    const { onEditProfileMount } = this.props;
    if (onEditProfileMount) {
      onEditProfileMount(this.handleEditClick);
    }
  }

  componentWillUnmount() {
    const { onEditProfileMount } = this.props;
    if (onEditProfileMount) {
      onEditProfileMount(null);
    }
  }

  fetchFullUserProfile = async () => {
    try {
      const { user } = this.state;
      if (!user) return;

      let fullProfileData = null;

      if (user.id) {
        fullProfileData = await UserService.getMyProfile(user.id);
      } else if (user.email) {
        fullProfileData = await UserService.getPublicProfileByEmail(user.email);
      }

      if (fullProfileData) {
        this.setState((prevState) => ({
          user: { ...prevState.user, ...fullProfileData },
        }));
      }
    } catch (error) {
      console.error("Не удалось загрузить полные данные профиля:", error);
    }
  };

  loadUserPosts = async () => {
    try {
      const { user } = this.state;
      if (!user || !user.id) {
        this.setState({ posts: [], isLoadingPosts: false });
        return;
      }

      const posts = await UserService.getUserPosts(user.id);
      this.setState({ posts, isLoadingPosts: false });
    } catch (error) {
      console.error("Failed to load posts:", error);
      this.setState({ posts: [], isLoadingPosts: false });
    }
  };

  handleEditClick = () => {
    this.setState({ isEditModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isEditModalOpen: false });
  };

  handleSaveProfile = (updatedUser) => {
    this.setState({ user: updatedUser });
  };

  handleLike = (postId) => {
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      }),
    }));
  };

  handleRepost = (postId) => {
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isReposted: !post.isReposted,
            repostCount: post.isReposted ? post.repostCount - 1 : post.repostCount + 1,
          };
        }
        return post;
      }),
    }));
  };

  handleEditPost = (postId, newContent) => {
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            content: newContent,
            editedAt: new Date().toISOString(),
            editHistory: [
              ...(post.editHistory || []),
              {
                content: post.content,
                editedAt: new Date().toISOString(),
              }
            ],
          };
        }
        return post;
      }),
    }));
  };

  handleDeletePost = (postId) => {
    this.setState((prev) => ({
      posts: prev.posts.filter((post) => post.id !== postId),
    }));
  };

  handleAddComment = (postId, content) => {
    const { user } = this.state;
    
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now(),
            content,
            author: user,
            createdAt: new Date().toISOString(),
          };
          
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
            commentCount: (post.commentCount || 0) + 1,
          };
        }
        return post;
      }),
    }));
  };

  handleEditComment = (postId, commentId, newContent) => {
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  content: newContent,
                  editedAt: new Date().toISOString(),
                };
              }
              return comment;
            }),
          };
        }
        return post;
      }),
    }));
  };

  handleDeleteComment = (postId, commentId) => {
    this.setState((prev) => ({
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter((comment) => comment.id !== commentId),
            commentCount: Math.max(0, (post.commentCount || 0) - 1),
          };
        }
        return post;
      }),
    }));
  };

  getDisplayName = (user) => {
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email || "User";
  };

  getInitials = (user) => {
    const source = user.firstName || user.email || "U";
    return source.charAt(0).toUpperCase();
  };

  render() {
    const { user, posts, isLoadingPosts, isEditModalOpen } = this.state;

    if (!user) {
      return <div className={styles.loading}>LOADING...</div>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={this.getDisplayName(user)}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {this.getInitials(user)}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.username}>{this.getDisplayName(user)}</h1>
            {user.bio && <p className={styles.bio}>{user.bio}</p>}
          </div>
        </div>

        <PostGrid 
          posts={posts} 
          isLoading={isLoadingPosts} 
          onLike={this.handleLike} 
          onRepost={this.handleRepost}
          onEdit={this.handleEditPost}
          onDelete={this.handleDeletePost}
          onAddComment={this.handleAddComment}
          onEditComment={this.handleEditComment}
          onDeleteComment={this.handleDeleteComment}
          currentUser={user}
        />

        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onClose={this.handleCloseModal}
            onSave={this.handleSaveProfile}
          />
        )}
      </div>
    );
  }
}

export default ProfilePage;
