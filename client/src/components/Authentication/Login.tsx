import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  InputGroup, 
  InputRightElement, 
  VStack, 
  useToast 
} from '@chakra-ui/react';

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatState } from '../../context/ChatProvider';
import './auth.css';

const Login: React.FC = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`/api/user/login`, { email, password }, config);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      navigate('/chats');
    } catch (error: any) {
      toast({
        title: 'Error occurred!',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="login-email" isRequired>
  <FormLabel>Email</FormLabel>
  <Input value={email} type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
</FormControl>
<FormControl id="login-password" isRequired>
  <FormLabel>Password</FormLabel>
  <InputGroup>
    <Input value={password} type={show ? 'text' : 'password'} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
    <InputRightElement width="4.5rem">
      <Button className="show-password-btn" h="1.75rem" size="sm" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </Button>
    </InputRightElement>
  </InputGroup>
</FormControl>

      <Button
  className="auth-btn"
  colorScheme="blue"
  isLoading={loading}
  onClick={submitHandler} // ← attach the click handler
>
  Login
</Button>

      <Button className="auth-btn" variant="solid" colorScheme="red" onClick={() => { setEmail('guest@example.com'); setPassword('123456'); }}>
        Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;