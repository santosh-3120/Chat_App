import {
  BellIcon,
  ChevronDownIcon
} from '@chakra-ui/icons';
import {
  Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,
  Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast, Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../miscellaneous/ProfileModal';
import UserListItem from '../userAvatar/UserListItem';
import { useChatState } from '../../context/ChatProvider';
import { getSender } from '../../config/ChatLogics';
import './chat.css';
import { io, Socket } from 'socket.io-client';

const SideDrawer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user, selectedChat, setSelectedChat, notification, setNotification, chats, setChats } = useChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Socket.IO client
    const socketInstance = io('https://chat-app-ejxv.onrender.com', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    setSocket(socketInstance);

    // Emit setup event with user data
    if (user) {
      socketInstance.emit('setup', user);
    }

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('presence update', (users: any[]) => {
        setSearchResult((prev) =>
          prev.map((u) => {
            const updatedUser = users.find((updated) => updated._id === u._id);
            return updatedUser ? { ...u, isOnline: updatedUser.isOnline, lastSeen: updatedUser.lastSeen } : u;
          })
        );
      });
    }
  }, [socket]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something to search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      const usersWithStatus = await Promise.all(
        data.map(async (u: any) => ({
          ...u,
          isOnline: false, // Will be updated by presence
          lastSeen: u.lastSeen || null,
        }))
      );
      setSearchResult(usersWithStatus);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: 'Error occurred!',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error fetching chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box className="sidedrawer-header">
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Real-Time Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!Array.isArray(notification) || notification.length === 0
                ? 'No New Messages'
                : notification.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(notification.filter((n) => n !== notif));
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(user, notif.chat.users)} `}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user?.name} src={user?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="sidedrawer-search-header">Search Users</DrawerHeader>
          <DrawerBody>
            <Box className="sidedrawer-search-box">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <Spinner size="xl" />
            ) : (
              Array.isArray(searchResult) && searchResult.length > 0 ? (
                searchResult.map((u) => (
                  <UserListItem key={u._id} user={u} handleFunction={() => accessChat(u._id)} />
                ))
              ) : (
                <Text mt={4} color="gray.500">No users found</Text>
              )
            )}

            {loadingChat && <Spinner mt={4} size="lg" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;