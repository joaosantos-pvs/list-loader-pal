import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export type ProcessingStatus = "success" | "error" | "not_released" | "pending";

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
  notReleasedCount?: number;
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
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

            return {
              ...entry,
              status: errorCount > 0 ? ("error" as const) : ("success" as const),
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
