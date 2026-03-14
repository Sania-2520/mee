import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BarChartComponents = dynamic(
  () => import('recharts').then(mod => ({
    BarChart: mod.BarChart,
    Bar: mod.Bar,
    XAxis: mod.XAxis,
    YAxis: mod.YAxis,
    CartesianGrid: mod.CartesianGrid,
    Tooltip: mod.Tooltip,
    ResponsiveContainer: mod.ResponsiveContainer
  })),
  { ssr: false }
);

const data = [
  { name: 'Mon', meetings: 2, tasks: 4 },
  { name: 'Tue', meetings: 3, tasks: 2 },
  { name: 'Wed', meetings: 1, tasks: 5 },
  { name: 'Thu', meetings: 4, tasks: 3 },
  { name: 'Fri', meetings: 2, tasks: 1 },
];

export function ActivityTimelineChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/40">
      <CardHeader>
        <CardTitle className="text-base font-heading">Weekly Activity Overview</CardTitle>
        <CardDescription>Meetings held vs tasks created this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full" style={{ minHeight: '250px', width: '100%' }}>
          <BarChartComponents.ResponsiveContainer width="100%" height="100%">
            <BarChartComponents.BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <BarChartComponents.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <BarChartComponents.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
              <BarChartComponents.YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <BarChartComponents.Tooltip 
                cursor={{ fill: '#1E293B', opacity: 0.5 }}
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#334155',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <BarChartComponents.Bar dataKey="meetings" name="Meetings" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={30} />
              <BarChartComponents.Bar dataKey="tasks" name="Tasks Generated" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChartComponents.BarChart>
          </BarChartComponents.ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
