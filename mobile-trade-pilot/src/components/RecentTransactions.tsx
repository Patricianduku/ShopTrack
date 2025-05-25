import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';

const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 45.50,
      description: 'Customer Purchase - Electronics',
      category: 'Sales',
      time: '2 hours ago',
      method: 'manual'
    },
    {
      id: 2,
      type: 'expense',
      amount: 120.00,
      description: 'Inventory Restock - Office Supplies',
      category: 'Inventory',
      time: '4 hours ago',
      method: 'voice'
    },
    {
      id: 3,
      type: 'income',
      amount: 89.99,
      description: 'Sale - Home Appliances',
      category: 'Sales',
      time: '1 day ago',
      method: 'ocr'
    },
    {
      id: 4,
      type: 'expense',
      amount: 35.00,
      description: 'Utility Bill Payment',
      category: 'Utilities',
      time: '1 day ago',
      method: 'manual'
    },
  ];

  const getMethodBadge = (method: string) => {
    const badges = {
      manual: { label: 'Manual', className: 'bg-gray-100 text-gray-800' },
      voice: { label: 'Voice', className: 'bg-blue-100 text-blue-800' },
      ocr: { label: 'Receipt', className: 'bg-purple-100 text-purple-800' }
    };
    return badges[method as keyof typeof badges] || badges.manual;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => {
          const methodBadge = getMethodBadge(transaction.method);
          return (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-600">{transaction.time}</p>
                    <Badge variant="secondary" className={`text-xs ${methodBadge.className}`}>
                      {methodBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}Ksh {transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">{transaction.category}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
