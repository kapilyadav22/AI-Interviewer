import { memo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardBody } from "../../../../shared/components/Card";

export const PerformanceTrendChart = memo(function PerformanceTrendChart({
  data,
}) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
          Performance Trend
        </h2>
      </CardHeader>
      <CardBody className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />
            <YAxis
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="technical"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Technical"
            />
            <Line
              type="monotone"
              dataKey="communication"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Communication"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
});
