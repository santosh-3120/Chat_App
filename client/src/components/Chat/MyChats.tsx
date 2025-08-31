import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { getSender } from '../../config/ChatLogics';
import { useChatState } from '../../context/ChatProvider';
import './chat.css';

const MyChats: React.FC<{ fetchAgain: boolean }> = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState<any>(null);

  const { user, selectedChat, setSelectedChat, chats, setChats } = useChatState();
  const toast = useToast();

  const fetchChats = async () => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
    } catch (error: any) {
      toast({
        title: 'Error occurred!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    setLoggedUser(userInfo ? JSON.parse(userInfo) : null);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box className="mychats-container">
      <Box className="mychats-header">
        My Chats
        <Button className="group-chat-btn">
          New Group Chat
          <AddIcon ml={2} />
        </Button>
      </Box>
      <Box className="mychats-list">
        {chats && chats.length ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                className={`chat-item ${selectedChat?._id === chat._id ? 'selected-chat' : ''}`}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text className="chat-preview">
                    <b>{chat.latestMessage.sender?.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>Loading chats...</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
