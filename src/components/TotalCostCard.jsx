import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const TotalCostCard = () => {
  const items = useSelector(state => state.items);
  const otherCosts = useSelector(state => state.otherCosts);

  const totalItemsCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalOtherCost = otherCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const total = totalItemsCost + totalOtherCost;

  return (
    <Box bg={useColorModeValue('white', 'gray.600')} p={4} rounded="md" mt={4}>
      <Text fontWeight="bold">Total Item Cost: ₹{totalItemsCost}</Text>
      <Text fontWeight="bold">Total Other Cost: ₹{totalOtherCost}</Text>
      <Text fontSize="xl" color="teal.500" fontWeight="bold">Grand Total: ₹{total}</Text>
    </Box>
  );
};

export default TotalCostCard;
