import React, { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  HStack,
  useColorModeValue,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { clearUser } from '../features/auth/authSlice';

import AddItemForm from '../components/AddItemForm';
import ItemList from '../components/ItemList';
import AddOtherCostForm from '../components/AddOtherCostForm';
import OtherCostList from '../components/OtherCostList';
import TotalCostCard from '../components/TotalCostCard';
import DashboardNavbar from '../components/DashboardNavbar';

import CostChart from '../components/CostChart';
import ItemCostDistributionChart from '../components/ItemCostDistributionChart';
import OtherCostDistributionChart from '../components/OtherCostDistributionChart';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [reloadCharts, setReloadCharts] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    dispatch(clearUser());
  };

  // Called on data changes from forms/lists
  const handleDataChange = () => {
    setReloadCharts(prev => !prev); // toggle reloadCharts to trigger charts refresh
  };

  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const summaryBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <>
      <DashboardNavbar />
      <Box p={6} maxW="8xl" mx="auto">
        {/* Header */}
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Dashboard</Heading>
          <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
        </HStack>

        {/* Top: Charts in a row */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={8}>
          <Box bg={summaryBg} p={4} rounded="xl" shadow="md" minH="250px">
            <Heading size="sm" mb={2} textAlign="center">Items Cost</Heading>
            <ItemCostDistributionChart reloadCharts={reloadCharts} />
          </Box>
          <Box bg={summaryBg} p={4} rounded="xl" shadow="md" minH="250px">
            <Heading size="sm" mb={2} textAlign="center">Other Costs</Heading>
            <OtherCostDistributionChart reloadCharts={reloadCharts} />
          </Box>
          <Box bg={summaryBg} p={4} rounded="xl" shadow="md" minH="250px">
            <Heading size="sm" mb={2} textAlign="center">Cost Share</Heading>
            <CostChart reloadCharts={reloadCharts} />
          </Box>
        </Grid>

        {/* Bottom: Items, OtherCosts, and TotalCard side-by-side */}
        <Grid templateColumns={{ base: '1fr', md: '2fr 2fr 1.5fr' }} gap={6} alignItems="start">
          {/* Column 1: Items */}
          <GridItem>
            <Box bg={cardBg} p={5} rounded="xl" shadow="md" mb={4}>
              <Heading size="md" mb={4}>Add Item</Heading>
              <AddItemForm onDataChange={handleDataChange} />
            </Box>
            <Box bg={cardBg} p={5} rounded="xl" shadow="md">
              <Heading size="md" mb={4}>Items List</Heading>
              <ItemList onDataChange={handleDataChange} />
            </Box>
          </GridItem>

          {/* Column 2: Other Costs */}
          <GridItem>
            <Box bg={cardBg} p={5} rounded="xl" shadow="md" mb={4}>
              <Heading size="md" mb={4}>Add Other Cost</Heading>
              <AddOtherCostForm onDataChange={handleDataChange} />
            </Box>
            <Box bg={cardBg} p={5} rounded="xl" shadow="md">
              <Heading size="md" mb={4}>Other Costs</Heading>
              <OtherCostList onDataChange={handleDataChange} />
            </Box>
          </GridItem>

          {/* Column 3: Total Cost Card */}
          <GridItem>
            <Box bg={summaryBg} p={6} rounded="xl" shadow="xl">
              <Heading size="md" mb={4}>Total Cost</Heading>
              <TotalCostCard />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardPage;
