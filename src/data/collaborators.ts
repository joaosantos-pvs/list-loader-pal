export interface Collaborator {
  nome: string;
  cpf: string;
  funcaoZendesk: string;
  status: "ativo" | "pendente" | "erro";
}

export const availableCollaborators: Collaborator[] = [
  { nome: "Maria Silva Santos", cpf: "123.456.789-00", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "João Pedro Oliveira", cpf: "234.567.890-11", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Ana Carolina Souza", cpf: "345.678.901-22", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Carlos Eduardo Lima", cpf: "456.789.012-33", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Fernanda Costa Pereira", cpf: "567.890.123-44", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Ricardo Almeida Gomes", cpf: "678.901.234-55", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Juliana Ferreira Rocha", cpf: "789.012.345-66", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Bruno Henrique Martins", cpf: "890.123.456-77", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Patrícia Rodrigues Nunes", cpf: "901.234.567-88", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Lucas Gabriel Barbosa", cpf: "012.345.678-99", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Camila Ribeiro Castro", cpf: "111.222.333-44", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Thiago Mendes Cardoso", cpf: "222.333.444-55", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Larissa Araújo Dias", cpf: "333.444.555-66", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Rafael Correia Teixeira", cpf: "444.555.666-77", funcaoZendesk: "Usuário Final", status: "ativo" },
  { nome: "Amanda Pinto Carvalho", cpf: "555.666.777-88", funcaoZendesk: "Usuário Final", status: "ativo" },
];
