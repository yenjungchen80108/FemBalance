"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

type AggregateData = {
  riskCounts: { High: number; Medium: number; Low: number };
  featureImportance: { feature: string; coefficient: number }[];
  regularityTrend: { day: number; avgRegularity: number }[];
  ageDistribution: { label: string; count: number }[];
  totalPatients: number;
};

const RISK_COLORS = { High: "#be5266", Medium: "#e0a656", Low: "#7aa8c9" };

function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 border border-gray-200 rounded-2xl bg-white">
      <h3 className="font-serif text-lg text-gray-700 mb-1">{title}</h3>
      {sub && <p className="text-xs text-gray-400 mb-4">{sub}</p>}
      {children}
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
}

export default function Analytics() {
  const [data, setData] = useState<AggregateData | null>(null);

  useEffect(() => {
    fetch("/api/stats/aggregate")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const riskData = data
    ? Object.entries(data.riskCounts).map(([name, value]) => ({ name, value }))
    : [];

  // 依係數絕對值排序，正負值分開上色，讓「影響方向」也能一眼看出
  const featureData = data
    ? [...data.featureImportance]
        .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
        .map((f) => ({ ...f, absValue: Math.abs(f.coefficient) }))
    : [];

  return (
    <main className="min-h-screen bg-[#FEFCFB] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <span className="inline-block text-xs font-medium text-rose-600 bg-rose-100 px-3 py-1 rounded-full mb-3">
          POPULATION ANALYTICS
        </span>
        <h1 className="font-serif text-4xl text-gray-700 mb-1">
          All Patients Overview
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Aggregate trends across {data?.totalPatients ?? "..."} tracked
          patients
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <ChartCard
            title="Risk Level Distribution"
            sub="Share of patients by clinical attention level"
          >
            {!data ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {riskData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          RISK_COLORS[entry.name as keyof typeof RISK_COLORS]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Model Feature Importance"
            sub="Logistic regression coefficients — what drives predictions across the population"
          >
            {!data ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={featureData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    stroke="#9CA3AF"
                    width={100}
                  />
                  <Tooltip
                    formatter={(_value: any, _name: any, props: any) => [
                      props.payload.coefficient.toFixed(3),
                      "Coefficient",
                    ]}
                  />
                  <Bar
                    dataKey="absValue"
                    fill="#C08497"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="Cycle Regularity Trend"
            sub="Population-average variability across study days"
          >
            {!data ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.regularityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="day"
                    stroke="#9CA3AF"
                    label={{
                      value: "Day",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgRegularity"
                    stroke="#C08497"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Age Distribution" sub="Patient reach by age group">
            {!data ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="label" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9CB89A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </main>
  );
}
