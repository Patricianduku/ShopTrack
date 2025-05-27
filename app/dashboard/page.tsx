'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Mic,
  Camera,
  BarChart4,
  PieChart as PieChartIcon,
  Calendar,
  ShoppingBag,
  Store,
  X
} from 'lucide-react';

// Mock data for business demonstration
const weeklyData = [
  { day: 'Mon', sales: 1200, expenses: 400, profit: 800 },
  { day: 'Tue', sales: 800, expenses: 300, profit: 500 },
  { day: 'Wed', sales: 2100, expenses: 500, profit: 1600 },
  { day: 'Thu', sales: 650, expenses: 350, profit: 300 },
  { day: 'Fri', sales: 1800, expenses: 600, profit: 1200 },
  { day: 'Sat', sales: 2200, expenses: 400, profit: 1800 },
  { day: 'Sun', sales: 900, expenses: 200, profit: 700 },
];

const expenseCategories = [
  { name: 'Inventory', value: 1200, color: '#F97316' },
  { name: 'Rent', value: 800, color: '#FB923C' },
  { name: 'Utilities', value: 400, color: '#FED7AA' },
  { name: 'Marketing', value: 300, color: '#FFEDD5' },
  { name: 'Other', value: 200, color: '#FEF3E2' },
];

// These are placeholders - in a real app, you would import these components
const QuickStats = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Today's Sales</span>
          <span className="text-2xl font-bold">Ksh 12,350</span>
          <span className="text-sm text-green-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +15% from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Inventory Items</span>
          <span className="text-2xl font-bold">43</span>
          <span className="text-sm text-orange-500 flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            5 low in stock
          </span>
        </div>
      </CardContent>
    </Card>
  </div>
);

const RecentTransactions = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-orange-500" />
        Recent Transactions
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="divide-y divide-gray-100">
        {[
          { id: 1, type: 'sale', description: 'Sale - Men\'s T-shirt', amount: 1200, time: '10:23 AM' },
          { id: 2, type: 'expense', description: 'Supplier Payment', amount: -5000, time: 'Yesterday' },
          { id: 3, type: 'sale', description: 'Sale - Women\'s Dress', amount: 2500, time: 'Yesterday' },
        ].map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-4">
            <div className="flex flex-col">
              <span className="font-medium">{transaction.description}</span>
              <span className="text-sm text-gray-500">{transaction.time}</span>
            </div>
            <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount > 0 ? '+' : ''}Ksh {Math.abs(transaction.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

type ModalProps = { onClose: () => void };

const AddTransaction = ({ onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Add Transaction</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Transaction form would go here.</p>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Add Transaction</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const VoiceInput = ({ onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Voice Input</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Voice input interface would go here.</p>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const OCRScanner = ({ onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scan Receipt</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>OCR Scanner interface would go here.</p>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function Dashboard() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSales = weeklyData.reduce((sum, day) => sum + day.sales, 0);
  const totalExpenses = weeklyData.reduce((sum, day) => sum + day.expenses, 0);
  const totalProfit = totalSales - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Store className="h-6 w-6" />
                ShopTrack
              </h1>
              <p className="text-orange-100">Your Business Assistant</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-100">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-orange-100">Sales</p>
              <p className="text-xl font-bold">Ksh {totalSales.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-orange-100">Expenses</p>
              <p className="text-xl font-bold">Ksh {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-orange-100">Profit</p>
              <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                {totalProfit >= 0 ? '+' : ''}Ksh {totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Weekly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-orange-500" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [`Ksh ${value}`, name]}
                    labelStyle={{ color: '#1f2937' }}
                  />
                  <Bar dataKey="sales" fill="#10B981" radius={4} />
                  <Bar dataKey="expenses" fill="#EF4444" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-orange-500" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: Ksh ${value}`}
                    labelLine={false}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`Ksh ${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 h-auto flex flex-col gap-2"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add</span>
          </Button>
          
          <Button
            onClick={() => setShowVoiceInput(true)}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 p-4 h-auto flex flex-col gap-2"
          >
            <Mic className="h-6 w-6" />
            <span className="text-sm">Voice</span>
          </Button>
          
          <Button
            onClick={() => setShowOCRScanner(true)}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 p-4 h-auto flex flex-col gap-2"
          >
            <Camera className="h-6 w-6" />
            <span className="text-sm">Scan</span>
          </Button>
        </div>

        {/* Business Status Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-800">Shop Open</span>
              </div>
              <Badge className="bg-green-200 text-green-800">
                <ShoppingBag className="h-3 w-3 mr-1" />
                Ready for Business
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showAddTransaction && (
        <AddTransaction onClose={() => setShowAddTransaction(false)} />
      )}
      
      {showVoiceInput && (
        <VoiceInput onClose={() => setShowVoiceInput(false)} />
      )}
      
      {showOCRScanner && (
        <OCRScanner onClose={() => setShowOCRScanner(false)} />
      )}
    </div>
  );
}