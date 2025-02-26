"use client";

import React from "react";
import {
  Box,
  VStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartBar,
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaHistory,
  FaSun,
  FaMoon,
} from "react-icons/fa";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function Sidebar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const buttonTextColor: string = useColorModeValue("white", "black");

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: FaChartBar },
    { label: "Agendar", href: "/schedule", icon: FaCalendarAlt },
    { label: "Entregas Pendentes", href: "/pending", icon: FaHourglassHalf },
    { label: "Entregas Finalizadas", href: "/completed", icon: FaCheckCircle },
    { label: "Histórico de Agendamentos", href: "/history", icon: FaHistory },
  ];

  return (
    <Box
      as="nav"
      bg={useColorModeValue("blue.500", "blue.900")}
      color="white"
      w="300px"
      minH="100vh"
      p={6}
      position="sticky"
      top="0"
      boxShadow="md"
    >
      <VStack spacing={8} align="center" w="full">
        {/* Alternador de Tema */}
        <Box alignSelf="flex-end">
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Box>
        {/* Itens de Navegação */}
        <VStack spacing={4} w="full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a style={{ width: "100%", textDecoration: "none" }}>
                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    width="100%"
                    color={buttonTextColor}
                    leftIcon={React.createElement(item.icon)}
                    bg={
                      isActive
                        ? useColorModeValue("blue.400", "blue.800")
                        : undefined
                    }
                    _hover={{ bg: useColorModeValue("blue.400", "blue.800") }}
                    transition="background-color 0.2s"
                  >
                    {item.label}
                  </Button>
                </a>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
