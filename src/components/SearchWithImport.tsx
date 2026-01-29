import { useRef } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchWithImportProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFileSelect: (file: File) => void;
}

const SearchWithImport = ({ searchValue, onSearchChange, onFileSelect }: SearchWithImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      onFileSelect(file);
    }
    // Reset input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };

  return (
    <div className="flex gap-3 items-center">
      <Input
        type="text"
        placeholder="Buscar por nome ou CPF"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-card border-border"
      />
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
  );
};

export default SearchWithImport;
