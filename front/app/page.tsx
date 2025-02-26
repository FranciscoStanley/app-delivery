"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Stack, Spinner, useToast } from "@chakra-ui/react";
import { io, Socket } from "socket.io-client";
import DeliveryCard, { Delivery } from "./components/DeliveryCard";
import DeliveryChart from "./components/DeliveryChart";
import axios from "axios";

let socket: Socket;

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
    socket = io(process.env.NEXT_PUBLIC_API_URL);
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
  }, []);

  return (
    <Container maxW="container.lg" py={10}>
      <Heading mb={6}>Dashboard de Entregas</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Stack spacing={4}>
            {deliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onUpdate={fetchDeliveries}
              />
            ))}
          </Stack>
          {deliveries.length > 0 && <DeliveryChart deliveries={deliveries} />}
        </>
      )}
    </Container>
  );
}
