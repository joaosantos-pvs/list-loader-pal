import { useState } from "react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import CollaboratorSearch from "@/components/CollaboratorSearch";
import CollaboratorTable from "@/components/CollaboratorTable";
import AccessSelector from "@/components/AccessSelector";
import GroupSelector from "@/components/GroupSelector";
import MirrorUserSelector from "@/components/MirrorUserSelector";
import ConfirmationModal from "@/components/ConfirmationModal";
import SummaryStep from "@/components/SummaryStep";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { AccessType } from "@/data/accessOptions";
import { Collaborator } from "@/data/collaborators";
import { MirrorUser } from "@/data/mirrorUsers";

interface SelectedGroup {
  name: string;
  isDefault: boolean;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "">("");
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);
  const [selectedMirrorUser, setSelectedMirrorUser] = useState<MirrorUser | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const steps = [
    { number: 1, label: "SELECIONAR COLABORADOR", active: currentStep >= 1 },
    { number: 2, label: "SELECIONAR FUNÇÃO E GRUPOS", active: currentStep >= 2 },
    { number: 3, label: "RESUMO", active: currentStep >= 3 },
  ];

  const parseCSV = (content: string): Collaborator[] => {
    const lines = content.split("\n").filter((line) => line.trim());
    const result: Collaborator[] = [];

    const startIndex = lines[0]?.toLowerCase().includes("nome") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const values = lines[i].split(/[,;]/).map((v) => v.trim().replace(/"/g, ""));
      
      if (values.length >= 1 && values[0]) {
        result.push({
          nome: values[0] || "",
          cpf: values[1] || "",
          funcaoZendesk: values[2] || "Usuário Final",
          status: "ativo",
        });
      }
    }

    return result;
  };

  const handleFileSelect = async (file: File) => {
    try {
      const content = await file.text();
      const parsed = parseCSV(content);
      setCollaborators((prev) => [...prev, ...parsed]);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
    }
  };

  const handleAddCollaborator = (collaborator: Collaborator) => {
    setCollaborators((prev) => [...prev, collaborator]);
  };

  const handleRemoveCollaborator = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setShowConfirmModal(true);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToStart = () => {
    setCurrentStep(1);
    setCollaborators([]);
    setSelectedAccess("");
    setSelectedGroups([]);
    setSelectedMirrorUser(null);
  };

  const handleMirrorUserSelect = (user: MirrorUser | null) => {
    setSelectedMirrorUser(user);
  };

  const handleApplyMirrorGroups = (groups: SelectedGroup[]) => {
    setSelectedGroups(groups);
  };

  const canProceedStep1 = collaborators.length > 0;
  const canProceedStep2 = selectedAccess !== "" && selectedGroups.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="border-b border-border bg-card">
        <StepIndicator steps={steps} />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <CollaboratorSearch
              selectedCollaborators={collaborators}
              onAddCollaborator={handleAddCollaborator}
              onFileSelect={handleFileSelect}
            />

            <p className="text-xs text-primary mt-3">
              A busca retorna apenas usuários ativos do PortalWeb. Se nenhum resultado for encontrado,{" "}
              <a href="#" className="underline hover:text-primary/80">
                verifique se o usuário está ativo
              </a>
              .
            </p>

            <CollaboratorTable
              collaborators={collaborators}
              onRemove={handleRemoveCollaborator}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <AccessSelector
              value={selectedAccess}
              onChange={setSelectedAccess}
            />

            {selectedAccess && (
              <>
                <GroupSelector
                  selectedGroups={selectedGroups}
                  onGroupsChange={setSelectedGroups}
                />

                <div className="border-t border-border pt-6">
                  <MirrorUserSelector
                    selectedMirrorUser={selectedMirrorUser}
                    onMirrorUserSelect={handleMirrorUserSelect}
                    onApplyGroups={handleApplyMirrorGroups}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <SummaryStep
            collaborators={collaborators}
            selectedAccess={selectedAccess as AccessType}
            selectedGroups={selectedGroups}
          />
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Usuários cujo status esteja como{" "}
          <span className="text-amber-500 font-medium">'em processamento'</span> ou{" "}
          <span className="text-destructive font-medium">'erro'</span>, ou que não tenham a
          função de 'Usuário Final', não serão processados.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          {currentStep > 1 && currentStep < 3 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              VOLTAR
            </Button>
          )}
          
          {currentStep < 3 && (
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 ? !canProceedStep1 : !canProceedStep2}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              PRÓXIMO
            </Button>
          )}

          {currentStep === 3 && (
            <Button 
              variant="outline"
              onClick={handleBackToStart}
              className="border-border"
            >
              <Home className="w-4 h-4 mr-2" />
              VOLTAR PARA O INÍCIO
            </Button>
          )}
        </div>
      </main>

      <ConfirmationModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Index;
