import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Language } from '../types';

interface ProductivityChartProps {
  data?: { month: string; liters: number }[];
  language: Language;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  data = [],
  language,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
        {language === 'ta' ? 'பால் உற்பத்தி வரலாற்று தரவு இல்லை' : 'No historical milk data recorded'}
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} />
          <YAxis stroke="#78716c" fontSize={12} domain={['auto', 'auto']} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e7e5e4',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
            formatter={(value: any) => [`${value} L/day`, language === 'ta' ? 'பால் உற்பத்தி' : 'Milk Yield']}
          />
          <Line
            type="monotone"
            dataKey="liters"
            stroke="#047857"
            strokeWidth={3}
            dot={{ r: 4, fill: '#047857', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface CostBreakdownChartProps {
  data?: { month: string; feedCost: number; vetCost: number }[];
  language: Language;
}

export const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({
  data = [],
  language,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
        {language === 'ta' ? 'செலவு வரலாற்று தரவு இல்லை' : 'No cost data recorded'}
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis dataKey="month" stroke="#78716c" fontSize={12} tickLine={false} />
          <YAxis stroke="#78716c" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e7e5e4',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
            formatter={(val: any, name: any) => [
              `₹${val}`,
              name === 'feedCost'
                ? language === 'ta' ? 'தீவன செலவு' : 'Feed Cost'
                : language === 'ta' ? 'மருத்துவ செலவு' : 'Vet Cost',
            ]}
          />
          <Legend
            formatter={(value) =>
              value === 'feedCost'
                ? language === 'ta' ? 'தீவன செலவு' : 'Feed Cost'
                : language === 'ta' ? 'மருத்துவ செலவு' : 'Vet Cost'
            }
            wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
          />
          <Bar dataKey="feedCost" fill="#0d9488" radius={[4, 4, 0, 0]} />
          <Bar dataKey="vetCost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
