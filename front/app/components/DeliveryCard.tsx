"use client";

import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
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
}

const DeliveryCard: FC<DeliveryCardProps> = ({ delivery, onUpdate }) => {
  const handleFinalize = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/deliveries/${delivery.id}/finalize`
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao finalizar entrega:", error);
    }
  };

  // Define cores diferentes para modos claro e escuro
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor}
      color={textColor} // Aplica a cor do texto baseada no modo de cor
    >
      <Heading fontSize="xl">{delivery.customer}</Heading>
      <Text mt={2}>Endereço: {delivery.address}</Text>
      <Text mt={2}>
        Agendado para: {new Date(delivery.scheduledAt).toLocaleString()}
      </Text>
      <Text mt={2}>Status: {delivery.status}</Text>
      {delivery.status === "PENDING" && (
        <Button mt={4} colorScheme="teal" onClick={handleFinalize}>
          Finalizar Entrega
        </Button>
      )}
    </Box>
  );
};

export default DeliveryCard;
