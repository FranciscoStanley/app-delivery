"use client";

import { ChakraProvider, extendTheme, Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import ChatSupport from "./components/ChatSupport";

interface RootLayoutProps {
  children: ReactNode;
}

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Delivery App</title>
      </head>
      <body>
        <ChakraProvider theme={theme}>
          {/* Imagem de fundo */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bgImage="url('/truck_with_dust.png')"
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPosition="center"
            opacity="0.1"
            pointerEvents="none"
            zIndex={0}
          />
          <Flex position="relative" zIndex={1}>
            <Sidebar />
            <Box flex="1" p={4} bg={{ base: "gray.50", _dark: "gray.800" }}>
              {children}
            </Box>
          </Flex>
          <ChatSupport />
        </ChakraProvider>
      </body>
    </html>
  );
}
