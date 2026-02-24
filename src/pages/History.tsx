import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useHistory, HistoryEntry, ProcessingStatus } from "@/contexts/HistoryContext";
import {
  FileText,
  CheckCircle,
  XCircle,
  Ban,
  RefreshCw,
  Download,
  Info,
  ChevronDown,
  ChevronRight,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import HistoryFilters from "@/components/HistoryFilters";
import CSVDetailModal from "@/components/CSVDetailModal";

const History = () => {
  const { history, updateEntryStatus } = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [csvModalEntry, setCsvModalEntry] = useState<HistoryEntry | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filterEntries = (entries: HistoryEntry[]) => {
    return entries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (typeFilter === "individual" && e.isCSV) return false;
      if (typeFilter === "csv" && !e.isCSV) return false;
      if (dateFilter) {
        try {
          const filterDate = parseISO(dateFilter);
          if (!isSameDay(e.dataLiberacao, filterDate)) return false;
        } catch { return true; }
      }
      return true;
    });
  };

  const processedEntries = filterEntries(
    history.filter((e) => e.status === "success" || e.status === "not_released")
  );
  const pendingEntries = filterEntries(
    history.filter((e) => e.status === "error")
  );

  const handleReprocess = (id: string) => {
    updateEntryStatus(id, "success");
  };

  const handleDownloadResult = (entry: HistoryEntry) => {
    const details = entry.csvDetails || [];
    const lines = ["Nome,Status,Motivo"];
    details.forEach((d) => lines.push(`${d.nome},${d.status},${d.motivo || ""}`));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultado_${entry.csvFileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadOriginal = (entry: HistoryEntry) => {
    if (entry.originalFile) {
      const url = URL.createObjectURL(entry.originalFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = entry.csvFileName || "arquivo.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const sortedGroups = (grupos: { name: string; isDefault: boolean }[]) => {
    return [...grupos].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  };

  const renderGroupsCell = (entry: HistoryEntry) => {
    const sorted = sortedGroups(entry.grupos);
    if (sorted.length === 0) return <span className="text-muted-foreground">-</span>;

    const first = sorted[0];
    const displayName = first.isDefault ? `${first.name} (Padrão)` : first.name;
    const remaining = sorted.length - 1;

    return (
      <div className="flex items-center gap-1">
        <span className="truncate max-w-[200px] text-foreground">{displayName}</span>
        {remaining > 0 && (
          <button
            onClick={() => toggleRow(entry.id)}
            className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium hover:bg-primary/20 transition-colors"
          >
            +{remaining}
          </button>
        )}
      </div>
    );
  };

  const renderExpandedGroups = (entry: HistoryEntry) => {
    if (!expandedRows.has(entry.id)) return null;
    const sorted = sortedGroups(entry.grupos);
    return (
      <TableRow className="border-border bg-muted/30">
        <TableCell colSpan={6} className="py-3">
          <div className="pl-8 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2">TODOS OS GRUPOS:</p>
            {sorted.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                {g.name}
                {g.isDefault && (
                  <span className="text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-medium">
                    Padrão
                  </span>
                )}
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderCSVSummary = (entry: HistoryEntry) => {
    if (!entry.isCSV) return null;
    return (
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{entry.totalRecords ?? 0} enviados</span>
        <span className="text-success">{entry.successCount ?? 0} ✓</span>
        <span className="text-destructive">{entry.errorCount ?? 0} ✗</span>
      </div>
    );
  };

  const renderStatus = (entry: HistoryEntry) => {
    if (entry.isCSV) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCsvModalEntry(entry)}
              >
                <Info className="w-4 h-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detalhes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleReprocess(entry.id)}
              >
                <RefreshCw className="w-4 h-4 text-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reprocessar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDownloadResult(entry)}
              >
                <Download className="w-4 h-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download Resultado</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDownloadOriginal(entry)}
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download CSV Entrada</TooltipContent>
          </Tooltip>
        </div>
      );
    }

    const statusConfig: Record<ProcessingStatus, { icon: React.ReactNode; label: string }> = {
      success: {
        icon: <CheckCircle className="w-5 h-5 text-success" />,
        label: "Sucesso",
      },
      error: {
        icon: (
          <button
            onClick={() => handleReprocess(entry.id)}
            className="flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            <RefreshCw className="w-3 h-3" />
          </button>
        ),
        label: "Erro - Clique para reprocessar",
      },
      not_released: {
        icon: <Ban className="w-5 h-5 text-muted-foreground" />,
        label: "Não liberado (já tinha acesso)",
      },
    };

    const config = statusConfig[entry.status];

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center cursor-default">
            {config.icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>{config.label}</TooltipContent>
      </Tooltip>
    );
  };

  const renderTable = (entries: HistoryEntry[]) => {
    if (entries.length === 0) {
      return (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum registro encontrado</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">NOME</TableHead>
            <TableHead className="text-muted-foreground font-semibold">ACESSO</TableHead>
            <TableHead className="text-muted-foreground font-semibold">GRUPOS</TableHead>
            <TableHead className="text-muted-foreground font-semibold">DATA DE LIBERAÇÃO</TableHead>
            <TableHead className="text-muted-foreground font-semibold">QUEM LIBEROU</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-center">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <>
              <TableRow key={entry.id} className="border-border">
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    {entry.isCSV && <FileText className="w-4 h-4 text-primary" />}
                    <div>
                      <span className="text-foreground font-medium">{entry.nome}</span>
                      {renderCSVSummary(entry)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{entry.acesso}</TableCell>
                <TableCell>{renderGroupsCell(entry)}</TableCell>
                <TableCell className="text-foreground">
                  {format(entry.dataLiberacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-foreground">{entry.quemLiberou}</TableCell>
                <TableCell>{renderStatus(entry)}</TableCell>
              </TableRow>
              {renderExpandedGroups(entry)}
            </>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Histórico de Liberação</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize todos os acessos liberados ao Zendesk
          </p>
        </div>

        <HistoryFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />

        <div className="mt-4 bg-card rounded-lg border border-border">
          <Tabs defaultValue="processed">
            <div className="border-b border-border px-4">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="processed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Processados ({processedEntries.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Enviados ao processamento ({pendingEntries.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="processed" className="mt-0">
              {renderTable(processedEntries)}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {renderTable(pendingEntries)}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CSVDetailModal
        entry={csvModalEntry}
        open={!!csvModalEntry}
        onOpenChange={(open) => !open && setCsvModalEntry(null)}
      />
    </div>
  );
};

export default History;
