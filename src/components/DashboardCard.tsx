import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className = '',
  onClick 
}: DashboardCardProps) {
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer hover:border-blue-200' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
        )}
        {trend && (
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              trend.positive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.positive ? '↗' : '↘'} {trend.value}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}