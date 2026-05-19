import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { ArrowRight, ArrowLeft, Home, MessageSquare } from "lucide-react";
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
  parsedNames: string[];
}

const parseCSVFile = (file: File): Promise<string[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        resolve([]);
        return;
      }
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
      resolve(lines);
    };
    reader.onerror = () => resolve([]);
    reader.readAsText(file);
  });
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [csvFile, setCsvFile] = useState<CSVFile | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<AccessType | "">("");
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);
  const [chatModule, setChatModule] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { addEntries } = useHistory();

  const steps = [
    { number: 1, label: "SELECIONAR COLABORADOR", active: currentStep >= 1 },
    { number: 2, label: "SELECIONAR FUNÇÃO E GRUPOS", active: currentStep >= 2 },
    { number: 3, label: "RESUMO", active: currentStep >= 3 },
  ];

  const handleFileSelect = async (file: File) => {
    const parsedNames = await parseCSVFile(file);
    setCsvFile({ name: file.name, file, parsedNames });
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

    const accessLabel = accessOptions.find((a) => a.value === selectedAccess)?.label || selectedAccess;

    const entries = [];

    // Individual collaborators - all go as pending
    for (const collab of collaborators) {
      entries.push({
        nome: collab.nome,
        cpf: collab.cpf,
        acesso: accessLabel,
        grupos: selectedGroups,
        quemLiberou: "Usuário Atual",
        status: "pending" as const,
        chatModule: selectedAccess === "agente_full_sem" ? chatModule : undefined,
      });
    }

    // CSV file - goes as pending, use actual file content
    if (csvFile) {
      const csvDetails = csvFile.parsedNames.map((nome) => ({
        nome,
        status: "pending" as const,
      }));

      entries.push({
        nome: csvFile.name,
        acesso: accessLabel,
        grupos: selectedGroups,
        quemLiberou: "Usuário Atual",
        status: "pending" as const,
        isCSV: true,
        csvFileName: csvFile.name,
        originalFile: csvFile.file,
        totalRecords: csvFile.parsedNames.length,
        successCount: 0,
        errorCount: 0,
        notReleasedCount: 0,
        csvDetails,
        chatModule: selectedAccess === "agente_full_sem" ? chatModule : undefined,
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
    setChatModule(false);
  };

  const handleMergeGroups = (groups: SelectedGroup[]) => {
    setSelectedGroups(groups);
  };

  const canProceedStep1 = collaborators.length > 0 || csvFile !== null;
  const canProceedStep2 = selectedAccess !== "" && selectedGroups.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Liberar Acesso ao Zendesk — PortalWeb</title>
        <meta name="description" content="Selecione colaboradores, defina função e grupos e libere acessos ao Zendesk de forma rápida, individual ou em lote via CSV." />
        <link rel="canonical" href="https://list-loader-pal.lovable.app/" />
        <meta property="og:title" content="Liberar Acesso ao Zendesk — PortalWeb" />
        <meta property="og:description" content="Fluxo guiado em 3 passos para liberar acessos ao Zendesk com segurança e rastreabilidade." />
        <meta property="og:url" content="https://list-loader-pal.lovable.app/" />
      </Helmet>
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

                {selectedAccess === "agente_full_sem" && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Módulo de Chat</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Libere automaticamente o módulo de chat no Zendesk para colaboradores que vão atender tickets de WhatsApp, evitando a liberação manual.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={chatModule ? "default" : "outline"}
                        onClick={() => setChatModule((v) => !v)}
                        className={chatModule ? "" : "border-border"}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {chatModule ? "Módulo de Chat selecionado" : "Módulo de Chat"}
                      </Button>
                    </div>
                  </div>
                )}
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
            chatModule={chatModule}
          />
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Usuários cujo status esteja como{" "}
          <span className="text-amber-700 dark:text-amber-400 font-medium">'em processamento'</span> ou{" "}
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
