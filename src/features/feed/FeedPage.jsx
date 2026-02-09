import React from "react";
import PostCard from "../../components/post/PostCard";
import PostComposer from "../../components/post/PostComposer";
import Skeleton from "../../components/ui/Skeleton";
import LiquidButton from "../../components/ui/LiquidButton";
import styles from "./FeedPage.module.css";

const MOCK_POSTS = [
  {
    id: 1,
    content:
      "Just deployed my first React app! 🚀 The journey from idea to production was incredible.",
    images: ["https://picsum.photos/600/400?random=1"],
    author: {
      id: 1,
      firstName: "Alex",
      lastName: "Smith",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likeCount: 12,
    commentCount: 3,
    isLiked: false,
  },
  {
    id: 2,
    content: "Beautiful sunset today 🌅 Nature never disappoints.",
    images: [],
    author: {
      id: 2,
      firstName: "Maria",
      lastName: "Garcia",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likeCount: 25,
    commentCount: 7,
    isLiked: true,
  },
  {
    id: 3,
    content: "Learning Java Spring Boot. Any tips from experienced developers?",
    images: [],
    author: {
      id: 3,
      firstName: "John",
      lastName: "Doe",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likeCount: 8,
    commentCount: 12,
    isLiked: false,
  },
];

class FeedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        posts: MOCK_POSTS,
        isLoading: false,
      });
    }, 1000);
  }

  handleCreatePost = async (content, images = []) => {
    const { user } = this.props;

    if (!user) {
      alert("Please login to create posts");
      return;
    }

    const imageUrls = images.map((_, index) => 
      `https://picsum.photos/600/400?random=${Date.now() + index}`
    );

    const newPost = {
      id: Date.now(),
      content,
      images: imageUrls,
      author: user,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      repostCount: 0,
      isLiked: false,
      isReposted: false,
    };

    this.setState((prev) => ({
      posts: [newPost, ...prev.posts],
    }));
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
    const { user } = this.props;
    
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
    const { user } = this.props;
    const { posts, isLoading } = this.state;

    return (
      <div className={styles.page}>
        <main className={styles.container}>
          <div className={styles.feed}>
            <PostComposer user={user} onSubmit={this.handleCreatePost} />

            {isLoading ? (
              this.renderSkeletons()
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onLike={this.handleLike}
                    onRepost={this.handleRepost}
                    onEdit={this.handleEditPost}
                    onDelete={this.handleDeletePost}
                    onAddComment={this.handleAddComment}
                    onEditComment={this.handleEditComment}
                    onDeleteComment={this.handleDeleteComment}
                  />
                ))}

                <div className={styles.endMessage}>
                  <p>You've reached the end</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default FeedPage;
