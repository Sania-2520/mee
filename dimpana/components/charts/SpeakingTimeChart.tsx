import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PieChartComponents = dynamic(
  () => import('recharts').then(mod => ({
    PieChart: mod.PieChart,
    Pie: mod.Pie,
    Cell: mod.Cell,
    ResponsiveContainer: mod.ResponsiveContainer,
    Tooltip: mod.Tooltip,
    Legend: mod.Legend
  })),
  { ssr: false }
);

const data = [
  { name: 'Alex Johnson', value: 45 },
  { name: 'Sarah Miller', value: 25 },
  { name: 'James Wilson', value: 20 },
  { name: 'Emily Davis', value: 10 },
];

const COLORS = ['#6366F1', '#22D3EE', '#8B5CF6', '#F43F5E'];

export function SpeakingTimeChart() {
  return (
    <Card className="col-span-1 border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="text-base font-heading">Speaking Time Analytics</CardTitle>
        <CardDescription>Aggregate share of voice across recent meetings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full" style={{ minHeight: '250px', width: '100%' }}>
          <PieChartComponents.ResponsiveContainer width="100%" height="100%">
            <PieChartComponents.PieChart>
              <PieChartComponents.Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <PieChartComponents.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </PieChartComponents.Pie>
              <PieChartComponents.Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#E2E8F0'
                }}
                itemStyle={{ color: '#E2E8F0' }}
              />
              <PieChartComponents.Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChartComponents.PieChart>
          </PieChartComponents.ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
