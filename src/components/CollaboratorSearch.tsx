import { useState, useRef, useEffect } from "react";
import { Upload, Search, Plus, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { availableCollaborators, Collaborator } from "@/data/collaborators";

interface CSVFile {
  name: string;
  file: File;
}

interface CollaboratorSearchProps {
  selectedCollaborators: Collaborator[];
  onAddCollaborator: (collaborator: Collaborator) => void;
  onFileSelect: (file: File) => void;
  csvFile: CSVFile | null;
  onRemoveCsv: () => void;
}

const CollaboratorSearch = ({ 
  selectedCollaborators, 
  onAddCollaborator, 
  onFileSelect,
  csvFile,
  onRemoveCsv,
}: CollaboratorSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      onFileSelect(file);
    }
    event.target.value = "";
  };

  const filteredCollaborators = availableCollaborators.filter((c) => {
    const isAlreadySelected = selectedCollaborators.some(
      (selected) => selected.cpf === c.cpf
    );
    if (isAlreadySelected) return false;
    
    if (!searchValue.trim()) return false;
    
    return (
      c.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.cpf.includes(searchValue)
    );
  });

  const handleAddCollaborator = (collaborator: Collaborator) => {
    onAddCollaborator(collaborator);
    setSearchValue("");
    setShowDropdown(false);
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
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou CPF"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          {showDropdown && filteredCollaborators.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCollaborators.map((collaborator, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => handleAddCollaborator(collaborator)}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{collaborator.nome}</p>
                    <p className="text-xs text-muted-foreground">{collaborator.cpf}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {showDropdown && searchValue && filteredCollaborators.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum colaborador encontrado
              </p>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleButtonClick}
          variant="outline"
          className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Upload className="w-4 h-4" />
          Importar CSV
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {csvFile && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-border">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {csvFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Arquivo CSV selecionado
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemoveCsv}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollaboratorSearch;
