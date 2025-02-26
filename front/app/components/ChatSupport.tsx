"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Input,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

interface Message {
  content: string;
  sender: string;
}

export default function ChatSupport() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Cria uma referência para armazenar o socket
  const chatSocketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_API_URL;
    if (!socketUrl) {
      console.error("REACT_APP_API_URL não está definida.");
      return;
    }
    // Inicializa o socket e armazena na referência
    chatSocketRef.current = io(`${socketUrl}/chat`, {
      transports: ["websocket"],
    });
    chatSocketRef.current.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    console.log("Socket conectado:", chatSocketRef.current.id);

    return () => {
      chatSocketRef.current?.disconnect();
      console.log("Socket desconectado");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && chatSocketRef.current) {
      const message: Message = {
        content: input,
        sender: "NomeDoUsuario", // Substitua com o nome ou ID real do usuário
      };
      chatSocketRef.current.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const addEmoji = (emoji: any) => {
    setInput((prev) => prev + emoji.native);
  };

  const inputBgColor = colorMode === "dark" ? "gray.700" : "white";
  const inputTextColor = colorMode === "dark" ? "white" : "black";
  const buttonBgColor = "blue.500";
  const buttonTextColor = "white";

  const handleOpen = () => {
    console.log("Abrindo modal de chat");
    onOpen();
  };

  return (
    <>
      <IconButton
        icon={<FaComments fontSize="24px" />}
        position="fixed"
        top="1rem"
        right="1rem"
        bg={buttonBgColor}
        color={buttonTextColor}
        borderRadius="full"
        onClick={handleOpen}
        _hover={{ bg: "blue.600" }}
        _focus={{ boxShadow: "outline" }}
        aria-label="Abrir chat de suporte"
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat de Suporte</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
              {messages.map((msg, index) => (
                <Box key={index} p={2} bg="gray.100" borderRadius="md">
                  <Text>
                    <strong>{msg.sender}:</strong> {msg.content}
                  </Text>
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter flexDirection="column">
            {showEmojiPicker && (
              <Box mb={2} width="100%">
                <Picker onSelect={addEmoji} style={{ width: "100%" }} />
              </Box>
            )}
            <Box display="flex" width="100%" mt={2}>
              <Button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                bg={buttonBgColor}
                color={buttonTextColor}
                _hover={{ bg: "blue.600" }}
                mr={2}
              >
                😀
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                mr={2}
                bg={inputBgColor}
                color={inputTextColor}
                flex="1"
              />
              <Button
                onClick={sendMessage}
                bg={buttonBgColor}
                color={buttonTextColor}
                _hover={{ bg: "blue.600" }}
              >
                Enviar
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
