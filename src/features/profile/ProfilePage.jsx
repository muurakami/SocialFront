import React from "react";
import PostGrid from "./components/PostGrid";
import EditProfileModal from "./components/EditProfileModal";
import EncryptButton from "../../components/ui/EncryptButton";
import styles from "./ProfilePage.module.css";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";

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
    await this.loadUserPosts();
  }

  loadUserPosts = async () => {
    try {
      const posts = []; // await PostService.getUserPosts(this.state.user.id);
      this.setState({ posts, isLoadingPosts: false });
    } catch (error) {
      console.error("Failed to load posts:", error);
      this.setState({ isLoadingPosts: false });
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

  render() {
    const { user, posts, isLoadingPosts, isEditModalOpen } = this.state;

    if (!user) {
      return <div>LOADING...</div>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.firstName}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.topRow}>
              <h1 className={styles.username}>
                {user.firstName}_{user.lastName}
              </h1>
              <EncryptButton onClick={this.handleEditClick}>
                EDIT_PROFILE
              </EncryptButton>
            </div>

            {user.bio && <p className={styles.bio}>{user.bio}</p>}
          </div>
        </div>

        <PostGrid posts={posts} isLoading={isLoadingPosts} />

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
