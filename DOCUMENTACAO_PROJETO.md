# Documentação Analítica e Técnica - Vitaliza Churn Predictor

Bem-vindo à documentação oficial do projeto **Vitaliza Churn Predictor**. Este documento foi elaborado para fornecer ao corpo docente e aos avaliadores uma visão completa sobre a arquitetura, as funcionalidades e as decisões de negócio implementadas na aplicação.

## 1. Visão Geral do Projeto

A aplicação **Vitaliza** é uma plataforma analítica de *Business Intelligence* e *Machine Learning* construída para uma rede de academias. O principal objetivo é combater a evasão de clientes (Churn) por meio de dados, predição inteligente e ações direcionadas de retenção. 

A solução integra desde a análise exploratória de dados brutos (EDA) até modelos preditivos com **Explicabilidade de IA (XAI - SHAP)**, e traduz isso em estratégias de negócio baseadas em Personas e clusters comportamentais.

## 2. Arquitetura Tecnológica

- **Front-end / UI**: Construído em **React 18** com **TypeScript** e **Vite**. 
- **Estilização**: **Tailwind CSS**, adotando um design system moderno, limpo e com forte hierarquia visual.
- **Gráficos e Visualização de Dados**: **Recharts** para construção de gráficos de barras, boxplots e a visualização do SHAP (Waterfall / Bar).
- **Machine Learning Integrado (Edge AI)**: Para garantir alta performance e funcionamento *offline-first* no simulador, o modelo preditivo base (Regressão Logística com *Gradient Descent*) e o cálculo matemático do peso das variáveis (aproximação do método SHAP Local) foram desenvolvidos de forma **nativa em TypeScript** (`src/gym_churn_data.ts`).
- **Back-end de Referência (Python)**: Na raiz do projeto, encontra-se o arquivo `backend_shap_example.py` (usando FastAPI e Python `shap`). Ele serve como a prova de conceito (PoC) da arquitetura em nuvem, demonstrando como a infraestrutura receberia as chamadas preditivas do front-end em um ambiente de produção escalável.

---

## 3. Mapeamento de Telas (Navegação por Abas)

A aplicação foi dividida em abas lógicas, guiando o usuário (gestor da academia) do entendimento macro ao micro (predição individual). A seguir, o detalhamento de cada tela:

### 3.1. Visão Geral e Variáveis-Chave
- **O que é**: Um dicionário de dados interativo.
- **Funcionalidade**: Lista todas as variáveis presentes no dataset (ex: `Lifetime`, `Contract_period`, `Avg_class_frequency_total`), explicando o significado de cada coluna e o seu tipo de dado. Fundamental para ambientar o usuário ao contexto técnico do banco de dados.

### 3.2. Premissas do Case
- **O que é**: O alinhamento de negócio.
- **Funcionalidade**: Define o cenário da academia "Vitaliza", os custos operacionais (CAC, LTV) e as suposições assumidas para embasar as tomadas de decisão. Justifica o *porquê* estamos medindo o Churn.

### 3.3. Personas (Análise Estratégica)
- **O que é**: O coração estratégico da retenção.
- **Funcionalidade**: Transforma os dados quantitativos em perfis humanos qualitativos (ex: "Lucas, o Fantasma do Onboarding", "Pedro, o Convertido").
- **Destaques da Tela**:
  1. **Matriz de Retenção (Risco x Valor)**: Uma matriz visual interativa de 4 quadrantes (*Deixar Ir, Intervir Agora, Monitorar, Manter e Monetizar*). O gestor pode clicar em cada aluno (ponto no gráfico) e receber uma diretriz de ação preventiva.
  2. **Heatmap de Clusters (K-Means Cohorts)**: Uma matriz de calor que exibe 4 grandes agrupamentos baseados em métricas-chave (Lifetime, Frequência, Social e Risco). Demonstra a saúde de cada segmento através de cores (vermelho para risco crítico, verde para saudável).

### 3.4. Dashboards
- **O que é**: Business Intelligence clássico.
- **Funcionalidade**: Exibe gráficos consolidados e KPIs gerenciais, permitindo observar as taxas globais de evasão e a distribuição do churn frente a variáveis como gênero e proximidade.

### 3.5. Boxplots
- **O que é**: Análise de dispersão estatística.
- **Funcionalidade**: Compara graficamente a distribuição, medianas e os *outliers* de variáveis numéricas (como Frequência Mensal e Lifetime) fatiadas pelo resultado final (Churn vs Não Churn).

### 3.6. Matriz de Correlação
- **O que é**: Análise bivariada.
- **Funcionalidade**: Uma matriz de correlação de Pearson colorida. Mostra ao usuário de forma visual quais variáveis crescem juntas (verde) ou em sentidos opostos (vermelho). Por exemplo, comprova estatisticamente que um alto *Lifetime* tem forte correlação negativa com a variável *Churn*.

### 3.7. Simulador Predictor IA (Com SHAP)
- **O que é**: A ferramenta tática de predição individual.
- **Funcionalidade**: O gestor ajusta os *sliders* de comportamento de um aluno específico. O modelo de Regressão Logística embutido calcula instantaneamente a probabilidade matemática desse aluno cancelar o plano.
- **Explicabilidade (SHAP Local)**: Logo abaixo do resultado, o sistema renderiza um gráfico estilo Bar (aproximação do método Waterfall) detalhando *o porquê* a IA tomou aquela decisão. Ele mostra quais variáveis empurraram a probabilidade de churn para cima (aumentando risco) ou para baixo (retendo o cliente). Também exibe um "Resumo Dinâmico" em linguagem natural, traduzindo o gráfico para o usuário de negócios.

### 3.8. Explorer Banco de Dados
- **O que é**: O Data Lake bruto.
- **Funcionalidade**: Uma tabela crua e paginada contendo as instâncias carregadas na memória, permitindo ao gestor auditar e buscar clientes específicos dentro do dataset lido pelo sistema.

---

## 4. Como o Modelo e a Explicabilidade (SHAP) Foram Feitos?

A fim de fornecer uma prova de conceito totalmente autossuficiente e livre de latência (sem a dependência obrigatória de containers Python na nuvem nesta fase de protótipo), adotamos uma arquitetura híbrida:

1. **Simulação Front-end (TypeScript)**:
   Em `src/gym_churn_data.ts`, implementamos uma classe matemática chamada `LogisticRegression`. Quando o app carrega, ele treina o algoritmo (Gradient Descent) baseado nos dados da academia. O método `explain()` nessa mesma classe faz o papel do SHAP: ele captura as médias, os desvios, os pesos treinados de cada variável, e calcula o impacto individual de cada *feature* na predição exata daquela instância.
   
2. **Back-end Python (Pronto para Escalar)**:
   Foi construído e salvo na raiz o script `backend_shap_example.py`. Este arquivo demonstra perfeitamente como implementar o mesmo simulador em Nuvem, mas utilizando `FastAPI`, `pandas`, o pacote oficial estatístico `shap` do Python e modelos em árvore complexos (como XGBoost ou Random Forest). Em uma esteira de produção futura (MLOps), o front-end React simplesmente fará chamadas `POST /api/predict` para este servidor.

## Conclusão
Este projeto une Ciência de Dados, Engenharia de Software e Negócios. Ele não se limita a prever números, mas foca em traduzir os outputs de IA em insights acionáveis (Explicabilidade e Matrizes de Ação) para salvar a receita da academia de forma pró-ativa.
