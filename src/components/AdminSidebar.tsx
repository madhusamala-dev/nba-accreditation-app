import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LayoutDashboard, Home, Users, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  className?: string;
}

export default function AdminSidebar({ className = '' }: SidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(['dashboard']);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      icon: Home,
      path: '/admin/dashboard',
      hasSubItems: false
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      hasSubItems: false
    },
    {
      id: 'institutions',
      title: 'Institutions',
      icon: Users,
      hasSubItems: true,
      subItems: [
        { title: 'View All', path: '/admin/institutions', icon: Users },
        { title: 'Onboard New', path: '/admin/onboard-institution', icon: Users }
      ]
    },
    {
      id: 'applications',
      title: 'Applications',
      icon: FileText,
      hasSubItems: true,
      subItems: [
        { title: 'Pre-Qualifiers', path: '/admin/applications/pre-qualifiers', icon: FileText },
        { title: 'SAR Applications', path: '/admin/applications/sar', icon: FileText }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      hasSubItems: true,
      subItems: [
        { title: 'System Config', path: '/admin/settings/system', icon: Settings },
        { title: 'User Management', path: '/admin/settings/users', icon: Users }
      ]
    }
  ];

  return (
    <div className={`w-64 bg-white border-r border-gray-200 h-full ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openSections.includes(item.id);
            
            if (!item.hasSubItems) {
              return (
                <Button
                  key={item.id}
                  variant={isActive(item.path!) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate(item.path!)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.title}
                </Button>
              );
            }

            return (
              <Collapsible key={item.id} open={isOpen} onOpenChange={() => toggleSection(item.id)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {item.title}
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                  {item.subItems?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    return (
                      <Button
                        key={subItem.path}
                        variant={isActive(subItem.path) ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => navigate(subItem.path)}
                      >
                        <SubIcon className="w-3 h-3 mr-2" />
                        {subItem.title}
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </div>
    </div>
  );
}