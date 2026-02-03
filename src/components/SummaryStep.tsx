import { User, MinusCircle } from "lucide-react";
import { accessOptions, AccessType } from "@/data/accessOptions";

interface Collaborator {
  nome: string;
  cpf: string;
  funcaoZendesk: string;
  status: "ativo" | "pendente" | "erro";
}

interface SelectedGroup {
  name: string;
  isDefault: boolean;
}

interface SummaryStepProps {
  collaborators: Collaborator[];
  selectedAccess: AccessType;
  selectedGroups: SelectedGroup[];
}

const SummaryStep = ({ collaborators, selectedAccess, selectedGroups }: SummaryStepProps) => {
  const accessLabel = accessOptions.find(a => a.value === selectedAccess)?.label || selectedAccess;
  
  const groupsDisplay = selectedGroups
    .map(g => g.isDefault ? `${g.name} (Grupo Padrão)` : g.name)
    .join(", ");

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="space-y-4 mb-6">
        <div>
          <span className="text-sm font-semibold text-foreground">Função Selecionada: </span>
          <span className="text-sm text-muted-foreground">{accessLabel}</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground">Grupos Selecionados: </span>
          <span className="text-sm text-muted-foreground">{groupsDisplay}</span>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground w-12"></th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">NOME</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">CPF</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator, index) => (
            <tr key={index} className="border-b border-border">
              <td className="py-3 px-4">
                <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-foreground">{collaborator.nome}</td>
              <td className="py-3 px-4 text-sm text-foreground">{collaborator.cpf}</td>
              <td className="py-3 px-4 text-center">
                <MinusCircle className="w-5 h-5 text-muted-foreground mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryStep;
