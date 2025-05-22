import React, { useState } from 'react';
import {
  Input,
  Button,
  HStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const AddOtherCostForm = ({onDataChange}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const uid = useSelector((state) => state.auth.user?.uid);

  const handleAdd = async () => {
    if (!description || !amount) return;
    try {
      await addDoc(collection(db, `users/${uid}/otherCosts`), {
        description,
        amount: parseFloat(amount),
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Other cost added', status: 'success' });
      onDataChange?.();
      setDescription('');
      setAmount('');
    } catch (err) {
      toast({
        title: 'Error adding cost',
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <HStack spacing={4}>
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rounded="full"
        bg={useColorModeValue('white', 'gray.600')}
        shadow="sm"
      />
      <Input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        rounded="full"
        bg={useColorModeValue('white', 'gray.600')}
        shadow="sm"
      />
      <Button onClick={handleAdd} colorScheme="green" px={6} rounded="full">
        Add
      </Button>
    </HStack>
  );
};

export default AddOtherCostForm;
