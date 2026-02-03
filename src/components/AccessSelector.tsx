import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accessOptions, AccessType } from "@/data/accessOptions";

interface AccessSelectorProps {
  value: AccessType | "";
  onChange: (value: AccessType) => void;
}

const AccessSelector = ({ value, onChange }: AccessSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">
        Escolha a função do colaborador
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as AccessType)}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="Selecione uma função" />
        </SelectTrigger>
        <SelectContent>
          {accessOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AccessSelector;
