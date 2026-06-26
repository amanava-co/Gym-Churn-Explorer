import { useState } from "react";
import { 
  Target, 
  TrendingDown, 
  Users, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  HelpCircle, 
  Calendar, 
  Sparkles,
  Award,
  ArrowRight,
  Database,
  Building,
  UserCheck,
  Percent
} from "lucide-react";

interface CasePremisesProps {
  id: string;
}

export function CasePremisesView({ id }: CasePremisesProps) {
  // Simple interactive simulation of dropping Churn and raising LTV
  const [memberBase, setMemberBase] = useState<number>(4000);
  const [avgTicket, setAvgTicket] = useState<number>(120);

  // Math for calculations
  // Current stats: Churn 10.2%, LTV R$ 287 (historical, or dropping from R$ 412)
  // Projected stats: Churn 6.0%, Target LTV R$ 480+
  const currentChurnRate = 10.2;
  const targetChurnRate = 6.0;

  const annualCurrentLoss = Math.round(memberBase * (currentChurnRate / 100) * avgTicket * 12);
  const annualTargetLoss = Math.round(memberBase * (targetChurnRate / 100) * avgTicket * 12);
  const annualSavings = annualCurrentLoss - annualTargetLoss;

  const ltvCurrent = 287;
  const ltvGoal = 480;
  const ratioCurrent = 2.02;
  const ratioGoal = 3.0;

  return (
    <div id={id} className="space-y-8 animate-fade-in text-brand-ink">
      
      {/* 1. Header Banner */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="bg-brand-accent text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide inline-block mb-2 border border-brand-line">
              PLANEJAMENTO ESTRATÉGICO
            </span>
            <h2 className="text-xl font-serif italic font-extrabold tracking-tight text-brand-ink flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-accent stroke-[2.5]" />
              Premissas e Diagnósticos do Case (Vitaliza)
            </h2>
            <p className="text-xs font-mono text-brand-ink/70 mt-1 max-w-4xl leading-relaxed">
              Estruturação das metas corporativas para a Série B. Entenda os desafios técnicos,
              financeiros e políticos que direcionam as decisões da Diretoria e o sequenciamento da solução.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-ink/60 bg-red-50/50 px-3 py-1.5 border border-red-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-700 font-bold">Churn Crítico de 10,2%</span>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid: Context, Problem & Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Context and Problem Main Card */}
        <div className="lg:col-span-7 bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
              <ShieldAlert className="w-5 h-5 text-brand-accent" />
              <h3 className="text-base font-serif italic font-extrabold">Contexto & Problema Estrutural</h3>
            </div>
            
            <p className="text-xs font-mono leading-relaxed text-brand-ink/80">
              A Vitaliza enfrenta um problema estrutural de <strong>churn elevado (10,2%)</strong> que compromete diretamente sua sustentabilidade financeira e sua credibilidade com investidores na rodada de captação da <strong>Série B</strong>.
            </p>
            
            <div className="bg-brand-bg border-l-4 border-brand-accent p-3">
              <p className="text-xs font-mono font-extrabold text-brand-ink uppercase mb-1">
                Conclusão das Análises de Negócio:
              </p>
              <ul className="text-xs font-serif italic text-brand-ink/90 space-y-1.5">
                <li>• O churn ocorre massivamente nos primeiros meses de matrícula (early drop-offs).</li>
                <li>• Frequência semanal de uso consolidada é o principal preditor de retenção ativa.</li>
                <li>• Clientes com interações sociais em aulas de grupo têm apenas ~6% de evasão.</li>
                <li>• Há altos volumes de contratos de longo prazo (anual) sem nenhuma frequência real recente (churn oculto).</li>
              </ul>
            </div>

            <p className="text-xs font-mono text-brand-ink/75 leading-relaxed bg-brand-accent-ultralight/20 p-2.5 border border-dashed border-brand-accent/40">
              <strong className="text-brand-accent font-bold">Decisão Crítica:</strong> A Vitaliza não deve escolher entre o marketing reativo tradicional e modelos puramente preditivos de I.A., mas sim construir um sequenciamento de ativação operacional combinando ambos.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-line/10 text-xs font-mono bg-brand-bg/50 p-2 text-brand-ink/65">
            <strong>Problema Central:</strong> Falta de ferramentas e maturidade técnica de dados para monitorar, predizer e mitigar o comportamento dos alunos em tempo real de forma proativa.
          </div>
        </div>

        {/* Current State Indicator Box */}
        <div className="lg:col-span-5 bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-serif italic font-extrabold">Métricas Críticas Atuais</h3>
            </div>

            <div className="space-y-3">
              {/* Stat 1 */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="font-bold flex items-center gap-1">🛑 Churn Mensal</span>
                  <span className="text-red-600 font-extrabold">10.2%</span>
                </div>
                <div className="w-full bg-brand-bg h-2.5 border border-brand-line rounded-none overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "100%" }} />
                </div>
                <span className="text-[10px] font-mono text-brand-ink/60 block mt-0.5">Meta aceitável de mercado: ≤ 6.0%</span>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="font-bold">📉 Queda de LTV</span>
                  <span className="text-red-600 font-extrabold">R$ 412 → R$ 287</span>
                </div>
                <div className="w-full bg-brand-bg h-2.5 border border-brand-line rounded-none overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: "69%" }} />
                </div>
                <span className="text-[10px] font-mono text-brand-ink/60 block mt-0.5">Queda drástica de R$ 125 no valor acumulado por cliente</span>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="font-bold">⚖️ LTV / CAC Ratio</span>
                  <span className="text-brand-ink font-extrabold">2.02</span>
                </div>
                <div className="w-full bg-brand-bg h-2.5 border border-brand-line rounded-none overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "50%" }} />
                </div>
                <span className="text-[10px] font-mono text-brand-ink/60 block mt-0.5">Abaixo do limiar de sobrevivência saudável ideal (≥ 3.0)</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 text-red-800 text-[11px] font-mono p-3 border border-red-200 mt-4">
            ⚠️ <strong>Impacto da Série B:</strong> Caso esses índices não se recuperem nos próximos meses, investidores reduzirão o valuation em até 35%.
          </div>
        </div>

      </div>

      {/* 3. Strategic Objectives vs Project Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strategic Objectives */}
        <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
            <Target className="w-5 h-5 text-brand-accent" />
            <h3 className="text-base font-serif italic font-extrabold text-brand-ink">🎯 Objetivos Estratégicos (Visão Comercial)</h3>
          </div>

          <p className="text-xs font-mono text-brand-ink/75">
            A meta primordial da retenção é otimizar cada etapa de relacionamento do atleta com a rede física da Vitaliza.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            
            <div className="border border-brand-line/20 p-3 bg-brand-bg/40">
              <span className="text-[9px] uppercase tracking-wider text-brand-ink/60 block mb-1">Objetivo Geral</span>
              <strong className="text-brand-ink text-sm block">Reduzir Churn para 6,0%</strong>
              <span className="text-[10px] text-green-600 block mt-1">✓ Redução real de 4.2pp</span>
            </div>

            <div className="border border-brand-line/20 p-3 bg-brand-bg/40">
              <span className="text-[9px] uppercase tracking-wider text-brand-ink/60 block mb-1">Crescimento de LTV</span>
              <strong className="text-brand-ink text-sm block">Aumentar LTV para &gt; R$ 480</strong>
              <span className="text-[10px] text-green-600 block mt-1">✓ Incremento de R$ 193/cliente</span>
            </div>

            <div className="border border-brand-line/20 p-3 bg-brand-bg/40">
              <span className="text-[9px] uppercase tracking-wider text-brand-ink/60 block mb-1">Economia de Aquisição</span>
              <strong className="text-brand-ink text-sm block">LTV/CAC acima de 3,0</strong>
              <span className="text-[10px] text-green-600 block mt-1">✓ Eficiência comercial ótima</span>
            </div>

            <div className="border border-brand-line/20 p-3 bg-brand-bg/40">
              <span className="text-[9px] uppercase tracking-wider text-brand-ink/60 block mb-1">Maturidade Analítica</span>
              <strong className="text-brand-ink text-sm block">Inteligência Orientada a Dados</strong>
              <span className="text-[10px] text-green-600 block mt-1">✓ Preditor proativo</span>
            </div>
            
          </div>

          <div className="border-t border-brand-line/10 pt-3 flex items-center gap-1.5 text-xs font-mono text-brand-accent">
            <Sparkles className="w-4 h-4" />
            <span>Prazo Final Acordado: Entrega robusta em até 10 semanas</span>
          </div>
        </div>

        {/* Project Constraints */}
        <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-serif italic font-extrabold text-brand-ink">🚧 Restrições Críticas do Projeto</h3>
          </div>

          <p className="text-xs font-mono text-brand-ink/75">
            Qualquer solução de software sugerida deve encaixar nos limites restritos de orçamento, equipe e prazo.
          </p>

          <div className="space-y-2 text-xs font-mono">
            {/* Limit 1 */}
            <div className="flex gap-2 items-start bg-amber-50/50 p-2 border border-amber-200">
              <div className="bg-amber-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-none mt-0.5">TÉCNICA</div>
              <div>
                <strong className="text-brand-ink block">Dados fragmentados e sem pipeline unificado</strong>
                <span className="text-brand-ink/70 text-[10px]">As fontes de dados de catraca e CRM não se comunicavam antes do explorer analítico.</span>
              </div>
            </div>

            {/* Limit 2 */}
            <div className="flex gap-2 items-start bg-brand-bg p-2 border border-brand-line/15">
              <div className="bg-brand-ink text-white font-black text-[9px] px-1.5 py-0.5 rounded-none mt-0.5">PESSOAS</div>
              <div>
                <strong className="text-brand-ink block">Equipe limitada com forte dependência de engenharia</strong>
                <span className="text-brand-ink/70 text-[10px]">Equipe de marketing não possui analistas de dados nativos para realizar queries avançadas em SQL.</span>
              </div>
            </div>

            {/* Limit 3 */}
            <div className="flex gap-2 items-start bg-brand-bg p-2 border border-brand-line/15">
              <div className="bg-brand-ink text-white font-black text-[9px] px-1.5 py-0.5 rounded-none mt-0.5">BUDGET</div>
              <div>
                <strong className="text-brand-ink block">Orçamento (CapEx) limitado a R$ 600 mil</strong>
                <span className="text-brand-ink/70 text-[10px]">Restrição financeira rígida para servidores de processamento e licenças proprietárias caras.</span>
              </div>
            </div>

            {/* Limit 4 */}
            <div className="flex gap-2 items-start bg-amber-50/50 p-2 border border-amber-200">
              <div className="bg-amber-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-none mt-0.5">DADOS</div>
              <div>
                <strong className="text-brand-ink block">Ausência de granularidade comportamental fina</strong>
                <span className="text-brand-ink/70 text-[10px]">O dataset inicial encontra-se em formato agregado (mensalidades e médias de treinos).</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Interactive ROI Calculator / Savings Simulation */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-line/15 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-serif italic font-extrabold">Simulador de Impacto Financeiro (Evitação de Churn)</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200 font-bold">
            Simulação Baseada em Métricas da Diretoria
          </span>
        </div>

        <p className="text-xs font-mono text-brand-ink/70">
          Ajuste o tamanho da carteira de clientes ativos e o valor médio do plano para calcular a economia de receita que a meta estratégica trará anualmente para as contas da Vitaliza.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Controls */}
          <div className="md:col-span-4 space-y-4 font-mono text-xs">
            <div>
              <label className="block font-bold mb-2 uppercase text-brand-ink/80 text-[10px]">
                👥 Alunos Ativos na Rede: <span className="text-brand-accent text-sm font-bold ml-1">{memberBase.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="1000" 
                max="10000" 
                step="500"
                value={memberBase} 
                onChange={(e) => setMemberBase(parseInt(e.target.value))}
                className="w-full accent-brand-accent cursor-ew-resize bg-brand-bg border border-brand-line"
              />
              <div className="flex justify-between text-[9px] text-brand-ink/50 mt-1">
                <span>1.000</span>
                <span>5.000</span>
                <span>10.000</span>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 uppercase text-brand-ink/80 text-[10px]">
                💳 Mensalidade Média (R$): <span className="text-brand-accent text-sm font-bold ml-1">R$ {avgTicket}</span>
              </label>
              <input 
                type="range" 
                min="60" 
                max="250" 
                step="5"
                value={avgTicket} 
                onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                className="w-full accent-brand-accent cursor-ew-resize bg-brand-bg border border-brand-line"
              />
              <div className="flex justify-between text-[9px] text-brand-ink/50 mt-1">
                <span>R$ 60</span>
                <span>R$ 150</span>
                <span>R$ 250</span>
              </div>
            </div>
          </div>

          {/* Math Board Grid */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="border border-brand-line/20 p-4 bg-red-50/10 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-brand-ink/65 uppercase">Perda Churn Atual (10.2%/m)</span>
              <div>
                <strong className="text-red-600 block text-lg font-serif italic font-extrabold mt-2">R$ {annualCurrentLoss.toLocaleString()}/ano</strong>
                <span className="text-[10px] font-mono text-brand-ink/50">Média de {Math.round(memberBase * 0.102)} perdas/mês</span>
              </div>
            </div>

            <div className="border border-brand-line/20 p-4 bg-green-50/5 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-brand-ink/65 uppercase">Perda Churn Meta (6.0%/m)</span>
              <div>
                <strong className="text-brand-ink block text-lg font-serif italic font-extrabold mt-2">R$ {annualTargetLoss.toLocaleString()}/ano</strong>
                <span className="text-[10px] font-mono text-brand-ink/50">Média de {Math.round(memberBase * 0.06)} perdas/mês</span>
              </div>
            </div>

            <div className="border border-brand-line p-4 bg-brand-ink text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-2 translate-y-[-5px] opacity-10">
                <DollarSign className="w-24 h-24 stroke-white fill-white" />
              </div>
              <span className="text-[9px] font-mono text-brand-accent uppercase font-black tracking-wider">💰 Receita Salva Líquida</span>
              <div>
                <strong className="text-brand-accent text-xl font-serif italic font-black block mt-2">R$ {annualSavings.toLocaleString()}/ano</strong>
                <span className="text-[10px] font-mono text-white/55">Preservação líquida recorrente</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 5. Weekly Delivery Roadmap (10 Weeks timeline) */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
          <Calendar className="w-5 h-5 text-brand-accent animate-spin-slow" />
          <h3 className="text-base font-serif italic font-extrabold text-brand-ink">📅 Cronograma de Entrega e Sequenciamento (10 Semanas)</h3>
        </div>

        <p className="text-xs font-mono text-brand-ink/75">
          Sequenciamento equilibrando <strong>impacto rápido</strong> de retenção nas academias físicas e <strong>estruturação de I.A. de longo prazo</strong>. Opções puramente preditivas exigem maturidade; por isso iniciamos com regras de negócio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-[11px] font-mono">
          
          <div className="border border-brand-line/20 p-3 bg-brand-bg/20 space-y-2">
            <span className="bg-brand-ink text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide inline-block">Semana 1-2</span>
            <strong className="text-brand-ink block text-xs">Fase 1: Diagnóstico e Setup</strong>
            <p className="text-brand-ink/70 text-[10px]">Unificação de dados offline (CSV/CRM), mapeamento estático da base, validação dos perfis de personas e cálculo inicial de correlação de Churn.</p>
          </div>

          <div className="border border-brand-line/20 p-3 bg-brand-bg/20 space-y-2">
            <span className="bg-brand-ink text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide inline-block">Semana 3-4</span>
            <strong className="text-brand-ink block text-xs">Fase 2: Regras Críticas Rápidas</strong>
            <p className="text-brand-ink/70 text-[10px]">Validação de gatilhos automáticos pela recepção das academias (regras estáticas: ausência no onboarding, sumiço em grupo).</p>
          </div>

          <div className="border border-brand-line/20 p-3 bg-brand-accent/10 border-brand-accent/50 space-y-2">
            <span className="bg-brand-accent text-white text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wide inline-block">Semana 5-6</span>
            <strong className="text-brand-ink block text-xs">Fase 3: Piloto e Integração</strong>
            <p className="text-brand-ink/70 text-[10px]">Execução do piloto com 20% das academias integradas. Campanha de transição de contratos mensais e testes de interações sociais guiadas.</p>
          </div>

          <div className="border border-brand-line/20 p-3 bg-brand-bg/20 space-y-2">
            <span className="bg-brand-ink text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide inline-block">Semana 7-8</span>
            <strong className="text-brand-ink block text-xs">Fase 4: Modelo Preditivo I.A.</strong>
            <p className="text-brand-ink/70 text-[10px]">Ajuste fino de regressão logística preditiva automática, gerando probabilidade de churn diretamente no painel do administrador de CRM.</p>
          </div>

          <div className="border border-brand-line/20 p-3 bg-brand-bg/20 space-y-2">
            <span className="bg-brand-ink text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide inline-block">Semana 9-10</span>
            <strong className="text-brand-ink block text-xs">Fase 5: Expansão Nacional</strong>
            <p className="text-brand-ink/70 text-[10px]">Lançamento oficial das ferramentas em toda a rede Vitaliza, homologação final para investidores da Série B e fechamento de novos dashboards.</p>
          </div>

        </div>
      </div>

      {/* 6. Stakeholders Map Section */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-line/15 pb-2">
          <Building className="w-5 h-5 text-brand-ink" />
          <h3 className="text-base font-serif italic font-extrabold text-brand-ink">👥 Mapeamento de Stakeholders Relevantes</h3>
        </div>

        <p className="text-xs font-mono text-brand-ink/75">
          Sucesso do projeto depende da harmonização de expectativas políticas, comerciais, operacionais e de compliance jurídico.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
          
          {/* Internal Stakeholders column */}
          <div className="border border-brand-line/30 p-4 space-y-3 bg-brand-bg/20">
            <h5 className="text-[11px] font-mono font-bold text-brand-ink uppercase border-b border-brand-line/10 pb-1 flex items-center justify-between">
              <span>🏠 Stakeholders Internos</span>
              <span className="text-[9px] text-brand-accent">Execução & Decisão</span>
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">🦁 VP Growth</strong>
                <span className="text-brand-ink/70 text-[9px]">Líder de decisão primária. Sucesso foca na mitigação do CAC e alcance da meta de 6.0%.</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">👑 CEO</strong>
                <span className="text-brand-ink/70 text-[9px]">Forte pressão estratégica. Mira a valorização da empresa para a Série B.</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">💰 CFO</strong>
                <span className="text-brand-ink/70 text-[9px]">Análise rígida do ROI (Economia de R$ 600K e LTV maior).</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">⚙️ CTO</strong>
                <span className="text-brand-ink/70 text-[9px]">Viabilidade técnica do pipeline de dados, facilidade de APIs e governança.</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">📱 Equipe de Produto</strong>
                <span className="text-brand-ink/70 text-[9px]">Personalização da experiência do applet e jornadas individuais dos alunos.</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15">
                <strong className="text-brand-ink block">🤝 CS (Atendimento)</strong>
                <span className="text-brand-ink/70 text-[9px]">Execução e acionamento operacional das ligas de acompanhamento.</span>
              </div>
              <div className="bg-white p-2 border border-brand-line/15 col-span-2">
                <strong className="text-brand-ink block">⚖️ DPO (Data Protection Officer)</strong>
                <span className="text-brand-ink/70 text-[9px]">Garante conformidade com a LGPD para armazenamento de dados de saúde física e perfil do usuário.</span>
              </div>
            </div>
          </div>

          {/* External Stakeholders Column */}
          <div className="border border-brand-line/30 p-4 space-y-3 bg-brand-bg/20">
            <h5 className="text-[11px] font-mono font-bold text-brand-ink uppercase border-b border-brand-line/10 pb-1 flex items-center justify-between">
              <span>🌍 Stakeholders Externos</span>
              <span className="text-[9px] text-brand-accent">Mercado & Investimentos</span>
            </h5>

            <div className="space-y-2 text-[10px]">
              <div className="bg-white p-2.5 border border-brand-line/15">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-brand-ink block text-[11px]">💸 Investidores de Capital de Risco</strong>
                  <span className="bg-brand-accent text-white px-1.5 py-0.2 uppercase text-[8px] font-black">Série B</span>
                </div>
                <p className="text-brand-ink/70 text-[10px]">Exigem transparência no cálculo do LTV, segurança de dados e garantias analíticas robustas. O indicador LTV/CAC e Churn são as principais métricas do Term Sheet.</p>
              </div>

              <div className="bg-white p-2.5 border border-brand-line/15">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-brand-ink block text-[11px]">⚔️ Concorrentes do Mercado (Ex: Strava / Apps)</strong>
                  <span className="bg-brand-ink text-white px-1.5 py-0.2 uppercase text-[8px] font-black">Competidores</span>
                </div>
                <p className="text-brand-ink/70 text-[10px]">Academias low-cost e plataformas de engajamento social que desafiam a retenção orgânica dos clientes Vitaliza fornecendo monitoria e treinos gratuitos remotamente.</p>
              </div>
            </div>

            <div className="bg-white border-2 border-brand-line p-3 font-serif text-[11px] text-brand-ink/80 italic">
              "Equilibrar os objetivos do VP Growth com as restrições financeiras do CFO de R$ 600 mil orientou a construção do simulador minimalista de alta aderência."
            </div>
          </div>

        </div>
      </div>

      {/* Analytical database footer info */}
      <div className="bg-brand-bg/50 border border-brand-line p-4 text-[10px] font-mono text-brand-ink/75 text-center">
        ⚡ <strong>Vitaliza Strategic Executive Case Premises Core</strong> — Desenvolvido em conformidade com as diretrizes de governança da LGPD e as premissas da Série B.
      </div>
    </div>
  );
}
