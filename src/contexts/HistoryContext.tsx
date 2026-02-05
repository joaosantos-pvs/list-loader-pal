import { createContext, useContext, useState, ReactNode } from "react";

export type ProcessingStatus = "success" | "error" | "not_released";

export interface HistoryEntry {
  id: string;
  nome: string;
  acesso: string;
  grupos: { name: string; isDefault: boolean }[];
  dataLiberacao: Date;
  quemLiberou: string;
  status: ProcessingStatus;
  isCSV?: boolean;
  csvFileName?: string;
  originalFile?: File;
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

  const addEntry = (entry: Omit<HistoryEntry, "id" | "dataLiberacao">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      dataLiberacao: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const addEntries = (entries: Omit<HistoryEntry, "id" | "dataLiberacao">[]) => {
    const newEntries: HistoryEntry[] = entries.map((entry) => ({
      ...entry,
      id: crypto.randomUUID(),
      dataLiberacao: new Date(),
    }));
    setHistory((prev) => [...newEntries, ...prev]);
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
