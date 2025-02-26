"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Input,
  VStack,
  Text,
  Button,
  useColorMode,
  Image,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import {
  FaComments,
  FaWindowMinimize,
  FaTimes,
  FaPaperclip,
  FaFilePdf,
} from "react-icons/fa";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Message {
  id?: string;
  content: string;
  sender: string;
  file?: {
    name: string;
    type: string;
    url?: string;
  };
}

function ConfirmCloseModal({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent borderRadius="xl">
        <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
          Confirmar Fechamento
        </ModalHeader>
        <ModalBody textAlign="center">
          <Text mb={4}>
            Você tem certeza que deseja fechar a conversa? Todas as mensagens
            serão apagadas e essa ação não poderá ser desfeita.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button mr={3} onClick={onCancel} variant="outline">
            Cancelar
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ConfirmFileActionModal({
  isOpen,
  fileName,
  onDownload,
  onOpenFile,
  onCancel,
}: {
  isOpen: boolean;
  fileName: string;
  onDownload: () => void;
  onOpenFile: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent borderRadius="xl">
        <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
          Ação para o Arquivo
        </ModalHeader>
        <ModalBody textAlign="center">
          <Text mb={4}>
            Deseja baixar ou abrir o arquivo <strong>{fileName}</strong>?
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button mr={3} onClick={onCancel} variant="outline">
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={onOpenFile} mr={2}>
            Abrir
          </Button>
          <Button colorScheme="green" onClick={onDownload}>
            Baixar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function ChatSupport() {
  const { colorMode } = useColorMode();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadMessageIndex, setLastReadMessageIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<Message | null>(null);
  const chatSocketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configurações de cores e estilo
  const chatBg = colorMode === "dark" ? "gray.800" : "white";
  // No modo dark, o texto será preto conforme solicitado:
  const chatTextColor = colorMode === "dark" ? "black" : "gray.700";
  const inputBg = "white";
  const buttonBgColor = "blue.500";
  const buttonTextColor = "white";

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!socketUrl) {
      console.error("NEXT_PUBLIC_API_URL não está definida.");
      return;
    }
    chatSocketRef.current = io(`${socketUrl}/chat`, {
      transports: ["websocket"],
    });
    chatSocketRef.current.on("newMessage", (msg: Message) => {
      setMessages((prev) => {
        if (
          msg.sender === "NomeDoUsuario" &&
          prev.find(
            (m) =>
              m.sender === msg.sender &&
              m.content === msg.content &&
              m.file?.name === msg.file?.name
          )
        ) {
          return prev;
        }
        if (msg.id && prev.find((m) => m.id === msg.id)) {
          return prev;
        }
        return [...prev, msg];
      });
    });
    console.log("Socket conectado:", chatSocketRef.current.id);
    return () => {
      chatSocketRef.current?.disconnect();
      console.log("Socket desconectado");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  const sendMessage = () => {
    if (input.trim() && chatSocketRef.current) {
      const message: Message = {
        id: generateId(),
        content: input,
        sender: "NomeDoUsuario",
      };
      chatSocketRef.current.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const sendFileMessage = (file: File) => {
    if (chatSocketRef.current) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        const message: Message = {
          id: generateId(),
          content: "",
          sender: "NomeDoUsuario",
          file: {
            name: file.name,
            type: file.type,
            url: imageUrl,
          },
        };
        chatSocketRef.current.emit("sendMessage", message);
        setMessages((prev) => [...prev, message]);
      } else if (
        file.type === "application/pdf" ||
        file.type === "text/plain"
      ) {
        const fileUrl = URL.createObjectURL(file);
        const message: Message = {
          id: generateId(),
          content: "",
          sender: "NomeDoUsuario",
          file: {
            name: file.name,
            type: file.type,
            url: fileUrl,
          },
        };
        chatSocketRef.current.emit("sendMessage", message);
        setMessages((prev) => [...prev, message]);
      } else {
        const message: Message = {
          id: generateId(),
          content: `Arquivo enviado: ${file.name}`,
          sender: "NomeDoUsuario",
          file: {
            name: file.name,
            type: file.type,
          },
        };
        chatSocketRef.current.emit("sendMessage", message);
        setMessages((prev) => [...prev, message]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      sendFileMessage(files[0]);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
      setLastReadMessageIndex(messages.length);
    } else {
      const newMessages = messages
        .slice(lastReadMessageIndex)
        .filter((m) => m.sender !== "NomeDoUsuario");
      setUnreadCount(newMessages.length);
    }
  }, [isChatOpen, messages, lastReadMessageIndex]);

  const handleFileClick = (msg: Message) => {
    if (
      msg.file &&
      (msg.file.type === "application/pdf" || msg.file.type === "text/plain")
    ) {
      setSelectedFile(msg);
    }
  };

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const openFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (!isChatOpen) {
    return (
      <Box position="fixed" bottom="1.5rem" left="1.5rem">
        <Box position="relative">
          <IconButton
            icon={<FaComments />}
            onClick={() => setIsChatOpen(true)}
            borderRadius="full"
            colorScheme={messages.length > 0 ? "blue" : "teal"}
            aria-label="Abrir chat de suporte"
            w="80px"
            h="80px"
            fontSize="3xl"
            boxShadow="lg"
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="0"
              right="0"
              bg="red.500"
              color="white"
              borderRadius="full"
              fontSize="xs"
              px={2}
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <ConfirmCloseModal
        isOpen={showCloseModal}
        onConfirm={() => {
          setMessages([]);
          setIsChatOpen(false);
          setShowCloseModal(false);
        }}
        onCancel={() => setShowCloseModal(false)}
      />
      {selectedFile && selectedFile.file && (
        <ConfirmFileActionModal
          isOpen={!!selectedFile}
          fileName={selectedFile.file.name}
          onDownload={() => {
            if (selectedFile.file?.url) {
              downloadFile(selectedFile.file.url, selectedFile.file.name);
            }
            setSelectedFile(null);
          }}
          onOpenFile={() => {
            if (selectedFile.file?.url) {
              openFile(selectedFile.file.url);
            }
            setSelectedFile(null);
          }}
          onCancel={() => setSelectedFile(null)}
        />
      )}
      <Box
        position="fixed"
        bottom="1.5rem"
        left="1.5rem"
        width="320px"
        height="480px"
        bg={chatBg}
        color={chatTextColor}
        boxShadow="2xl"
        borderRadius="xl"
        overflow="hidden"
        zIndex="9999"
        display="flex"
        flexDirection="column"
        transition="all 0.3s ease"
      >
        {/* Cabeçalho */}
        <Box
          p={4}
          bgGradient="linear(to-r, teal.500, blue.500)"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight="bold" fontSize="lg">
            Chat de Suporte
          </Text>
          <Box>
            <IconButton
              icon={<FaWindowMinimize />}
              size="sm"
              onClick={() => setIsChatOpen(false)}
              aria-label="Minimizar chat"
              mr={2}
              variant="ghost"
            />
            <IconButton
              icon={<FaTimes />}
              size="sm"
              onClick={() => setShowCloseModal(true)}
              aria-label="Fechar chat"
              variant="ghost"
            />
          </Box>
        </Box>
        {/* Área de Mensagens */}
        <Box
          flex="1"
          overflowY="auto"
          p={4}
          bg={colorMode === "dark" ? "gray.700" : "gray.50"}
        >
          <VStack spacing={3} align="stretch">
            {messages.map((msg, index) => {
              const isUser = msg.sender === "NomeDoUsuario";
              return (
                <Box
                  key={index}
                  p={3}
                  bg={isUser ? "blue.50" : "gray.100"}
                  borderRadius="lg"
                  alignSelf={isUser ? "flex-end" : "flex-start"}
                  maxWidth="80%"
                  boxShadow="sm"
                  color={chatTextColor}
                >
                  {msg.file ? (
                    msg.file.type.startsWith("image/") && msg.file.url ? (
                      <Image
                        src={msg.file.url}
                        alt={msg.file.name}
                        maxWidth="100%"
                        maxHeight="200px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    ) : (msg.file.type === "application/pdf" ||
                        msg.file.type === "text/plain") &&
                      msg.file.url ? (
                      <Box
                        textAlign="center"
                        cursor="pointer"
                        onClick={() => handleFileClick(msg)}
                      >
                        <FaFilePdf size={48} />
                        <Text fontSize="xs" mt={2}>
                          {msg.file.name}
                        </Text>
                      </Box>
                    ) : (
                      <Text fontSize="sm">
                        <strong>{msg.sender}:</strong> {msg.file.name} (
                        {msg.file.type})
                      </Text>
                    )
                  ) : (
                    <Text fontSize="sm">
                      <strong>{msg.sender}:</strong> {msg.content}
                    </Text>
                  )}
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        {/* Área de Input */}
        <Box
          p={4}
          bg={colorMode === "dark" ? "gray.800" : "gray.50"}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          {showEmojiPicker && (
            <Box
              mb={2}
              maxW="260px"
              borderRadius="md"
              overflowY="auto"
              boxShadow="md"
              style={{ width: "260px", height: "350px", margin: "0 auto" }}
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                searchDisabled={true}
                previewConfig={{ showPreview: false }}
              />
            </Box>
          )}
          <Box display="flex" alignItems="center">
            <IconButton
              icon={<FaPaperclip />}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Enviar arquivo"
              mr={2}
              size="sm"
              variant="ghost"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="application/pdf,image/*,text/plain"
            />
            <IconButton
              icon={<FaComments />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Selecionar emoji"
              mr={2}
              size="sm"
              variant="ghost"
            />
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              bg={inputBg}
              size="sm"
              borderRadius="full"
              _focus={{ boxShadow: "outline" }}
            />
            <Button
              onClick={sendMessage}
              bg={buttonBgColor}
              color={buttonTextColor}
              ml={2}
              size="sm"
              borderRadius="full"
              _hover={{ bg: "blue.600" }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
