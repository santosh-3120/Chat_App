import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat.tsx';
import { useChatState } from '../../context/ChatProvider';
import './chat.css';

const ChatBox: React.FC<{ fetchAgain: boolean; setFetchAgain: (val: boolean) => void }> = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatState();

  return (
    <Box className={`chatbox-container ${selectedChat ? 'active' : ''}`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;