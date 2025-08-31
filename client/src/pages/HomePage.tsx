import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Authentication/Login.tsx';
import Signup from '../components/Authentication/Signup.tsx';
import './pages.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string);
    if (userInfo) navigate('/chats');
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box className="home-header">
        <Text fontSize="4xl" fontFamily="Work sans">Real-Time Chat App</Text>
      </Box>
      <Box className="home-tabs">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;