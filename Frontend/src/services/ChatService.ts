export const ChatService = {
  getChats: async (userId: string) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/chats`);
    return await response.json();
  },

  generateDraft: async (userId: string, chatId: string) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/${chatId}/messages`);
    return await response.json();
  },
}