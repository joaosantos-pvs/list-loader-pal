import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface HistoryFiltersProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  quemLiberouFilter: string;
  onQuemLiberouChange: (value: string) => void;
  quemLiberouOptions: string[];
}

const HistoryFilters = ({
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
  quemLiberouFilter,
  onQuemLiberouChange,
  quemLiberouOptions,
}: HistoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[200px] bg-card border-border">
          <SelectValue placeholder="Tipo de liberação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">Acesso Individual</SelectItem>
          <SelectItem value="csv">Acesso em Lote</SelectItem>
        </SelectContent>
      </Select>

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

      <Select value={quemLiberouFilter} onValueChange={onQuemLiberouChange}>
        <SelectTrigger className="w-[200px] bg-card border-border">
          <SelectValue placeholder="Quem liberou" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {quemLiberouOptions.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
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
