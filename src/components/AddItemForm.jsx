import React, { useState } from 'react';
import {
  Input,
  Button,
  useToast,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const AddItemForm = ({ onDataChange }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const toast = useToast();
  const uid = useSelector((state) => state.auth.user?.uid);

  const handleAdd = async () => {
    if (!name || !cost) return;
    try {
      await addDoc(collection(db, `users/${uid}/items`), {
        name,
        cost: parseFloat(cost),
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Item added', status: 'success' });
      setName('');
      setCost('');
      onDataChange?.(); 
    } catch (err) {
      toast({
        title: 'Error adding item',
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <HStack spacing={4}>
      <Input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        rounded="full"
        bg={useColorModeValue('white', 'gray.600')}
        shadow="sm"
      />
      <Input
        placeholder="Cost"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        rounded="full"
        bg={useColorModeValue('white', 'gray.600')}
        shadow="sm"
      />
      <Button onClick={handleAdd} colorScheme="blue" px={6} rounded="full">
        Add
      </Button>
    </HStack>
  );
};

export default AddItemForm;
