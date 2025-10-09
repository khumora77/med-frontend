import React from 'react';
import { Pie } from '@ant-design/charts';

interface UserRoleChartProps {
  data: { role: string; count: number }[];
}

export const UserRoleChart: React.FC<UserRoleChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    type: item.role.toUpperCase(),
    value: item.count,
  }));

  const config = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
    },
  };

  return <Pie {...config} />;
};