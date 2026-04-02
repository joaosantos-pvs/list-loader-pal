import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export type ProcessingStatus = "success" | "error" | "already_has_access" | "not_found" | "pending";

export interface CSVDetailEntry {
  nome: string;
  status: ProcessingStatus;
  motivo?: string;
}

export interface HistoryEntry {
  id: string;
  nome: string;
  cpf?: string;
  acesso: string;
  grupos: { name: string; isDefault: boolean }[];
  dataLiberacao: Date;
  quemLiberou: string;
  status: ProcessingStatus;
  isCSV?: boolean;
  csvFileName?: string;
  originalFile?: File;
  totalRecords?: number;
  successCount?: number;
  errorCount?: number;
  alreadyHasAccessCount?: number;
  notFoundCount?: number;
  csvDetails?: CSVDetailEntry[];
}

interface HistoryContextType {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "dataLiberacao">) => void;
  addEntries: (entries: Omit<HistoryEntry, "id" | "dataLiberacao">[]) => void;
  updateEntryStatus: (id: string, status: ProcessingStatus) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const sampleGroups = [
      { name: "Grupo Vendas", isDefault: true },
      { name: "Grupo Marketing", isDefault: false },
      { name: "Grupo Financeiro", isDefault: false },
    ];

    return [
      // Individual - pending
      {
        id: "ind-pending-1",
        nome: "Lucas Ferreira",
        cpf: "321.654.987-00",
        acesso: "Agente light",
        grupos: [{ name: "APS - RJ - 001 - Enfermagem", isDefault: true }],
        dataLiberacao: now,
        quemLiberou: "Ana Paula Silva",
        status: "pending" as ProcessingStatus,
        isCSV: false,
      },
      // Individual - processed
      {
        id: "ind-success-1",
        nome: "Maria Oliveira",
        cpf: "123.456.789-00",
        acesso: "Agente Full - Visualiza Relatório",
        grupos: sampleGroups,
        dataLiberacao: oneHourAgo,
        quemLiberou: "Carlos Eduardo",
        status: "success" as ProcessingStatus,
        isCSV: false,
      },
      {
        id: "ind-error-1",
        nome: "João Santos",
        cpf: "987.654.321-00",
        acesso: "Agente Full - Criar Relatório",
        grupos: [{ name: "APS - RJ - 002 - Médicos", isDefault: true }],
        dataLiberacao: twoHoursAgo,
        quemLiberou: "Ana Paula Silva",
        status: "error" as ProcessingStatus,
        isCSV: false,
      },
      {
        id: "ind-notrel-1",
        nome: "Fernanda Costa",
        cpf: "456.789.123-00",
        acesso: "Agente Full - Sem Relatório",
        grupos: [{ name: "APS - SP - Enfermagem", isDefault: true }],
        dataLiberacao: threeHoursAgo,
        quemLiberou: "Carlos Eduardo",
        status: "not_released" as ProcessingStatus,
        isCSV: false,
      },
      // CSV - pending
      {
        id: "csv-pending-1",
        nome: "colaboradores_novos.csv",
        acesso: "Agente light",
        grupos: [{ name: "APS - RJ - 001 - Enfermagem", isDefault: true }, { name: "APS - RJ - 001 - Médicos", isDefault: false }],
        dataLiberacao: now,
        quemLiberou: "Ana Paula Silva",
        status: "pending" as ProcessingStatus,
        isCSV: true,
        csvFileName: "colaboradores_novos.csv",
        totalRecords: 4,
        csvDetails: [
          { nome: "Ricardo Almeida", status: "pending" as ProcessingStatus },
          { nome: "Patrícia Lima", status: "pending" as ProcessingStatus },
          { nome: "Bruno Mendes", status: "pending" as ProcessingStatus },
          { nome: "Camila Rocha", status: "pending" as ProcessingStatus },
        ],
      },
      // CSV - processed
      {
        id: "csv-success-1",
        nome: "equipe_vendas.csv",
        acesso: "Agente Full - Visualiza Relatório",
        grupos: sampleGroups,
        dataLiberacao: oneHourAgo,
        quemLiberou: "Carlos Eduardo",
        status: "success" as ProcessingStatus,
        isCSV: true,
        csvFileName: "equipe_vendas.csv",
        totalRecords: 3,
        successCount: 3,
        errorCount: 0,
        notReleasedCount: 0,
        csvDetails: [
          { nome: "Thiago Martins", status: "success" as ProcessingStatus },
          { nome: "Juliana Pereira", status: "success" as ProcessingStatus },
          { nome: "Rafael Souza", status: "success" as ProcessingStatus },
        ],
      },
      {
        id: "csv-error-1",
        nome: "novos_acessos_marco.csv",
        acesso: "Agente Full - Criar Relatório",
        grupos: [{ name: "APS - RJ - 002 - Médicos", isDefault: true }],
        dataLiberacao: twoHoursAgo,
        quemLiberou: "Ana Paula Silva",
        status: "error" as ProcessingStatus,
        isCSV: true,
        csvFileName: "novos_acessos_marco.csv",
        totalRecords: 5,
        successCount: 3,
        errorCount: 1,
        notReleasedCount: 1,
        csvDetails: [
          { nome: "Diego Nascimento", status: "success" as ProcessingStatus },
          { nome: "Amanda Ribeiro", status: "success" as ProcessingStatus },
          { nome: "Felipe Cardoso", status: "success" as ProcessingStatus },
          { nome: "Larissa Monteiro", status: "error" as ProcessingStatus, motivo: "Erro ao conectar com o servidor" },
          { nome: "Gustavo Teixeira", status: "not_released" as ProcessingStatus, motivo: "Já possui acesso" },
        ],
      },
      {
        id: "csv-notrel-1",
        nome: "lista_marketing.csv",
        acesso: "Agente light",
        grupos: [{ name: "APS - SP - Enfermagem", isDefault: true }],
        dataLiberacao: threeHoursAgo,
        quemLiberou: "Carlos Eduardo",
        status: "success" as ProcessingStatus,
        isCSV: true,
        csvFileName: "lista_marketing.csv",
        totalRecords: 2,
        successCount: 1,
        errorCount: 0,
        notReleasedCount: 1,
        csvDetails: [
          { nome: "Vinícius Barros", status: "success" as ProcessingStatus },
          { nome: "Isabela Campos", status: "not_released" as ProcessingStatus, motivo: "Já possui acesso" },
        ],
      },
    ];
  });
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const scheduleProcessing = useCallback((entryId: string) => {
    // Simulate processing after 5 seconds
    const timer = setTimeout(() => {
      setHistory((prev) =>
        prev.map((entry) => {
          if (entry.id !== entryId || entry.status !== "pending") return entry;

          if (entry.isCSV && entry.csvDetails) {
            // Process CSV details
            const processedDetails = entry.csvDetails.map((d) => {
              if (d.status !== "pending") return d;
              // Simulate: invalid names get error, some get not_released
              if (d.nome.toLowerCase() === "nome" || d.nome.trim() === "") {
                return { ...d, status: "error" as const, motivo: "Nome inválido" };
              }
              // Random chance of not_released for demo
              if (Math.random() < 0.15) {
                return { ...d, status: "not_released" as const, motivo: "Já possui acesso" };
              }
              return { ...d, status: "success" as const };
            });

            const successCount = processedDetails.filter((d) => d.status === "success").length;
            const errorCount = processedDetails.filter((d) => d.status === "error").length;
            const notReleasedCount = processedDetails.filter((d) => d.status === "not_released").length;

            // Only error if ZERO succeeded (all were errors/not_released)
            const batchStatus = successCount > 0 ? "success" as const : "error" as const;

            return {
              ...entry,
              status: batchStatus,
              csvDetails: processedDetails,
              successCount,
              errorCount,
              notReleasedCount,
            };
          } else {
            // Individual entry - simulate random result
            const outcomes = ["success", "error", "not_released"] as const;
            const result = outcomes[Math.floor(Math.random() * outcomes.length)];
            return { ...entry, status: result };
          }
        })
      );
      timerRefs.current.delete(entryId);
    }, 5000);

    timerRefs.current.set(entryId, timer);
  }, []);

  const addEntry = (entry: Omit<HistoryEntry, "id" | "dataLiberacao">) => {
    const id = crypto.randomUUID();
    const newEntry: HistoryEntry = {
      ...entry,
      id,
      dataLiberacao: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev]);
    if (entry.status === "pending") {
      scheduleProcessing(id);
    }
  };

  const addEntries = (entries: Omit<HistoryEntry, "id" | "dataLiberacao">[]) => {
    const newEntries: HistoryEntry[] = entries.map((entry) => ({
      ...entry,
      id: crypto.randomUUID(),
      dataLiberacao: new Date(),
    }));
    setHistory((prev) => [...newEntries, ...prev]);
    newEntries.forEach((e) => {
      if (e.status === "pending") {
        scheduleProcessing(e.id);
      }
    });
  };

  const updateEntryStatus = (id: string, status: ProcessingStatus) => {
    setHistory((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status } : entry
      )
    );
  };

  return (
    <HistoryContext.Provider value={{ history, addEntry, addEntries, updateEntryStatus }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
