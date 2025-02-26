"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";

export default function SchedulePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`, {
        customer,
        address,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      router.push("/");
    } catch (error) {
      console.error("Erro ao agendar entrega:", error);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={6}>Agendar Nova Entrega</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Cliente</FormLabel>
            <Input
              type="text"
              placeholder="Nome do cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Endereço</FormLabel>
            <Input
              type="text"
              placeholder="Endereço de entrega"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data e Hora do Agendamento</FormLabel>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Agendar
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
