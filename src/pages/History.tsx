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
import { useHistory } from "@/contexts/HistoryContext";
import { FileText } from "lucide-react";

const History = () => {
  const { history } = useHistory();

  const formatGroups = (grupos: string[]) => {
    if (grupos.length === 0) return "-";
    if (grupos.length === 1) return grupos[0];
    
    return (
      <div className="flex items-center gap-1">
        <span className="truncate max-w-[200px]">{grupos[0]}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium hover:bg-primary/20 transition-colors">
              +{grupos.length - 1}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              {grupos.slice(1).map((g, i) => (
                <p key={i} className="text-xs">{g}</p>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
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
