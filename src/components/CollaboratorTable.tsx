import { User, CheckCircle, Trash2 } from "lucide-react";

interface Collaborator {
  nome: string;
  cpf: string;
  funcaoZendesk: string;
  status: "ativo" | "pendente" | "erro";
}

interface CollaboratorTableProps {
  collaborators: Collaborator[];
  onRemove: (index: number) => void;
}

const CollaboratorTable = ({ collaborators, onRemove }: CollaboratorTableProps) => {
  if (collaborators.length === 0) return null;

  return (
    <div className="mt-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground w-12"></th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">NOME</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">CPF</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">FUNÇÃO ZENDESK</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">STATUS</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground w-16"></th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator, index) => (
            <tr key={index} className="border-b border-border table-row-hover">
              <td className="py-3 px-4">
                <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-foreground">{collaborator.nome}</td>
              <td className="py-3 px-4 text-sm text-foreground">{collaborator.cpf}</td>
              <td className="py-3 px-4 text-sm text-foreground">{collaborator.funcaoZendesk}</td>
              <td className="py-3 px-4 text-center">
                <CheckCircle className="w-5 h-5 text-muted-foreground mx-auto" />
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onRemove(index)}
                  className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollaboratorTable;
