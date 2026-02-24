import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HistoryFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
}

const HistoryFilters = ({
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
}: HistoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] bg-card border-border">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="success">Sucesso</SelectItem>
          <SelectItem value="error">Erro</SelectItem>
          <SelectItem value="not_released">Não liberado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px] bg-card border-border">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="csv">Lote (CSV)</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-[180px] bg-card border-border"
        />
      </div>
    </div>
  );
};

export default HistoryFilters;
