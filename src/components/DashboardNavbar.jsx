// src/components/DashboardNavbar.jsx
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const DashboardNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={6}
      py={4}
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex align="center">
        <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>
          Cost Tracker
        </Heading>
        <Spacer />
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle Theme"
        />
      </Flex>
    </Box>
  );
};

export default DashboardNavbar;
