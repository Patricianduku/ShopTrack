import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart4, 
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, calculatePercentageChange } from '@/lib/utils';
// Importing Chart component from shadcn-ui
import { ApexChart } from '@/components/ui/chart';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [chartView, setChartView] = useState('overview');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Create mock data for demonstration
  const mockData = {
    day: generateDayData(),
    week: generateWeekData(),
    month: generateMonthData(),
    quarter: generateQuarterData(),
    year: generateYearData()
  };
  
  const currentData = mockData[timeRange as keyof typeof mockData];
  
  // Summary calculations
  const summary = {
    income: currentData.totalIncome,
    expense: currentData.totalExpenses,
    net: currentData.totalIncome - currentData.totalExpenses,
    incomeChange: currentData.incomeChange,
    expenseChange: currentData.expenseChange,
    netChange: calculatePercentageChange(
      currentData.totalIncome - currentData.totalExpenses,
      currentData.previousIncome - currentData.previousExpenses
    )
  };

  // Calculate highest expense and income categories
  const topExpenseCategory = findTopCategory(currentData.expenseCategories);
  const topIncomeCategory = findTopCategory(currentData.incomeCategories);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary/5 pt-16 pb-6 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-semibold">Analytics</h1>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Time Period Selector */}
        <div className="mb-6">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Income Card */}
          <SummaryCard
            title="Income"
            value={summary.income}
            change={summary.incomeChange}
            icon={<DollarSign className="h-5 w-5" />}
            positive
          />
          
          {/* Expense Card */}
          <SummaryCard
            title="Expenses"
            value={summary.expense}
            change={summary.expenseChange}
            icon={<CreditCard className="h-5 w-5" />}
            positive={false}
          />
          
          {/* Net Profit Card */}
          <SummaryCard
            title="Net"
            value={summary.net}
            change={summary.netChange}
            icon={<TrendingUp className="h-5 w-5" />}
            positive={summary.netChange >= 0}
          />
        </div>
        
        {/* Chart View Selector */}
        <div className="mb-6">
          <Tabs value={chartView} onValueChange={setChartView} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Chart Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base font-medium flex justify-between items-center">
              <span>
                {chartView === 'overview'
                  ? 'Income vs Expenses'
                  : chartView === 'income'
                  ? 'Income Trend'
                  : 'Expense Trend'}
              </span>
              <Select
                value={chartType}
                onValueChange={(value: string) => setChartType(value as 'line' | 'bar' | 'area')}
              >
                <SelectTrigger className="w-[120px] h-8" aria-label="Chart Type">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ApexChart
                type={chartType}
                options={{
                  chart: { toolbar: { show: false } },
                  colors:
                    chartView === 'overview'
                      ? ['#10B981', '#EF4444']
                      : chartView === 'income'
                      ? ['#10B981']
                      : ['#EF4444'],
                  stroke: { width: 2, curve: 'smooth' },
                  fill:
                    chartType === 'area'
                      ? {
                          type: 'gradient',
                          gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.2,
                            stops: [0, 90, 100],
                          },
                        }
                      : undefined,
                  xaxis: {
                    categories: currentData.labels,
                    labels: { style: { colors: 'var(--muted-foreground)' } },
                  },
                  yaxis: {
                    labels: {
                      formatter: (value: number) => `$${value}`,
                      style: { colors: 'var(--muted-foreground)' },
                    },
                  },
                  tooltip: { theme: 'dark' },
                  legend: { position: 'top', horizontalAlign: 'right' },
                  grid: { borderColor: 'var(--border)' },
                }}
                series={
                  chartView === 'overview'
                    ? [
                        { name: 'Income', data: currentData.incomeData },
                        { name: 'Expenses', data: currentData.expenseData },
                      ]
                    : chartView === 'income'
                    ? [{ name: 'Income', data: currentData.incomeData }]
                    : [{ name: 'Expenses', data: currentData.expenseData }]
                }
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Category breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-success" />
                Income by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ApexChart
                  type="donut"
                  options={{
                    chart: {
                      toolbar: { show: false }
                    },
                    colors: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'],
                    labels: currentData.incomeCategories.map(cat => cat.name),
                    legend: {
                      position: 'bottom'
                    },
                    dataLabels: {
                      enabled: false
                    },
                    tooltip: {
                      theme: 'dark',
                      y: {
                        formatter: (value: number) => `$${value}`
                      }
                    }
                  }}
                  series={currentData.incomeCategories.map(cat => cat.amount)}
                />
              </div>
              
              {/* Top Income Category */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Top Source</p>
                    <p className="font-medium">{topIncomeCategory?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-mono font-medium text-success">
                      {formatCurrency(topIncomeCategory?.amount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-error" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ApexChart
                  type="donut"
                  options={{
                    chart: {
                      toolbar: { show: false }
                    },
                    colors: ['#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#6B7280'],
                    labels: currentData.expenseCategories.map(cat => cat.name),
                    legend: {
                      position: 'bottom'
                    },
                    dataLabels: {
                      enabled: false
                    },
                    tooltip: {
                      theme: 'dark',
                      y: {
                        formatter: (value: number) => `$${value}`
                      }
                    }
                  }}
                  series={currentData.expenseCategories.map(cat => cat.amount)}
                />
              </div>
              
              {/* Top Expense Category */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Top Expense</p>
                    <p className="font-medium">{topExpenseCategory?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-mono font-medium text-error">
                      {formatCurrency(topExpenseCategory?.amount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart4 className="h-5 w-5 mr-2" />
              Monthly Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ApexChart
                type="bar"
                options={{
                  chart: {
                    stacked: false,
                    toolbar: { show: false }
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '55%',
                      borderRadius: 4,
                    },
                  },
                  colors: ['#10B981', '#EF4444', '#3B82F6'],
                  dataLabels: {
                    enabled: false
                  },
                  stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                  },
                  xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    labels: {
                      style: {
                        colors: 'var(--muted-foreground)'
                      }
                    }
                  },
                  yaxis: {
                    labels: {
                      formatter: (value: number) => `$${value}`,
                      style: {
                        colors: 'var(--muted-foreground)'
                      }
                    }
                  },
                  tooltip: {
                    theme: 'dark',
                    y: {
                      formatter: (value: number) => `$${value}`
                    }
                  },
                  fill: {
                    opacity: 1
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right'
                  },
                  grid: {
                    borderColor: 'var(--border)'
                  }
                }}
                series={[
                  {
                    name: 'Income',
                    data: [2400, 3200, 2800, 5100, 4800, 3500]
                  },
                  {
                    name: 'Expenses',
                    data: [1400, 1100, 1800, 2500, 2200, 1800]
                  },
                  {
                    name: 'Net',
                    data: [1000, 2100, 1000, 2600, 2600, 1700]
                  }
                ]}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Export Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="w-full max-w-xs"
            aria-label="Export Analytics Report"
            // TODO: Implement export to CSV/PDF functionality
          >
            <Calendar className="h-4 w-4 mr-2" />
            Export Analytics Report
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper component for summary cards
function SummaryCard({ 
  title, 
  value, 
  change, 
  icon, 
  positive 
}: { 
  title: string; 
  value: number; 
  change: number; 
  icon: React.ReactNode; 
  positive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`rounded-full p-1.5 ${positive ? 'bg-success/10' : 'bg-error/10'}`}>
              {icon}
            </div>
            <span className="text-sm">{title}</span>
          </div>
          
          <div className="font-mono font-semibold text-xl pt-1">
            {formatCurrency(value)}
          </div>
          
          <div className="flex items-center text-xs mt-2">
            {change >= 0 ? (
              <TrendingUp className={`h-3 w-3 mr-1 ${positive ? 'text-success' : 'text-error'}`} />
            ) : (
              <TrendingDown className={`h-3 w-3 mr-1 ${positive ? 'text-error' : 'text-success'}`} />
            )}
            <span 
              className={change >= 0 
                ? (positive ? 'text-success' : 'text-error') 
                : (positive ? 'text-error' : 'text-success')}
            >
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-muted-foreground ml-1">vs previous</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function to find the top category
function findTopCategory(categories: { name: string; amount: number }[]) {
  if (categories.length === 0) return null;
  return categories.reduce((max, cat) => cat.amount > max.amount ? cat : max, categories[0]);
}

// Mock data generation functions
function generateDayData() {
  return {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
    incomeData: [0, 0, 120, 0, 350, 0, 0, 200, 0],
    expenseData: [30, 45, 0, 65, 0, 90, 35, 0, 50],
    totalIncome: 670,
    totalExpenses: 315,
    previousIncome: 520,
    previousExpenses: 280,
    incomeChange: 28.8,
    expenseChange: 12.5,
    incomeCategories: [
      { name: 'Sales', amount: 350 },
      { name: 'Services', amount: 320 }
    ],
    expenseCategories: [
      { name: 'Office', amount: 120 },
      { name: 'Software', amount: 65 },
      { name: 'Food', amount: 65 },
      { name: 'Supplies', amount: 65 }
    ]
  };
}

function generateWeekData() {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    incomeData: [650, 400, 800, 200, 950, 450, 0],
    expenseData: [200, 250, 300, 150, 400, 100, 50],
    totalIncome: 3450,
    totalExpenses: 1450,
    previousIncome: 2900,
    previousExpenses: 1600,
    incomeChange: 19,
    expenseChange: -9.4,
    incomeCategories: [
      { name: 'Sales', amount: 1800 },
      { name: 'Services', amount: 950 },
      { name: 'Investments', amount: 700 }
    ],
    expenseCategories: [
      { name: 'Marketing', amount: 400 },
      { name: 'Supplies', amount: 350 },
      { name: 'Software', amount: 250 },
      { name: 'Office', amount: 200 },
      { name: 'Food', amount: 150 },
      { name: 'Travel', amount: 100 }
    ]
  };
}

function generateMonthData() {
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    incomeData: [3200, 2800, 4500, 3700],
    expenseData: [1500, 1300, 1800, 1600],
    totalIncome: 14200,
    totalExpenses: 6200,
    previousIncome: 12500,
    previousExpenses: 5800,
    incomeChange: 13.6,
    expenseChange: 6.9,
    incomeCategories: [
      { name: 'Sales', amount: 7500 },
      { name: 'Services', amount: 4200 },
      { name: 'Investments', amount: 1800 },
      { name: 'Refunds', amount: 700 }
    ],
    expenseCategories: [
      { name: 'Marketing', amount: 1700 },
      { name: 'Salary', amount: 1500 },
      { name: 'Software', amount: 950 },
      { name: 'Office', amount: 850 },
      { name: 'Supplies', amount: 700 },
      { name: 'Travel', amount: 500 }
    ]
  };
}

function generateQuarterData() {
  return {
    labels: ['Jan', 'Feb', 'Mar'],
    incomeData: [12000, 15000, 13500],
    expenseData: [5500, 6000, 5800],
    totalIncome: 40500,
    totalExpenses: 17300,
    previousIncome: 38200,
    previousExpenses: 16800,
    incomeChange: 6,
    expenseChange: 3,
    incomeCategories: [
      { name: 'Sales', amount: 22000 },
      { name: 'Services', amount: 12500 },
      { name: 'Investments', amount: 6000 }
    ],
    expenseCategories: [
      { name: 'Salary', amount: 7500 },
      { name: 'Marketing', amount: 3400 },
      { name: 'Software', amount: 2700 },
      { name: 'Office', amount: 1800 },
      { name: 'Travel', amount: 1200 },
      { name: 'Supplies', amount: 700 }
    ]
  };
}

function generateYearData() {
  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    incomeData: [40500, 45000, 38000, 52000],
    expenseData: [17300, 19500, 16800, 22000],
    totalIncome: 175500,
    totalExpenses: 75600,
    previousIncome: 160000,
    previousExpenses: 70000,
    incomeChange: 9.7,
    expenseChange: 8,
    incomeCategories: [
      { name: 'Sales', amount: 95000 },
      { name: 'Services', amount: 45000 },
      { name: 'Investments', amount: 35500 }
    ],
    expenseCategories: [
      { name: 'Salary', amount: 32000 },
      { name: 'Marketing', amount: 15500 },
      { name: 'Software', amount: 10200 },
      { name: 'Office', amount: 7800 },
      { name: 'Travel', amount: 6500 },
      { name: 'Utilities', amount: 3600 }
    ]
  };
}