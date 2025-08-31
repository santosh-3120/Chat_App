import { Avatar, Box, Text } from '@chakra-ui/react';
import './userListItem.css';

interface UserListItemProps {
  user: any;
  handleFunction: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, handleFunction }) => {
  return (
    <Box className="user-list-item" onClick={handleFunction}>
      <Avatar
        className="user-list-avatar"
        size="sm"
        name={user.name}
        src={user.pic}
        border={user.isOnline ? '2px solid green' : '2px solid gray'}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text className="user-list-email">
          <b>Email: </b>
          {user.email}
        </Text>
        <Text className="user-list-email">
          <b>Status: </b>
          {user.isOnline ? 'Online' : user.lastSeen ? `Last seen: ${new Date(user.lastSeen).toLocaleString()}` : 'Offline'}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;