import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Today\'s Sales',
      value: '+Ksh 850',
      change: '+15.2%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'Items Sold',
      value: '24',
      change: '+8.3%',
      positive: true,
      icon: ShoppingBag,
    },
    {
      title: 'Avg Sale',
      value: 'Ksh 35',
      change: '-2.1%',
      positive: false,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">{stat.title}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
