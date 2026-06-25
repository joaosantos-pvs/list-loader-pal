import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Search, Eraser } from "lucide-react";
import { groups } from "@/data/accessOptions";

interface SelectedGroup {
  name: string;
  isDefault: boolean;
}

interface GroupSelectorProps {
  selectedGroups: SelectedGroup[];
  onGroupsChange: (groups: SelectedGroup[]) => void;
  onClearAll?: () => void;
}

const GroupSelector = ({ selectedGroups, onGroupsChange, onClearAll }: GroupSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredGroups = useMemo(() => {
    if (!searchValue.trim()) return [];
    return groups
      .filter(
        (g) =>
          g.toLowerCase().includes(searchValue.toLowerCase()) &&
          !selectedGroups.some((sg) => sg.name === g)
      )
      .slice(0, 25);
  }, [searchValue, selectedGroups]);

  const handleSelectGroup = (groupName: string) => {
    const isFirst = selectedGroups.length === 0;
    onGroupsChange([
      ...selectedGroups,
      { name: groupName, isDefault: isFirst },
    ]);
    // Keep dropdown open - don't close or clear search
  };

  const handleRemoveGroup = (groupName: string) => {
    const wasDefault = selectedGroups.find((g) => g.name === groupName)?.isDefault;
    let newGroups = selectedGroups.filter((g) => g.name !== groupName);
    
    if (wasDefault && newGroups.length > 0) {
      newGroups = newGroups.map((g, i) => ({ ...g, isDefault: i === 0 }));
    }
    
    onGroupsChange(newGroups);
  };

  const handleSetDefault = (groupName: string) => {
    onGroupsChange(
      selectedGroups.map((g) => ({
        ...g,
        isDefault: g.name === groupName,
      }))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupo por nome"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="pl-10 bg-card border-border"
          />
        </div>
        
        {showDropdown && filteredGroups.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredGroups.map((group) => (
              <button
                key={group}
                onClick={() => handleSelectGroup(group)}
                className="w-full px-4 py-2 text-left hover:bg-muted text-sm transition-colors"
              >
                {group}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-primary">
        A busca exibe apenas os 25 primeiros grupos em ordem alfabética. O dropdown permanece aberto para seleção múltipla.
      </p>

      {selectedGroups.length > 0 && (
        <>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onGroupsChange([]);
              onClearAll?.();
            }}
            className="h-8 text-xs"
          >
            <Eraser className="w-3.5 h-3.5 mr-1.5" />
            Limpar grupos
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                NOME DO GRUPO
              </TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">
                GRUPO PADRÃO
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedGroups.map((group) => (
              <TableRow key={group.name} className="border-border">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span className="text-foreground">{group.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleSetDefault(group.name)}
                    className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-colors ${
                      group.isDefault
                        ? "border-amber-500 bg-amber-500"
                        : "border-muted-foreground hover:border-amber-500"
                    }`}
                  >
                    {group.isDefault && (
                      <div className="w-2 h-2 rounded-full bg-card" />
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGroup(group.name)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </>
      )}
    </div>
  );
};

export default GroupSelector;
