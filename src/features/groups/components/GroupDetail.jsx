import React from "react";
import Avatar from "../../../components/ui/Avatar";
import EncryptButton from "../../../components/ui/EncryptButton";
import PostCard from "../../../components/post/PostCard";
import RolesManager from "./RolesManager";
import styles from "./GroupDetail.module.css";

class GroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoadingPosts: true,
      showRoles: false,
      roles: props.group.roles || [],
    };
  }

  componentDidMount() {
    this.loadPosts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.group.id !== this.props.group.id) {
      this.loadPosts();
    }
  }

  loadPosts = () => {
    this.setState({ isLoadingPosts: true });

    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          content: `Welcome to ${this.props.group.name}! Let's build something amazing together 🚀`,
          images: [],
          author: {
            id: 10,
            firstName: "Admin",
            lastName: "User",
            avatar: this.props.group.avatar,
          },
          likeCount: 45,
          commentCount: 12,
          repostCount: 8,
          isLiked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          content: "Just shared my latest project! Check it out and let me know what you think.",
          images: ["https://picsum.photos/600/400?random=50"],
          author: {
            id: 11,
            firstName: "Alex",
            lastName: "Chen",
            avatar: "https://i.pravatar.cc/150?img=12",
          },
          likeCount: 89,
          commentCount: 23,
          repostCount: 15,
          isLiked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];

      this.setState({
        posts: mockPosts,
        isLoadingPosts: false,
      });
    }, 500);
  };

  handleJoinLeave = () => {
    const { group, onJoin, onLeave } = this.props;
    
    if (group.isJoined) {
      onLeave(group.id);
    } else {
      onJoin(group.id);
    }
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

  handleRolesUpdate = (updatedRoles) => {
    this.setState({ roles: updatedRoles });
  };

  isOwnerOrAdmin = () => {
    const { group, currentUser } = this.props;
    if (!currentUser || !group) return false;

    return (
      group.owner?.id === currentUser.id ||
      group.admins?.some(admin => admin.id === currentUser.id)
    );
  };

  render() {
    const { group } = this.props;
    const { posts, isLoadingPosts, showRoles, roles } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.coverImage}>
            <div className={styles.coverOverlay} />
          </div>

          <div className={styles.headerContent}>
            <Avatar
              src={group.avatar}
              alt={group.name}
              size={80}
            />

            <div className={styles.info}>
              <div className={styles.titleRow}>
                <h1 className={styles.name}>{group.name}</h1>
                {group.isPrivate && (
                  <span className={styles.privateBadge} title="Private group">
                    🔒 Private
                  </span>
                )}
              </div>
              <p className={styles.description}>{group.description}</p>
              
              {/* Owner & Admins */}
              {(group.owner || (group.admins && group.admins.length > 0)) && (
                <div className={styles.administrators}>
                  {group.owner && (
                    <div className={styles.adminItem}>
                      <span className={styles.adminLabel}>Owner:</span>
                      <span className={styles.adminName}>
                        {group.owner.firstName} {group.owner.lastName}
                        <span className={styles.ownerBadge}>👑</span>
                      </span>
                    </div>
                  )}
                  
                  {group.admins && group.admins.length > 0 && (
                    <div className={styles.adminItem}>
                      <span className={styles.adminLabel}>Admins:</span>
                      <div className={styles.adminsList}>
                        {group.admins.map((admin, index) => (
                          <span key={admin.id} className={styles.adminName}>
                            {admin.firstName} {admin.lastName}
                            <span className={styles.adminBadge}>⚡</span>
                            {index < group.admins.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.stats}>
                <span className={styles.stat}>
                  <span className={styles.statValue}>{group.memberCount.toLocaleString()}</span>
                  <span className={styles.statLabel}>members</span>
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              {this.isOwnerOrAdmin() && (
                <button
                  className={styles.rolesButton}
                  onClick={() => this.setState({ showRoles: !showRoles })}
                >
                  {showRoles ? "Hide Roles" : "Manage Roles"}
                </button>
              )}
              <EncryptButton onClick={this.handleJoinLeave}>
                {group.isJoined ? "LEAVE" : "JOIN"}
              </EncryptButton>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {showRoles && (
            <RolesManager
              roles={roles}
              isOwnerOrAdmin={this.isOwnerOrAdmin()}
              onRolesUpdate={this.handleRolesUpdate}
            />
          )}

          <div className={styles.feed}>
            <h2 className={styles.feedTitle}>Recent Posts</h2>
            {isLoadingPosts ? (
              <div className={styles.loading}>Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={this.handleLike}
                  onRepost={this.handleRepost}
                />
              ))
            ) : (
              <div className={styles.noPosts}>
                <p>No posts yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GroupDetail;
