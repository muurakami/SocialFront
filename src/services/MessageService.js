import api from "../api/apiClient";

class MessageService {
  static async getConversations() {
    const response = await api.get("/api/messages/conversations");
    return response.data;
  }

  static async getMessages(conversationId, page = 0) {
    const response = await api.get(`/api/messages/${conversationId}`, {
      params: { page, limit: 50 },
    });
    return response.data;
  }

  static async sendMessage(conversationId, content) {
    return api.post(`/api/messages/${conversationId}`, { content });
  }

  static async createConversation(userId) {
    return api.post("/api/messages/conversations", { userId });
  }

  static async markAsRead(conversationId) {
    return api.put(`/api/messages/${conversationId}/read`);
  }
}

export default MessageService;
