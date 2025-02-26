"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Delivery {
  status: string;
}

interface DeliveryDashboardProps {
  deliveries: Delivery[];
}

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  deliveries,
}) => {
  const statusCounts = deliveries.reduce(
    (acc: Record<string, number>, delivery) => {
      acc[delivery.status] = (acc[delivery.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Entregas",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Entregas por Status" },
    },
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md" mt={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box height="400px">
          <Bar data={data} options={options} />
        </Box>
        <Box height="400px">
          <Pie data={data} options={options} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default DeliveryDashboard;
