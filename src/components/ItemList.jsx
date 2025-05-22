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
import { setItems } from '../features/items/itemsSlice';

const ItemList = ({ onDataChange }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);
  console.log(items[0]);
  const uid = useSelector((state) => state.auth.user?.uid);

  const toast = useToast();
  const cancelRef = useRef();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', cost: '' });
  const [deleteInfo, setDeleteInfo] = useState({ isOpen: false, itemId: null });
  const bg= useColorModeValue('white', 'gray.600')

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, `users/${uid}/items`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      dispatch(setItems(data));
    });
    return () => unsubscribe();
  }, [dispatch, uid]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, `users/${uid}/items`, deleteInfo.itemId));
      toast({ title: "Item deleted.", status: "success", duration: 2000, isClosable: true });
      onDataChange?.();
    } catch (err) {
      toast({ title: "Failed to delete item.", description: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setDeleteInfo({ isOpen: false, itemId: null });
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditData({ name: item.name, cost: item.cost });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', cost: '' });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const itemRef = doc(db, `users/${uid}/items`, itemId);
      await updateDoc(itemRef, { name: editData.name, cost: parseFloat(editData.cost) });
      toast({ title: "Item updated.", status: "success", duration: 2000, isClosable: true });
      onDataChange?.();
      handleCancelEdit();
    } catch (err) {
      toast({ title: "Update failed.", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {items.map(item => (
          <Box key={item.id} p={4} rounded="xl" shadow="md" bg={bg} borderWidth="1px">
            {editingId === item.id ? (
              <Flex direction={{ base: "column", md: "row" }} gap={2}>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Name"
                />
                <Input
                  type="number"
                  value={editData.cost}
                  onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
                  placeholder="Cost"
                />
                <IconButton icon={<CheckIcon />} colorScheme="green" onClick={() => handleSaveEdit(item.id)} aria-label="Save" />
                <IconButton icon={<CloseIcon />} onClick={handleCancelEdit} aria-label="Cancel" />
              </Flex>
            ) : (
              <Flex justify="space-between" align="center" bg={bg}>
                <Text fontSize="md">{item.name} - ₹{item.cost}</Text>
                <HStack>
                  <IconButton icon={<EditIcon />} size="sm" onClick={() => handleEditClick(item)} aria-label="Edit" />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => setDeleteInfo({ isOpen: true, itemId: item.id })} aria-label="Delete" />
                </HStack>
              </Flex>
            )}
          </Box>
        ))}
      </VStack>

      <AlertDialog isOpen={deleteInfo.isOpen} leastDestructiveRef={cancelRef} onClose={() => setDeleteInfo({ isOpen: false, itemId: null })}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Item</AlertDialogHeader>
            <AlertDialogBody>Are you sure? This action cannot be undone.</AlertDialogBody>
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

export default ItemList;
