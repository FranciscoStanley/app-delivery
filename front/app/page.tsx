"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Stack,
  Spinner,
  Box,
  useToast,
} from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import DeliveryCard, { Delivery } from "./components/delivery/DeliveryCard";
import DeliveryChart from "./components/delivery/DeliveryChart";

export default function HomePage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries`
      );
      setDeliveries(res.data);
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    // Conecta ao WebSocket para notificações
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL || "");
    socket.on("newDelivery", (data) => {
      toast({
        title: "Nova entrega recebida",
        description: `Entrega de ${data.customer}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      fetchDeliveries();
    });

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  return (
    <Container maxW="container.lg" py={10}>
      <Heading mb={6} textAlign="center">Dashboard de entregas</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Gráficos encapsulados em um quadrado */}
          <Box borderWidth="1px" borderRadius="md" p={4}>
            {deliveries.length > 0 && <DeliveryChart deliveries={deliveries} />}
          </Box>

          {/* Espaço entre os gráficos e a listagem */}
          <Box mt={6} borderWidth="1px" borderRadius="md" p={4}>
            <Stack spacing={4}>
              {deliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onUpdate={fetchDeliveries}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Container>
  );
}
