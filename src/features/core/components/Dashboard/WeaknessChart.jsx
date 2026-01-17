import { memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardBody } from "../../../../shared/components/Card";

export const WeaknessChart = memo(function WeaknessChart({ data }) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
          Weakness Frequency
        </h2>
      </CardHeader>
      <CardBody className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f1f5f9"
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#ef4444"
              radius={[0, 8, 8, 0]}
              barSize={20}
              name="Occurrences"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
});
