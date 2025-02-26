"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Stack, Spinner } from "@chakra-ui/react";
import axios from "axios";
import DeliveryCard, { Delivery } from "../components/DeliveryCard";

export default function CompletedPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompleted = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries?status=COMPLETED`
      );
      setDeliveries(res.data);
    } catch (error) {
      console.error("Erro ao buscar entregas finalizadas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  return (
    <Container maxW="container.lg" py={10}>
      <Heading mb={6}>Entregas Finalizadas</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </Stack>
      )}
    </Container>
  );
}
