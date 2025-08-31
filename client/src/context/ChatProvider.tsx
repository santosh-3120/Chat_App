import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  token: string;
}

interface ChatContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
  chats: any[];
  setChats: (chats: any[]) => void;
  notification: any[];
  setNotification: (notif: any[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [notification, setNotification] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    setUser(userInfo);

    if (!userInfo) navigate('/');
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatState must be used within ChatProvider');
  return context;
};