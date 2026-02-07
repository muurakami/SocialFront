import api from "../api/apiClient";

class PostService {
  static async getFeed(page = 0, size = 10) {
    const response = await api.get("/posts/feed", {
      params: { page, size },
    });

    return {
      posts: response.data.content,
      hasMore: !response.data.last,
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
    };
  }

  static async createPost(content, images = []) {
    const formData = new FormData();
    formData.append("content", content);
    images.forEach((image) => {
      formData.append("images", image);
    });

    return api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static async toggleLike(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  }

  static async addComment(postId, content) {
    return api.post(`/posts/${postId}/comments`, { content });
  }

  static async getComments(postId, page = 0) {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: { page, size: 20 },
    });
    return {
      comments: response.data.content,
      hasMore: !response.data.last,
    };
  }
}

export default PostService;
