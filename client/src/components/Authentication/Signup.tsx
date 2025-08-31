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
import './auth.css';

const Signup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
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
      const { data } = await axios.post(`/api/user/signup`, { name, email, password, pic }, config);
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
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
    <VStack spacing="5px">
      <FormControl id="signup-name" isRequired>
  <FormLabel>Name</FormLabel>
  <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
</FormControl>
<FormControl id="signup-email" isRequired>
  <FormLabel>Email</FormLabel>
  <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
</FormControl>
<FormControl id="signup-password" isRequired>
  <FormLabel>Password</FormLabel>
  <InputGroup>
    <Input type={show ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <InputRightElement width="4.5rem">
      <Button className="show-password-btn" h="1.75rem" size="sm" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </Button>
    </InputRightElement>
  </InputGroup>
</FormControl>
<FormControl id="signup-confirm-password" isRequired>
  <FormLabel>Confirm Password</FormLabel>
  <InputGroup>
    <Input type={show ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
    <InputRightElement width="4.5rem">
      <Button className="show-password-btn" h="1.75rem" size="sm" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </Button>
    </InputRightElement>
  </InputGroup>
</FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Picture</FormLabel>
        <Input type="text" placeholder="Enter image URL (optional)" value={pic} onChange={(e) => setPic(e.target.value)} />
      </FormControl>
      <Button className="auth-btn" colorScheme="blue" isLoading={loading} onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;