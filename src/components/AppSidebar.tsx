import { KeyRound, History } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  {
    title: "Liberar Acesso ao Zendesk",
    url: "/",
    icon: KeyRound,
  },
  {
    title: "Histórico de Liberação",
    url: "/historico",
    icon: History,
  },
];

const AppSidebar = ({ open, onOpenChange }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="p-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
