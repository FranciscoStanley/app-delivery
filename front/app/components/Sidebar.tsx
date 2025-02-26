"use client";

import {
  Box,
  VStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Sidebar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const buttonTextColor = useColorModeValue("white", "black");

  return (
    <Box
      as="nav"
      bg="blue.200"
      color="white"
      w="300px"
      minH="100vh"
      p={4}
      position="sticky"
      top="0"
    >
      <VStack spacing={6} align="start" w="full">
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="outline"
          alignSelf="end"
        />
        <Link href="/">
          <Button
            variant="ghost"
            colorScheme="blue"
            width="100%"
            color={buttonTextColor}
            _hover={{ bg: "blue.300" }}
          >
            Dashboard
          </Button>
        </Link>
        <Link href="/schedule">
          <Button
            variant="ghost"
            colorScheme="blue"
            width="100%"
            color={buttonTextColor}
            _hover={{ bg: "blue.300" }}
          >
            Agendar
          </Button>
        </Link>
        <Link href="/history">
          <Button
            variant="ghost"
            colorScheme="blue"
            width="100%"
            color={buttonTextColor}
            _hover={{ bg: "blue.300" }}
          >
            Histórico de Agendamento
          </Button>
        </Link>
        <Link href="/completed">
          <Button
            variant="ghost"
            colorScheme="blue"
            width="100%"
            color={buttonTextColor}
            _hover={{ bg: "blue.300" }}
          >
            Entregas Finalizadas
          </Button>
        </Link>
        <Link href="/pending">
          <Button
            variant="ghost"
            colorScheme="blue"
            width="100%"
            color={buttonTextColor}
            _hover={{ bg: "blue.300" }}
          >
            Entregas Pendentes
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}
