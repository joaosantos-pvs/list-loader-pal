import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, X } from "lucide-react";
import { mirrorUsers, MirrorUser } from "@/data/mirrorUsers";

interface SelectedGroup {
  name: string;
  isDefault: boolean;
}

interface MirrorUserSelectorProps {
  selectedMirrorUser: MirrorUser | null;
  onMirrorUserSelect: (user: MirrorUser | null) => void;
  onApplyGroups: (groups: SelectedGroup[]) => void;
}

const MirrorUserSelector = ({
  selectedMirrorUser,
  onMirrorUserSelect,
  onApplyGroups,
}: MirrorUserSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchValue.trim()) return [];
    return mirrorUsers
      .filter(
        (u) =>
          u.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
          u.cpf.includes(searchValue)
      )
      .slice(0, 10);
  }, [searchValue]);

  const handleSelectUser = (user: MirrorUser) => {
    onMirrorUserSelect(user);
    
    // Aplica os grupos do usuário espelho
    const groupsToApply: SelectedGroup[] = user.grupos.map((g, index) => ({
      name: g,
      isDefault: index === 0,
    }));
    onApplyGroups(groupsToApply);
    
    setSearchValue("");
    setShowDropdown(false);
  };

  const handleRemoveMirrorUser = () => {
    onMirrorUserSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Usuário Espelho (opcional)
      </label>
      
      {selectedMirrorUser ? (
        <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-border">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedMirrorUser.nome}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedMirrorUser.grupos.length} grupos aplicados
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveMirrorUser}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário espelho por nome ou CPF"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {showDropdown && filteredUsers.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.cpf}
                  onClick={() => handleSelectUser(user)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.cpf}
                      </p>
                    </div>
                    <span className="text-xs text-primary">
                      {user.grupos.length} grupos
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchValue && filteredUsers.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum usuário encontrado
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Selecione um usuário que já possui acesso para copiar seus grupos automaticamente.
      </p>
    </div>
  );
};

export default MirrorUserSelector;
