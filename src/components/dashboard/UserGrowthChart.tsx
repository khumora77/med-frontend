// src/components/dashboard/UserGrowthChart.tsx
import React from "react";
import { Column } from "@ant-design/charts";

interface UserGrowthChartProps {
  data: { month: string; users: number }[];
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const config = {
    data,
    xField: "month",
    yField: "users",
    color: "#1890ff",
    label: {
      position: "middle" as const,
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        type: "inner",
        offset: "-30%",
        style: {
          textAlign: "center",
        },
      },
    },
  };

  return <Column {...config} />;
};
