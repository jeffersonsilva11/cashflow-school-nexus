
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  description: string;
}

// Function to determine if a change is positive
const isPositiveChange = (value: string) => {
  if (!value.startsWith('-')) {
    return true;
  }
  return false;
};

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description 
}: StatCardProps) => {
  const isPositive = isPositiveChange(trend);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUp size={16} className="mr-1" />
          ) : (
            <ArrowDown size={16} className="mr-1" />
          )}
          <span>{trend} {description}</span>
        </div>
      </CardContent>
    </Card>
  );
};
