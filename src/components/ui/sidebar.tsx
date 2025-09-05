import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  File, 
  BookOpen, 
  ClipboardCheck, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

export function Sidebar({ className, onNavigate, currentPath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['sar']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      path: '/institute/dashboard'
    },
    {
      id: 'pre-qualifiers',
      label: 'Pre-Qualifiers',
      icon: <CheckSquare className="w-4 h-4" />,
      path: '/institute/pre-qualifiers'
    },
    {
      id: 'sar',
      label: 'SAR',
      icon: <FileText className="w-4 h-4" />,
      children: [
        {
          id: 'applications',
          label: 'Applications',
          icon: <FileText className="w-4 h-4" />,
          path: '/institute/sar-applications'
        },
        {
          id: 'templates',
          label: 'Templates',
          icon: <File className="w-4 h-4" />,
          path: '/institute/sar-templates'
        },
        {
          id: 'guidelines',
          label: 'Guidelines',
          icon: <BookOpen className="w-4 h-4" />,
          path: '/institute/sar-guidelines'
        }
      ]
    },
    {
      id: 'evaluation',
      label: 'Evaluation',
      icon: <ClipboardCheck className="w-4 h-4" />,
      path: '/institute/evaluation'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      path: '/institute/settings'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else if (item.path && onNavigate) {
      onNavigate(item.path);
    }
  };

  const isActive = (path?: string) => {
    if (!path || !currentPath) return false;
    return currentPath === path || currentPath.startsWith(path);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="w-full">
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start h-10 px-3",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            active && "bg-blue-100 text-blue-700 hover:bg-blue-200",
            isCollapsed && level === 0 && "px-2"
          )}
          onClick={() => handleItemClick(item)}
        >
          <div className="flex items-center gap-2 flex-1">
            {item.icon}
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {hasChildren && (
                  isExpanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </div>
        </Button>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Institute Portal</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            NBA Accreditation System
          </div>
        </div>
      )}
    </div>
  );
}