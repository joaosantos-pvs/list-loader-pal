import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Ban } from "lucide-react";
import { HistoryEntry, CSVDetailEntry } from "@/contexts/HistoryContext";

interface CSVDetailModalProps {
  entry: HistoryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusIcon = (status: CSVDetailEntry["status"]) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "error":
      return <XCircle className="w-4 h-4 text-destructive" />;
    case "not_released":
      return <Ban className="w-4 h-4 text-muted-foreground" />;
  }
};

const statusLabel = (status: CSVDetailEntry["status"]) => {
  switch (status) {
    case "success":
      return "Sucesso";
    case "error":
      return "Erro";
    case "not_released":
      return "Não liberado";
  }
};

const CSVDetailModal = ({ entry, open, onOpenChange }: CSVDetailModalProps) => {
  if (!entry) return null;

  const details = entry.csvDetails || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes do Processamento</DialogTitle>
          <DialogDescription>
            Arquivo: {entry.csvFileName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 my-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{entry.totalRecords ?? 0}</p>
            <p className="text-xs text-muted-foreground">Enviados</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-success">{entry.successCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">Sucesso</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{entry.errorCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">Erros</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{entry.notReleasedCount ?? 0}</p>
            <p className="text-xs text-muted-foreground">Não liberados</p>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">NOME</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">STATUS</TableHead>
                <TableHead className="text-muted-foreground font-semibold">MOTIVO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell className="text-foreground">{detail.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {statusIcon(detail.status)}
                      <span className="text-xs">{statusLabel(detail.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {detail.motivo || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVDetailModal;
