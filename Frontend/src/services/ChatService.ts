export const ChatService = {
  getChats: async (userId: string) => {
    const response = await fetch(`http://localhost:3000/chat/${userId}/chats`);
    return await response.json();
  },
}