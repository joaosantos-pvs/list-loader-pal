# Fluxo de Liberação de Acesso ao Zendesk

## Visão Geral

Este documento descreve o fluxo completo de liberação de acesso ao Zendesk, um processo guiado em três etapas que permite aos administradores conceder permissões a colaboradores de forma organizada e eficiente.

---

## Estrutura do Fluxo

O processo é dividido em **3 etapas sequenciais**:

| Etapa | Nome | Descrição |
|-------|------|-----------|
| 1 | Selecionar Colaborador | Busca e seleção dos colaboradores que receberão acesso |
| 2 | Selecionar Função e Grupos | Definição do nível de acesso e grupos associados |
| 3 | Resumo | Visualização final com status de processamento |

---

## Etapa 1: Selecionar Colaborador

### Objetivo
Permitir a seleção de um ou mais colaboradores que receberão acesso ao Zendesk.

### Funcionalidades

#### 1.1 Busca de Colaboradores
- **Campo de busca**: Permite pesquisar colaboradores por **nome** ou **CPF**
- **Fonte de dados**: Retorna apenas usuários ativos do PortalWeb
- **Comportamento**: 
  - Ao digitar, exibe uma lista dropdown com resultados filtrados
  - Colaboradores já selecionados não aparecem nos resultados
  - Ao clicar em um colaborador, ele é adicionado à lista de selecionados

#### 1.2 Importação via CSV
- **Botão "Importar CSV"**: Permite upload de arquivo .csv
- **Formato aceito**: 
  - Delimitadores suportados: vírgula (`,`) ou ponto e vírgula (`;`)
  - Colunas: Nome, CPF, Função Zendesk (opcional)
- **Comportamento**: Colaboradores do arquivo são adicionados à lista existente

#### 1.3 Tabela de Colaboradores Selecionados
Exibe os colaboradores adicionados com as seguintes colunas:

| Coluna | Descrição |
|--------|-----------|
| Avatar | Ícone visual do colaborador |
| Nome | Nome completo do colaborador |
| CPF | Documento de identificação |
| Função Zendesk | Função atual (ex: "Usuário Final") |
| Ação | Botão para remover da lista |

### Validação para Avançar
- **Obrigatório**: Pelo menos 1 colaborador selecionado

### Observações
- Usuários com status "em processamento" ou "erro" não serão processados
- Usuários que não tenham função de "Usuário Final" não serão processados

---

## Etapa 2: Selecionar Função e Grupos

### Objetivo
Definir o nível de acesso e os grupos aos quais os colaboradores serão associados.

### Funcionalidades

#### 2.1 Seleção de Função (Tipo de Acesso)

**Opções disponíveis:**

| Valor Interno | Rótulo Exibido |
|---------------|----------------|
| `agente_light` | Agente light |
| `agente_full_visualiza` | Agente Full - Visualiza Relatório |
| `agente_full_criar` | Agente Full - Criar Relatório |
| `agente_full_sem` | Agente Full - Sem Relatório |

- **Comportamento**: Campo obrigatório que habilita as seções seguintes

#### 2.2 Seleção de Grupos

Após selecionar uma função, o campo de grupos é exibido.

**Campo de busca de grupos:**
- Pesquisa por nome do grupo
- Exibe os **25 primeiros resultados** em ordem alfabética
- Grupos já selecionados não aparecem na busca

**Grupos disponíveis:**

Os grupos seguem o padrão de nomenclatura:
- `APS - [Estado] - [Número/Unidade] - [Especialidade]`

**Exemplos de grupos:**
- APS - RJ - 001 - Enfermagem
- APS - RJ - 001 - Médicos
- APS - RJ - 001 - Tutor de Relacionamento
- APS - SP - Administrativo
- APS - SP - Supervisão Enfermagem
- APS - SP ABC - 002 - CLÍNICA MÉDICA - Médicos

**Tabela de grupos selecionados:**

| Coluna | Descrição |
|--------|-----------|
| Nome do Grupo | Nome completo do grupo |
| Grupo Padrão | Indicador de grupo principal (apenas 1 por vez) |
| Ação | Botão para remover o grupo |

**Regras do Grupo Padrão:**
- O primeiro grupo adicionado é automaticamente definido como padrão
- Apenas um grupo pode ser o padrão por vez
- Ao clicar no indicador de outro grupo, ele se torna o novo padrão
- Se o grupo padrão for removido, o próximo grupo da lista assume

#### 2.3 Usuário Espelho

Funcionalidade que permite copiar os grupos de um usuário existente.

**Características:**
- Campo de busca separado abaixo da seleção de grupos
- Pesquisa por **nome** ou **CPF**
- **Limite**: Apenas 1 usuário espelho pode ser selecionado por vez
- **Independência**: Funciona independente da quantidade de acessos sendo liberados

**Comportamento ao selecionar:**
1. Os grupos do usuário espelho são **automaticamente aplicados** à lista de grupos
2. O primeiro grupo aplicado torna-se o Grupo Padrão
3. O usuário espelho selecionado é exibido com opção de remoção

**Exemplo de uso:**
> Ao buscar "pier" e selecionar "Piercarlo Ronaldo Vinci", os seguintes grupos são automaticamente adicionados:
> - Agendamento de Exames Nucleos - SP
> - Processos Específicos - Ressonância Magnética - SP
> - Reabilitação - Supervisão
> - Unidade Alto da Mooca Oftalmologia (Bixira) - Supervisão

### Validação para Avançar
- **Obrigatório**: Função selecionada E pelo menos 1 grupo selecionado

### Modal de Confirmação

Ao clicar em "Próximo", um modal de confirmação é exibido:

**Título:** "Atenção!"

**Mensagem:** 
> "Você está prestes a liberar o acesso para X colaborador(es). Deseja continuar?"

**Ações:**
- **Cancelar**: Fecha o modal e permanece na etapa 2
- **Confirmar**: Prossegue para a etapa 3 (Resumo)

---

## Etapa 3: Resumo

### Objetivo
Exibir um resumo das configurações e o status de processamento de cada colaborador.

### Informações Exibidas

#### 3.1 Configurações Selecionadas
- **Função Selecionada**: Nome da função escolhida
- **Grupos Selecionados**: Lista de grupos com indicação do Grupo Padrão

#### 3.2 Tabela de Colaboradores

| Coluna | Descrição |
|--------|-----------|
| Avatar | Ícone visual do colaborador |
| Nome | Nome completo |
| CPF | Documento de identificação |
| Status | Status do processamento |

**Status possíveis:**

| Status | Descrição | Indicação Visual |
|--------|-----------|------------------|
| Pendente | Aguardando processamento | Ícone cinza |
| Ativo | Processado com sucesso | Ícone verde |
| Erro | Falha no processamento | Ícone vermelho |

### Ações Disponíveis
- **Voltar para o Início**: Reinicia todo o fluxo, limpando as seleções

---

## Navegação

### Botões de Navegação

| Botão | Visibilidade | Ação |
|-------|--------------|------|
| VOLTAR | Etapa 2 apenas | Retorna à etapa anterior |
| PRÓXIMO | Etapas 1 e 2 | Avança para próxima etapa (com validação) |
| VOLTAR PARA O INÍCIO | Etapa 3 | Reinicia o fluxo completo |

### Indicador de Progresso
Barra superior mostrando as 3 etapas, com destaque visual na etapa atual.

---

## Regras de Negócio

1. **Colaboradores válidos**: Apenas usuários com status "ativo" e função "Usuário Final" são processados
2. **Unicidade**: Um colaborador não pode ser adicionado duas vezes à mesma solicitação
3. **Usuário Espelho**: Independe da quantidade de acessos sendo liberados simultaneamente
4. **Grupo Padrão**: Sempre deve haver exatamente um grupo padrão quando há grupos selecionados
5. **Confirmação obrigatória**: A transição da etapa 2 para 3 requer confirmação explícita

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Colaborador** | Pessoa que receberá acesso ao Zendesk |
| **Função** | Nível de permissão no Zendesk (Agente Light ou variações de Full) |
| **Grupo** | Categoria organizacional (APS RJ/SP) que define escopo de atendimento |
| **Grupo Padrão** | Grupo principal associado ao colaborador |
| **Usuário Espelho** | Usuário existente cujos grupos serão copiados para o novo acesso |
| **PortalWeb** | Sistema fonte dos dados de colaboradores ativos |

---

## Fluxograma

```
┌─────────────────────────────────────────────────────────────────┐
│                         INÍCIO                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 1: SELECIONAR COLABORADOR                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Buscar colaborador por nome/CPF                        │    │
│  │ • OU Importar arquivo CSV                                │    │
│  │ • Visualizar/remover colaboradores selecionados          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Validação: mínimo 1 colaborador]                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 2: SELECIONAR FUNÇÃO E GRUPOS                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. Selecionar tipo de acesso (função)                    │    │
│  │ 2. Selecionar grupos (busca + tabela)                    │    │
│  │ 3. Definir grupo padrão                                  │    │
│  │ 4. (Opcional) Selecionar usuário espelho                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Validação: função + mínimo 1 grupo]                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  MODAL DE CONFIRMAÇÃO                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ "Você está prestes a liberar o acesso para X             │    │
│  │  colaborador(es). Deseja continuar?"                     │    │
│  │                                                          │    │
│  │  [Cancelar]  [Confirmar]                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ETAPA 3: RESUMO                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Exibir função selecionada                              │    │
│  │ • Exibir grupos (com indicação de padrão)                │    │
│  │ • Tabela de colaboradores com status                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Voltar para o Início]                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           FIM                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

*Documento gerado em: Fevereiro de 2026*
