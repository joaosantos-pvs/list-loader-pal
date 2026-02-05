import { useState } from "react";
import { format } from "date-fns";
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
import { useHistory, ProcessingStatus } from "@/contexts/HistoryContext";
import { FileText, CheckCircle, XCircle, Ban, RefreshCw, Download } from "lucide-react";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const History = () => {
  const { history, updateEntryStatus } = useHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formatGroups = (grupos: { name: string; isDefault: boolean }[]) => {
    if (grupos.length === 0) return "-";
    
    // Sort to show default group first
    const sortedGroups = [...grupos].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
    
    const firstGroup = sortedGroups[0];
    const displayName = firstGroup.isDefault 
      ? `${firstGroup.name} (Padrão)` 
      : firstGroup.name;
    
    if (sortedGroups.length === 1) return displayName;
    
    return (
      <div className="flex items-center gap-1">
        <span className="truncate max-w-[200px]">{displayName}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium hover:bg-primary/20 transition-colors">
              +{sortedGroups.length - 1}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              {sortedGroups.slice(1).map((g, i) => (
                <p key={i} className="text-xs">
                  {g.name}{g.isDefault ? " (Padrão)" : ""}
                </p>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const handleReprocess = (id: string) => {
    // Simulate reprocessing - in real app would call API
    updateEntryStatus(id, "success");
  };

  const handleDownloadResult = (entry: typeof history[0]) => {
    // Generate result CSV
    const content = `Nome,Status\n${entry.nome},Processado`;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultado_${entry.csvFileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadOriginal = (entry: typeof history[0]) => {
    if (entry.originalFile) {
      const url = URL.createObjectURL(entry.originalFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = entry.csvFileName || "arquivo.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderStatus = (entry: typeof history[0]) => {
    if (entry.isCSV) {
      return (
        <div className="flex items-center justify-center gap-1">
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
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
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

        <div className="bg-card rounded-lg border border-border">
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum acesso foi liberado ainda
              </p>
            </div>
          ) : (
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
                {history.map((entry) => (
                  <TableRow key={entry.id} className="border-border">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        {entry.isCSV && (
                          <FileText className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-foreground font-medium">
                          {entry.nome}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{entry.acesso}</TableCell>
                    <TableCell>{formatGroups(entry.grupos)}</TableCell>
                    <TableCell className="text-foreground">
                      {format(entry.dataLiberacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-foreground">{entry.quemLiberou}</TableCell>
                    <TableCell>{renderStatus(entry)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
