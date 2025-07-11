import { useState, useEffect } from "react";
import { ChatService } from "../services/ChatService";

export function useChat(userId: string) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState([]);

  const loadChats = async () => {
    try {
      setLoading(true);
      console.log("userId", userId);
      setChats(await ChatService.getChats(userId));
      setLoading(false);
      return chats;
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  useEffect(() => {
    if (!userId) return;
    loadChats();
  }, [userId]);

  return { chats, loading, error, messages, loadChats };
}