export interface MirrorUser {
  nome: string;
  cpf: string;
  grupos: string[];
}

export const mirrorUsers: MirrorUser[] = [
  {
    nome: "Piercarlo Ronaldo Vinci",
    cpf: "111.222.333-44",
    grupos: [
      "Agendamento de Exames Nucleos - SP",
      "Processos Específicos - Ressonância Magnética - SP",
      "Reabilitação - Supervisão",
      "Unidade Alto da Mooca Oftalmologia (Bixira) - Supervisão",
    ],
  },
  {
    nome: "Roberto Carlos Silva",
    cpf: "222.333.444-55",
    grupos: [
      "APS - RJ - 001 - Enfermagem",
      "APS - RJ - 001 - Médicos",
      "APS - RJ - 002 - Enfermagem",
    ],
  },
  {
    nome: "Juliana Matos Ferreira",
    cpf: "333.444.555-66",
    grupos: [
      "APS - SP - Administrativo",
      "APS - SP - Supervisão Administrativo",
    ],
  },
  {
    nome: "Carlos Alberto Mendes",
    cpf: "444.555.666-77",
    grupos: [
      "APS - RJ - 003 - Médicos",
      "APS - RJ - 004 - Médicos",
      "APS - RJ - 005 - Médicos",
    ],
  },
  {
    nome: "Fernanda Lima Costa",
    cpf: "555.666.777-88",
    grupos: [
      "APS - SP - Enfermagem",
      "APS - SP - Supervisão Enfermagem",
    ],
  },
  {
    nome: "Marcelo Souza Ribeiro",
    cpf: "666.777.888-99",
    grupos: [
      "APS - RJ - 010 - Tutor de Relacionamento",
      "APS - RJ - 011 - Tutor de Relacionamento",
      "APS - RJ - 012 - Tutor de Relacionamento",
    ],
  },
];
