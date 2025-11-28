import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ChevronLeft, LogOut } from 'lucide-react';

interface SidebarProps {
  title: string;
  role: string;
  menuItems: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }[];
  onBack: () => void;
}

export function Sidebar({ title, role, menuItems, onBack }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={item.onClick}
              >
                {item.icon}
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onBack}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}