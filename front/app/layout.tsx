"use client";

import {
  ChakraProvider,
  extendTheme,
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ChatSupport from "./components/chat/ChatSupport";

interface RootLayoutProps {
  children: ReactNode;
}

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        fontFamily: "Inter, sans-serif",
        lineHeight: "1.6",
      },
    },
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
          <PageLayout>{children}</PageLayout>
          <ChatSupportWrapper />
        </ChakraProvider>
      </body>
    </html>
  );
}

function PageLayout({ children }: { children: ReactNode }) {
  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <>
      {/* Background elegante */}
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
        zIndex="-1"
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        position="relative"
        zIndex="1"
      >
        <Sidebar />
        <Box flex="1" p={4} bg={bg}>
          {children}
        </Box>
      </Flex>
    </>
  );
}

function ChatSupportWrapper() {
  return (
    <Box position="fixed" bottom="1rem" right="1rem" zIndex="9999">
      <ChatSupport />
    </Box>
  );
}
