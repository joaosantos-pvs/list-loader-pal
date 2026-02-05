import { createContext, useContext, useState, ReactNode } from "react";

export interface HistoryEntry {
  id: string;
  nome: string;
  acesso: string;
  grupos: string[];
  dataLiberacao: Date;
  quemLiberou: string;
  isCSV?: boolean;
  csvFileName?: string;
}

interface HistoryContextType {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "dataLiberacao">) => void;
  addEntries: (entries: Omit<HistoryEntry, "id" | "dataLiberacao">[]) => void;
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

  return (
    <HistoryContext.Provider value={{ history, addEntry, addEntries }}>
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
