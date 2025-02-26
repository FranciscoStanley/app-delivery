"use client";

import { useState } from "react";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function SchedulePage() {
  const toast = useToast();
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const showToast = (status: "success" | "error", message: string) => {
    toast({
      position: "top-right",
      duration: 3000,
      isClosable: true,
      render: () => (
        <Box
          color="white"
          p={4}
          bg={status === "success" ? "green.500" : "red.500"}
          borderRadius="md"
          boxShadow="lg"
          fontSize="lg"
          minWidth="300px"
          textAlign="center"
        >
          {message}
        </Box>
      ),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`, {
        customer,
        address,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });

      showToast("success", "Entrega agendada com sucesso!");

      // Limpa os campos do formulário após envio
      setCustomer("");
      setAddress("");
      setScheduledAt("");
    } catch (error) {
      console.error("Erro ao agendar entrega:", error);
      showToast(
        "error",
        "Erro ao agendar entrega. Por favor, tente novamente."
      );
    }
  };

  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" size="lg" mb={6} textAlign="center">
        Agendar Nova Entrega
      </Heading>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
        bg={bgColor}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel htmlFor="customer">Cliente</FormLabel>
              <Input
                id="customer"
                type="text"
                placeholder="Nome do cliente"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="address">Endereço</FormLabel>
              <Input
                id="address"
                type="text"
                placeholder="Endereço de entrega"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="scheduledAt">
                Data e Hora do Agendamento
              </FormLabel>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg">
              Agendar
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
