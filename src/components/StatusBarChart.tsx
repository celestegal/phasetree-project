import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SimulationData } from "../utils/fetchData";

export const StatusBarChart: React.FC<{ data: SimulationData[] }> = ({ data }) => {
  const statusCount = data.reduce((acc: any, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(statusCount).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
