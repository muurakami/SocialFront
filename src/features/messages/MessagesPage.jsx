import React from "react";
import ConversationList from "./components/ConversationList";
import ConversationView from "./components/ConversationView";
import MessageService from "../../services/MessageService";
import styles from "./MessagesPage.module.css";

class MessagesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      selectedConversation: null,
      messages: [],
      isLoadingConversations: true,
      isLoadingMessages: false,
    };
  }

  async componentDidMount() {
    await this.loadConversations();
  }

  loadConversations = async () => {
    try {
      const conversations = await MessageService.getConversations();
      this.setState({ 
        conversations, 
        isLoadingConversations: false 
      });
    } catch (error) {
      console.error("Failed to load conversations:", error);
      this.setState({ isLoadingConversations: false });
    }
  };

  loadMessages = async (conversationId) => {
    this.setState({ isLoadingMessages: true });
    try {
      const messages = await MessageService.getMessages(conversationId);
      this.setState({ 
        messages, 
        isLoadingMessages: false 
      });
    } catch (error) {
      console.error("Failed to load messages:", error);
      this.setState({ isLoadingMessages: false });
    }
  };

  handleSelectConversation = async (conversation) => {
    this.setState({ selectedConversation: conversation });
    await this.loadMessages(conversation.id);
  };

  handleSendMessage = async (content) => {
    const { selectedConversation, messages } = this.state;
    const { user } = this.props;

    if (!selectedConversation || !content.trim()) return;

    const newMessage = {
      id: Date.now(),
      content,
      senderId: user.id,
      sender: user,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.setState({ 
      messages: [...messages, newMessage] 
    });

    try {
      await MessageService.sendMessage(selectedConversation.id, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  render() {
    const { user } = this.props;
    const {
      conversations,
      selectedConversation,
      messages,
      isLoadingConversations,
      isLoadingMessages,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.title}>Messages</h2>
          </div>
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={this.handleSelectConversation}
            isLoading={isLoadingConversations}
          />
        </div>

        <div className={styles.main}>
          {selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              messages={messages}
              currentUser={user}
              onSendMessage={this.handleSendMessage}
              isLoading={isLoadingMessages}
            />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💬</div>
              <h3 className={styles.emptyTitle}>Your Messages</h3>
              <p className={styles.emptyText}>
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MessagesPage;
