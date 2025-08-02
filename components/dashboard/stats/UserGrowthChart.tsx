'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface UserSignupData {
  month: string;
  count: number;
}

interface UserGrowthChartProps {
  data: UserSignupData[];
  loading?: boolean;
}

export const UserGrowthChart = ({ data, loading }: UserGrowthChartProps) => {
    if (loading) {
        return <Skeleton className="h-[350px] w-full" />;
    }

    return (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Pertumbuhan Pengguna</CardTitle>
                <CardDescription className="text-slate-600">Pendaftaran pengguna baru dalam 6 bulan terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="month"
                            stroke="#556"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#556"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #ddd",
                                borderRadius: "0.5rem",
                                backdropFilter: "blur(5px)"
                            }}
                        />
                        <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Pengguna Baru" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};