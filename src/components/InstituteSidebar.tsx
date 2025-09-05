import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Home,
  BookOpen,
  Award
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  submenu?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/institute/dashboard',
  },
  {
    title: 'Pre-Qualifiers',
    icon: ClipboardList,
    href: '/institute/pre-qualifiers',
  },
  {
    title: 'SAR',
    icon: FileText,
    href: '/institute/sar',
    submenu: [
      { title: 'Applications', href: '/institute/sar' },
      { title: 'Templates', href: '/institute/sar/templates' },
      { title: 'Guidelines', href: '/institute/sar/guidelines' },
    ]
  },
  {
    title: 'Evaluation',
    icon: Award,
    href: '/institute/evaluation',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/institute/settings',
  },
];

export default function InstituteSidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['SAR']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.submenu) {
      return item.submenu.some((subItem) => isActive(subItem.href));
    }
    return isActive(item.href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Home className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Institute Portal</h2>
            <p className="text-sm text-gray-600">NBA Accreditation</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <div>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    isParentActive(item) && "bg-blue-50 text-blue-700"
                  )}
                  onClick={() => toggleExpanded(item.title)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Button>
                {expandedItems.includes(item.title) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.href} to={subItem.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            isActive(subItem.href) && "bg-blue-100 text-blue-700"
                          )}
                        >
                          {subItem.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    isActive(item.href) && "bg-blue-50 text-blue-700"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}