import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Text, HStack, Button, Input, VStack, useToast, Flex,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, IconButton,useColorModeValue
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase';
import {
  collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { setOtherCosts } from '../features/otherCosts/otherCostsSlice';

const OtherCostList = ({onDataChange}) => {
  const dispatch = useDispatch();
  const costs = useSelector((state) => state.otherCosts);
  const uid = useSelector((state) => state.auth.user?.uid);

  const toast = useToast();
  const cancelRef = useRef();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ description: '', amount: '' });
  const [deleteInfo, setDeleteInfo] = useState({ isOpen: false, itemId: null });
  const bg= useColorModeValue('white', 'gray.600')

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, `users/${uid}/otherCosts`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      dispatch(setOtherCosts(data));
    });
    return () => unsubscribe();
  }, [dispatch, uid]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, `users/${uid}/otherCosts`, deleteInfo.itemId));
      toast({ title: "Cost entry deleted.", status: "success", duration: 2000, isClosable: true });
      onDataChange?.();
    } catch (err) {
      toast({ title: "Failed to delete.", description: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setDeleteInfo({ isOpen: false, itemId: null });
    }
  };

  const handleEditClick = (cost) => {
    setEditingId(cost.id);
    setEditData({ description: cost.description, amount: cost.amount });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ description: '', amount: '' });
  };

  const handleSaveEdit = async (costId) => {
    try {
      const costRef = doc(db, `users/${uid}/otherCosts`, costId);
      await updateDoc(costRef, { description: editData.description, amount: parseFloat(editData.amount) });
      toast({ title: "Other cost updated.", status: "success", duration: 2000, isClosable: true });
      onDataChange?.();
      handleCancelEdit();
    } catch (err) {
      toast({ title: "Update failed.", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {costs.map(cost => (
          <Box key={cost.id} p={4} rounded="xl" shadow="md" borderWidth="1px" bg={bg}>
            {editingId === cost.id ? (
              <Flex direction={{ base: "column", md: "row" }} gap={2}>
                <Input
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Description"
                />
                <Input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  placeholder="Amount"
                />
                <IconButton icon={<CheckIcon />} colorScheme="green" onClick={() => handleSaveEdit(cost.id)} aria-label="Save" />
                <IconButton icon={<CloseIcon />} onClick={handleCancelEdit} aria-label="Cancel" />
              </Flex>
            ) : (
              <Flex justify="space-between" align="center">
                <Text fontSize="md">{cost.description} - ₹{cost.amount}</Text>
                <HStack>
                  <IconButton icon={<EditIcon />} size="sm" onClick={() => handleEditClick(cost)} aria-label="Edit" />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => setDeleteInfo({ isOpen: true, itemId: cost.id })} aria-label="Delete" />
                </HStack>
              </Flex>
            )}
          </Box>
        ))}
      </VStack>

      <AlertDialog isOpen={deleteInfo.isOpen} leastDestructiveRef={cancelRef} onClose={() => setDeleteInfo({ isOpen: false, itemId: null })}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Entry</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this cost entry?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteInfo({ isOpen: false, itemId: null })}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default OtherCostList;
