"use client";

import { FC, useCallback, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

export type Delivery = {
  id: number;
  customer: string;
  address: string;
  scheduledAt: string;
  status: string;
};

interface DeliveryCardProps {
  delivery: Delivery;
  onUpdate?: () => void;
  showFinalizeButton?: boolean; // Nova prop adicionada
}

const DeliveryCard: FC<DeliveryCardProps> = ({ delivery, onUpdate, showFinalizeButton = false }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  const formattedDate = useMemo(
    () => new Date(delivery.scheduledAt).toLocaleString(),
    [delivery.scheduledAt]
  );

  const handleFinalize = useCallback(async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/${delivery.id}/finalize`
      );
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao finalizar entrega:", error);
    }
  }, [delivery.id, onUpdate]);

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor}
      color={textColor}
    >
      <Heading fontSize="xl">{delivery.customer}</Heading>
      <Text mt={2}>Endereço: {delivery.address}</Text>
      <Text mt={2}>Agendado para: {formattedDate}</Text>
      <Text mt={2}>Status: {delivery.status}</Text>
      {showFinalizeButton && delivery.status === "PENDING" && (
        <Button mt={4} colorScheme="teal" onClick={handleFinalize}>
          Finalizar Entrega
        </Button>
      )}
    </Box>
  );
};

export default DeliveryCard;
