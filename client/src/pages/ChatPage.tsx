import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import SideDrawer from '../components/Chat/SideDrawer.tsx';
import MyChats from '../components/Chat/MyChats.tsx';
import ChatBox from '../components/Chat/ChatBox.tsx';
import './pages.css';

const ChatPage: React.FC = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="chat-page">
      <SideDrawer />
      <Box className="chat-container">
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
};

export default ChatPage;