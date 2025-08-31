import { Avatar, Tooltip, Box, Text } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { useChatState } from '../../context/ChatProvider';
import './chat.css';
import * as React from 'react';

const ScrollableChat: React.FC<{ messages: any[] }> = ({ messages }) => {
  const { user } = useChatState();
  if (!user) return null;

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom on messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map((m, i) => (
        <Box
          key={m._id}
          display="flex"
          alignItems="flex-end"
          justifyContent={m.sender._id === user._id ? 'flex-end' : 'flex-start'}
          mb={isSameUser(messages, m, i) ? '3px' : '10px'}
        >
          {/* Avatar for others */}
          {m.sender._id !== user._id &&
            (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

          {/* Message bubble */}
          <Box
            bg={m.sender._id === user._id ? 'blue.500' : 'gray.300'}
            color={m.sender._id === user._id ? 'white' : 'black'}
            px={3}
            py={2}
            borderRadius="lg"
            maxWidth="70%"
            ml={
              m.sender._id !== user._id && isSameSenderMargin(messages, m, i, user._id) === 33
                ? '33px'
                : '0'
            }
            mr={m.sender._id === user._id ? '0' : 'auto'}
          >
            <Text>{m.content}</Text>
          </Box>
        </Box>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ScrollableChat;
