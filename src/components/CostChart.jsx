import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../firebase';

const COLORS = ['#3182CE', '#E53E3E'];

const CostChart = ({ reloadCharts }) => {
  const uid = useSelector((state) => state.auth.user?.uid);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue('white', 'gray.600');

  useEffect(() => {
    if (!uid) return;

    const fetchCombinedCostData = async () => {
      setLoading(true);

      try {
        const itemSnapshot = await getDocs(collection(db, `users/${uid}/items`));
        const otherCostSnapshot = await getDocs(collection(db, `users/${uid}/otherCosts`));
        console.log(itemSnapshot)
        console.log(otherCostSnapshot)
        let itemTotal = 0;
        let otherTotal = 0;

        itemSnapshot.forEach(doc => {
          const { cost } = doc.data();
          itemTotal += cost || 0;
        });

        otherCostSnapshot.forEach(doc => {
          const { amount } = doc.data();
          otherTotal += amount || 0;
        });

        const totalChartData = [
          { name: 'Items', value: itemTotal },
          { name: 'Other Costs', value: otherTotal },
        ];

        setData(totalChartData);
      } catch (error) {
        console.error('Error fetching cost chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedCostData();
  }, [uid, reloadCharts]); // React to updates

  if (loading) return <Box textAlign="center" py={6}><Spinner size="lg" /><Text mt={2}>Loading total cost chart...</Text></Box>;
  if (data.every(entry => entry.value === 0)) return <Text textAlign="center" py={6}>No data available for total cost chart.</Text>;

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

export default CostChart;
