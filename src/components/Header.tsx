import { Menu, Grid3X3, Plus, Users, Settings } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="header-gradient text-primary-foreground">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg tracking-wide">PREVENT SENIOR</span>
          <div className="flex items-center gap-2 ml-4">
            <button className="p-1.5 hover:bg-white/10 rounded">
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <Users className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 bg-black/10">
        <h1 className="text-sm font-medium">Liberação de Acessos ao Zendesk</h1>
      </div>
    </header>
  );
};

export default Header;
