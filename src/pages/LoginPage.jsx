// src/components/LoginPage.jsx (or wherever your LoginPage is)
import React, { useState } from 'react';
import {
  Box, Input, Button, Heading, VStack, useToast,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if needed
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();


  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email }));
      toast({ title: 'Logged in', status: 'success' });
    } catch (err) {
      toast({ title: 'Login failed', description: err.message, status: 'error' });
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Signed up successfully', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({
        title: 'Signup failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxW="md" mx="auto" boxShadow="md" borderRadius="md">
      <Heading mb={6} textAlign="center">Project Cost Tracker</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button colorScheme="teal" width="100%" onClick={handleLogin}>Login</Button>
        <Button variant="outline" width="100%" onClick={handleSignup}>Sign Up</Button>
      </VStack>
    </Box>
  );
};

export default LoginPage;
