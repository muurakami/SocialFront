import api from "../api/apiClient";

class MessageService {
  static async getConversations() {
    const response = await api.get("/messages/conversations");
    return response.data;
  }

  static async getMessages(conversationId, page = 0) {
    const response = await api.get(`/messages/${conversationId}`, {
      params: { page, limit: 50 },
    });
    return response.data;
  }

  static async sendMessage(conversationId, content) {
    return api.post(`/messages/${conversationId}`, { content });
  }

  static async createConversation(userId) {
    return api.post("/messages/conversations", { userId });
  }
}

export default MessageService;
