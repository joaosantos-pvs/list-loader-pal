import { useState } from "react";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
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
import { AccessType, accessOptions } from "@/data/accessOptions";
import { Collaborator } from "@/data/collaborators";
import { useHistory } from "@/contexts/HistoryContext";

interface SelectedGroup {
  name: string;
  isDefault: boolean;
}

interface CSVFile {
  name: string;
  file: File;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [csvFile, setCsvFile] = useState<CSVFile | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "">("");
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { addEntries } = useHistory();

  const steps = [
    { number: 1, label: "SELECIONAR COLABORADOR", active: currentStep >= 1 },
    { number: 2, label: "SELECIONAR FUNÇÃO E GRUPOS", active: currentStep >= 2 },
    { number: 3, label: "RESUMO", active: currentStep >= 3 },
  ];

  const handleFileSelect = (file: File) => {
    setCsvFile({ name: file.name, file });
  };

  const handleAddCollaborator = (collaborator: Collaborator) => {
    setCollaborators((prev) => [...prev, collaborator]);
  };

  const handleRemoveCollaborator = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveCsv = () => {
    setCsvFile(null);
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
    
    // Adicionar ao histórico
    const accessLabel = accessOptions.find(a => a.value === selectedAccess)?.label || selectedAccess;
    const groupNames = selectedGroups.map(g => g.name);
    
    const entries = [];
    
    // Adicionar colaboradores individuais
    for (const collab of collaborators) {
      entries.push({
        nome: collab.nome,
        acesso: accessLabel,
        grupos: groupNames,
        quemLiberou: "Usuário Atual", // Seria o usuário logado
      });
    }
    
    // Adicionar arquivo CSV se existir
    if (csvFile) {
      entries.push({
        nome: csvFile.name,
        acesso: accessLabel,
        grupos: groupNames,
        quemLiberou: "Usuário Atual",
        isCSV: true,
        csvFileName: csvFile.name,
      });
    }
    
    if (entries.length > 0) {
      addEntries(entries);
    }
    
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
    setCsvFile(null);
    setSelectedAccess("");
    setSelectedGroups([]);
  };

  const handleMergeGroups = (groups: SelectedGroup[]) => {
    setSelectedGroups(groups);
  };

  const canProceedStep1 = collaborators.length > 0 || csvFile !== null;
  const canProceedStep2 = selectedAccess !== "" && selectedGroups.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
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
              csvFile={csvFile}
              onRemoveCsv={handleRemoveCsv}
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

                <MirrorUserSelector
                  selectedGroups={selectedGroups}
                  onMergeGroups={handleMergeGroups}
                />
              </>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <SummaryStep
            collaborators={collaborators}
            csvFile={csvFile}
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
