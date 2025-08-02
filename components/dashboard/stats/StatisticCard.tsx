import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  loading?: boolean;
}

export const StatisticCard = ({ title, value, icon, loading }: StatisticCardProps) => {
  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className="text-slate-400">{icon}</div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mt-1" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="text-slate-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
};