import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../firebase';

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#A569BD', '#0088FE', '#E91E63'];

const OtherCostDistributionChart = ({ reloadCharts }) => {
  const uid = useSelector((state) => state.auth.user?.uid);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg= useColorModeValue('white', 'gray.600');

  useEffect(() => {
    if (!uid) return;

    const fetchOtherCostData = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(collection(db, `users/${uid}/otherCosts`));
        const chartData = [];
        snapshot.forEach(doc => {
          const { description, amount } = doc.data();
          if (description && amount) chartData.push({ name: description, value: amount });
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching other costs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherCostData();
  }, [uid, reloadCharts]); // Added reloadCharts here

  if (loading) return <Box textAlign="center" py={6}><Spinner size="lg" /><Text mt={2}>Loading other costs chart...</Text></Box>;
  if (data.length === 0) return <Text textAlign="center" py={6}>No other cost data available to display chart.</Text>;

  return (
    <Box w="100%" h="300px" maxW="5xl" mx="auto" mt={8} bg={bg}  pb={5} pt={3} rounded="md" shadow="md">
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

export default OtherCostDistributionChart;
