"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Stack, Spinner, Box } from "@chakra-ui/react";
import axios from "axios";
import DeliveryCard, { Delivery } from "../components/delivery/DeliveryCard";

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
      <Heading mb={6} textAlign="center">Entregas finalizadas</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Stack spacing={4}>
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}
