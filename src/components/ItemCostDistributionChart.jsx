import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../firebase';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#FF6666'];

const ItemCostDistributionChart = ({ reloadCharts }) => {
  const uid = useSelector((state) => state.auth.user?.uid);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue('white', 'gray.600');

  useEffect(() => {
    if (!uid) return;

    const fetchItemCostData = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(collection(db, `users/${uid}/items`));
        console.log(snapshot)
        const chartData = [];
        snapshot.forEach(doc => {
            const { name, cost } = doc.data();
            if (name && cost) chartData.push({ name, value: cost });
        });
          

        setData(chartData);
      } catch (error) {
        console.error('Error fetching item costs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemCostData();
  }, [uid, reloadCharts]); // Listen for external triggers

  if (loading) return <Box textAlign="center" py={6}><Spinner size="lg" /><Text mt={2}>Loading item costs chart...</Text></Box>;
  if (data.length === 0) return <Text textAlign="center" py={6}>No item data available to display chart.</Text>;

  return (
    <Box w="100%" h="300px" maxW="5xl" mx="auto" mt={8} bg={bg} pb={5} pt={3} rounded="md" shadow="md">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ItemCostDistributionChart;
