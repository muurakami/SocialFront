import React from "react";
import PostGrid from "./components/PostGrid";
import EditProfileModal from "./components/EditProfileModal";
import EncryptButton from "../../components/ui/EncryptButton";
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
      const posts = [];
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
            <div className={styles.topRow}>
              <h1 className={styles.username}>{this.getDisplayName(user)}</h1>
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
