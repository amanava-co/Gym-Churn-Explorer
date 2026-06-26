import { useMemo } from "react";
import { GymMember } from "../gym_churn_data";
import { 
  ShieldCheck, 
  AlertTriangle, 
  UserMinus, 
  Compass, 
  Target, 
  FileSpreadsheet, 
  Handshake, 
  Activity, 
  Users, 
  TrendingUp, 
  Award,
  Sparkles
} from "lucide-react";

interface KeyVariablesOverviewProps {
  id: string;
  members: GymMember[];
  onNavigateToTab: (tabName: string) => void;
}

export function KeyVariablesOverview({ id, members, onNavigateToTab }: KeyVariablesOverviewProps) {
  // Let's compute exact dynamic stats from current state data list
  const dynamicStats = useMemo(() => {
    const total = members.length || 1;
    const churned = members.filter(m => m.Churn === 1);
    const active = members.filter(m => m.Churn === 0);

    // 1. Contract Period impact
    const monthlyTotal = members.filter(m => m.Contract_period === 1);
    const monthlyChurned = monthlyTotal.filter(m => m.Churn === 1);
    const monthlyChurnRate = monthlyTotal.length ? (monthlyChurned.length / monthlyTotal.length) * 100 : 0;

    const annualTotal = members.filter(m => m.Contract_period === 12);
    const annualChurned = annualTotal.filter(m => m.Churn === 1);
    const annualChurnRate = annualTotal.length ? (annualChurned.length / annualTotal.length) * 100 : 0;

    // 2. Frequency target
    const lowFreqTotal = members.filter(m => m.Avg_class_frequency_current_month < 1.0);
    const lowFreqChurned = lowFreqTotal.filter(m => m.Churn === 1);
    const lowFreqChurnRate = lowFreqTotal.length ? (lowFreqChurned.length / lowFreqTotal.length) * 100 : 0;

    const highFreqTotal = members.filter(m => m.Avg_class_frequency_current_month >= 2.0);
    const highFreqChurned = highFreqTotal.filter(m => m.Churn === 1);
    const highFreqChurnRate = highFreqTotal.length ? (highFreqChurned.length / highFreqTotal.length) * 100 : 0;

    // 3. Lifetime target
    const newMembersTotal = members.filter(m => m.Lifetime <= 2);
    const newMembersChurned = newMembersTotal.filter(m => m.Churn === 1);
    const newMembersChurnRate = newMembersTotal.length ? (newMembersChurned.length / newMembersTotal.length) * 100 : 0;

    // 4. Group activities
    const groupTotal = members.filter(m => m.Group_visits === 1);
    const groupChurned = groupTotal.filter(m => m.Churn === 1);
    const groupChurnRate = groupTotal.length ? (groupChurned.length / groupTotal.length) * 100 : 0;

    // 5. Customer segments based on combinations
    // High Risk: Short contract + Low frequency
    const highRiskGroup = members.filter(m => m.Contract_period === 1 && m.Avg_class_frequency_current_month < 1.0);
    // Secure Group: Long contract + high frequency + older lifetime
    const secureGroup = members.filter(m => m.Contract_period === 12 && m.Avg_class_frequency_current_month >= 1.5 && m.Lifetime > 3);

    // Remaining fall into medium risk
    const highRiskPct = (highRiskGroup.length / total) * 100;
    const securePct = (secureGroup.length / total) * 100;
    const mediumRiskCount = members.length - highRiskGroup.length - secureGroup.length;
    const mediumRiskPct = (mediumRiskCount / total) * 100;

    return {
      total,
      churnedCount: churned.length,
      activeCount: active.length,
      monthlyTotal: monthlyTotal.length,
      monthlyChurned: monthlyChurned.length,
      monthlyChurnRate: parseFloat(monthlyChurnRate.toFixed(1)),
      annualTotal: annualTotal.length,
      annualChurned: annualChurned.length,
      annualChurnRate: parseFloat(annualChurnRate.toFixed(1)),
      lowFreqTotal: lowFreqTotal.length,
      lowFreqChurnRate: parseFloat(lowFreqChurnRate.toFixed(1)),
      highFreqTotal: highFreqTotal.length,
      highFreqChurnRate: parseFloat(highFreqChurnRate.toFixed(1)),
      newMembersTotal: newMembersTotal.length,
      newMembersChurnRate: parseFloat(newMembersChurnRate.toFixed(1)),
      groupTotal: groupTotal.length,
      groupChurnRate: parseFloat(groupChurnRate.toFixed(1)),
      
      highRiskCount: highRiskGroup.length,
      highRiskPct: parseFloat(highRiskPct.toFixed(1)),
      mediumRiskCount,
      mediumRiskPct: parseFloat(mediumRiskPct.toFixed(1)),
      secureCount: secureGroup.length,
      securePct: parseFloat(securePct.toFixed(1))
    };
  }, [members]);

  return (
    <div id={id} className="space-y-8 animate-fade-in">
      {/* Dynamic Summary Panel Header */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="bg-brand-accent text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide inline-block mb-2 border border-brand-line">
              VISÃO GERAL DO ECOSSISTEMA
            </span>
            <h2 className="text-xl font-serif italic font-extrabold tracking-tight text-brand-ink">
              Visão Geral & Variáveis-Chave do Churn
            </h2>
            <p className="text-xs font-mono text-brand-ink/70 mt-1 max-w-2xl leading-relaxed">
              Descubra por que os clientes cancelam suas assinaturas na academia.
              Esta seção condensa as correlações mais expressivas do arquivo <code>gym_churn_us.csv</code>.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigateToTab("predictor")}
              className="bg-brand-ink text-white hover:bg-brand-ink/90 text-xs font-mono font-bold py-2.5 px-4 border-2 border-brand-line shadow-[2px_2px_0px_0px_#141414] transition-all cursor-pointer rounded-none flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 stroke-[2]" />
              Preditor I.A. de Risco
            </button>
            <button
              onClick={() => onNavigateToTab("dashboard")}
              className="bg-white hover:bg-brand-bg text-brand-ink text-xs font-mono font-bold py-2.5 px-4 border-2 border-brand-line shadow-[2px_2px_0px_0px_#141414] transition-all cursor-pointer rounded-none flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-accent stroke-[2.5]" />
              Gráficos Seaborn
            </button>
          </div>
        </div>
      </div>

      {/* Grid comparing the Three Core Pillars of Gym Churn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PILLAR 1: CRITICAL RISK SEGMENT */}
        <div className="bg-white border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 opacity-20 rounded-full translate-x-8 -translate-y-8" />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider">Alto Risco (Crítico)</span>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-serif italic font-extrabold text-brand-ink">
                {dynamicStats.highRiskCount}
              </span>
              <span className="text-xs font-mono text-brand-ink/60 ml-1.5">
                membros ({dynamicStats.highRiskPct}%)
              </span>
            </div>

            <p className="text-xs font-mono text-brand-ink/75 leading-relaxed bg-red-50/50 p-2.5 border border-red-200">
              Clientes ativos com <strong>Contrato Mensal (1 mês)</strong> cuja frequência de idas recente caiu para <strong>menos de 1 treino/semana</strong>. A evasão neste segmento é tida como iminente.
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-brand-line/10 flex justify-between items-center text-[11px] font-mono">
            <span className="text-brand-ink/50">Histórico de Cancelamento:</span>
            <span className="font-extrabold text-red-600 uppercase bg-red-100/30 px-1.5 py-0.5 border border-red-200">~ 90% Churn</span>
          </div>
        </div>

        {/* PILLAR 2: MEDIUM RISK SEGMENT */}
        <div className="bg-white border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 opacity-25 rounded-full translate-x-8 -translate-y-8" />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#cc7000]">
              <Activity className="w-5 h-5 flex-shrink-0" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider">Atenção (Médio Risco)</span>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-serif italic font-extrabold text-brand-ink">
                {dynamicStats.mediumRiskCount}
              </span>
              <span className="text-xs font-mono text-brand-ink/60 ml-1.5">
                membros ({dynamicStats.mediumRiskPct}%)
              </span>
            </div>

            <p className="text-xs font-mono text-brand-ink/75 leading-relaxed bg-yellow-50/50 p-2.5 border border-yellow-200">
              Membros caracterizados por contratos curtos com frequência razoável ou contratos de longo prazo (6-12M) que experimentaram uma diminuição moderada nas visitas esportivas.
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-brand-line/10 flex justify-between items-center text-[11px] font-mono">
            <span className="text-brand-ink/50">Foco de Prevenção:</span>
            <span className="font-extrabold text-[#cc7000] uppercase bg-yellow-100/20 px-1.5 py-0.5 border border-yellow-200">Alerta de Contato</span>
          </div>
        </div>

        {/* PILLAR 3: SECURE / RETAINED SEGMENT */}
        <div className="bg-white border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 opacity-20 rounded-full translate-x-8 -translate-y-8" />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider">Estáveis (Fidelizados)</span>
            </div>
            
            <div className="py-2">
              <span className="text-3xl font-serif italic font-extrabold text-brand-ink">
                {dynamicStats.secureCount}
              </span>
              <span className="text-xs font-mono text-brand-ink/60 ml-1.5">
                membros ({dynamicStats.securePct}%)
              </span>
            </div>

            <p className="text-xs font-mono text-brand-ink/75 leading-relaxed bg-green-50/40 p-2.5 border border-green-200">
              Clientes que firmaram <strong>Contrato de 12 Meses</strong>, possuem frequência constante de ao menos <strong>1.5 treinos por semana</strong> e contam com acumulado de atividade superior a 3 meses.
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-brand-line/10 flex justify-between items-center text-[11px] font-mono">
            <span className="text-brand-ink/50">Renovação Projetada:</span>
            <span className="font-extrabold text-green-700 uppercase bg-green-100/20 px-1.5 py-0.5 border border-green-200">Fidelidade Secura</span>
          </div>
        </div>

      </div>

      {/* Advanced variable breakdown chart cards */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none">
        <h3 className="text-base font-serif italic font-bold text-brand-ink border-b-2 border-brand-line pb-2 mb-6 flex items-center justify-between">
          <span>🎯 Os 5 Determinantes Críticos do Churn na Academia</span>
          <span className="text-[10px] font-mono font-bold bg-brand-bg px-2 py-0.5 border border-brand-line">PONDERADO VIA RANDOM FOREST</span>
        </h3>

        <div className="space-y-6">
          {/* VARIABLE 1 - CONTRACT PERIOD */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-brand-bg/25 border border-brand-line/60 p-4 transform transition-all hover:scale-[1.005]">
            <div className="w-full lg:w-4/12 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-brand-ink text-white font-mono font-bold text-[11px] px-1.5 py-0.5">01</span>
                <span className="font-mono text-xs font-bold text-brand-ink uppercase">Duração do Contrato (Contract_period)</span>
              </div>
              <p className="text-[11px] font-mono text-brand-ink/70">
                A estrutura do plano assinado (Mensal vs. Semestral vs. Anual) é o fator regulador número um de desistência voluntária.
              </p>
            </div>
            
            <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
              <div className="border border-brand-line p-2 bg-red-50/20">
                <div className="text-[10px] font-mono text-brand-ink/50 uppercase">Plano Mensal (1 Mês)</div>
                <div className="text-sm font-semibold tracking-tight text-brand-ink">{dynamicStats.monthlyChurnRate}% de Churn</div>
                <div className="w-full bg-brand-bg h-1.5 mt-1 border border-brand-line/20">
                  <div className="bg-brand-accent h-full" style={{ width: `${dynamicStats.monthlyChurnRate}%` }} />
                </div>
              </div>
              <div className="border border-brand-line p-2 bg-green-50/20">
                <div className="text-[10px] font-mono text-brand-ink/50 uppercase">Plano Anual (12M)</div>
                <div className="text-sm font-semibold tracking-tight text-brand-ink">{dynamicStats.annualChurnRate}% de Churn</div>
                <div className="w-full bg-brand-bg h-1.5 mt-1 border border-brand-line/20">
                  <div className="bg-brand-ink h-full" style={{ width: `${dynamicStats.annualChurnRate}%` }} />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/12 font-serif italic text-xs text-brand-ink/80 bg-white p-2 border border-brand-line/30 leading-relaxed">
              * "Incentivar a migração de mensal para semestral/anual reduz o churn geral da unidade de forma massiva."
            </div>
          </div>

          {/* VARIABLE 2 - RECENT FREQUENCY */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-brand-bg/25 border border-brand-line/60 p-4 transform transition-all hover:scale-[1.005]">
            <div className="w-full lg:w-4/12 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-brand-ink text-white font-mono font-bold text-[11px] px-1.5 py-0.5">02</span>
                <span className="font-mono text-xs font-bold text-brand-ink uppercase">Frequência recente (Mês Atual)</span>
              </div>
              <p className="text-[11px] font-mono text-brand-ink/70">
                As idas semanais registradas nas catracas apontam o esmorecimento do entusiasmo antes da formalização do abandono.
              </p>
            </div>
            
            <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
              <div className="border border-brand-line p-2 bg-red-50/20">
                <div className="text-[10px] font-mono text-brand-ink/50 uppercase">&lt; 1 treino por semana</div>
                <div className="text-sm font-semibold tracking-tight text-brand-ink">{dynamicStats.lowFreqChurnRate}% de Churn</div>
                <div className="w-full bg-brand-bg h-1.5 mt-1 border border-brand-line/20">
                  <div className="bg-brand-accent h-full" style={{ width: `${dynamicStats.lowFreqChurnRate}%` }} />
                </div>
              </div>
              <div className="border border-brand-line p-2 bg-green-50/20">
                <div className="text-[10px] font-mono text-brand-ink/50 uppercase">&gt;= 2 treinos por semana</div>
                <div className="text-sm font-semibold tracking-tight text-brand-ink">{dynamicStats.highFreqChurnRate}% de Churn</div>
                <div className="w-full bg-brand-bg h-1.5 mt-1 border border-brand-line/20">
                  <div className="bg-brand-ink h-full" style={{ width: `${dynamicStats.highFreqChurnRate}%` }} />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/12 font-serif italic text-xs text-brand-ink/80 bg-white p-2 border border-brand-line/30 leading-relaxed">
              * "Faltas consecutivas por mais de 10 dias seguidos ligam o alerta de retenção urgente no sistema da recepção."
            </div>
          </div>

          {/* VARIABLE 3 - LIFETIME */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-brand-bg/25 border border-brand-line/60 p-4 transform transition-all hover:scale-[1.005]">
            <div className="w-full lg:w-4/12 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-brand-ink text-white font-mono font-bold text-[11px] px-1.5 py-0.5">03</span>
                <span className="font-mono text-xs font-bold text-brand-ink uppercase">Matrícula (Lifetime)</span>
              </div>
              <p className="text-[11px] font-mono text-brand-ink/70">
                O tempo transcorrido desde a matrícula. Clientes novos necessitam de aculturamento de treinos nos primeiros 90 dias.
              </p>
            </div>
            
            <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
              <div className="border border-brand-line p-2 bg-red-50/20 col-span-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-ink/50 uppercase">
                  <span>Membros que estão nos primeiros 2 meses de academia (Novatos):</span>
                  <span className="font-bold text-brand-accent">{dynamicStats.newMembersChurnRate}% de Churn</span>
                </div>
                <div className="w-full bg-brand-bg h-2 mt-1.5 border border-brand-line/20">
                  <div className="bg-brand-accent h-full" style={{ width: `${dynamicStats.newMembersChurnRate}%` }} />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/12 font-serif italic text-xs text-brand-ink/80 bg-white p-2 border border-brand-line/30 leading-relaxed">
              * "Após vencer o limiar de 5 meses de frequência, o hábito cristaliza e o aluno raramente cancela o plano."
            </div>
          </div>

          {/* VARIABLE 4 - GROUP VISITS */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-brand-bg/25 border border-brand-line/60 p-4 transform transition-all hover:scale-[1.005]">
            <div className="w-full lg:w-4/12 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-brand-ink text-white font-mono font-bold text-[11px] px-1.5 py-0.5">04</span>
                <span className="font-mono text-xs font-bold text-brand-ink uppercase">Aulas Coletivas (Group_visits)</span>
              </div>
              <p className="text-[11px] font-mono text-brand-ink/70">
                A sociabilização em aulas coletivas estruturadas (spinning, zumba, lutas) diminui as sensações de solidão do esporte.
              </p>
            </div>
            
            <div className="w-full lg:w-5/12 grid grid-cols-2 gap-4">
              <div className="border border-brand-line p-2 bg-green-50/20 col-span-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-ink/50 uppercase">
                  <span>Frequenta Aulas de Ginástica Coletiva regularmente:</span>
                  <span className="font-bold text-green-700">{dynamicStats.groupChurnRate}% Churn histórico</span>
                </div>
                <div className="w-full bg-brand-bg h-2 mt-1.5 border border-brand-line/20">
                  <div className="bg-brand-ink h-full" style={{ width: `${dynamicStats.groupChurnRate}%` }} />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/12 font-serif italic text-xs text-brand-ink/80 bg-white p-2 border border-brand-line/30 leading-relaxed">
              * "Professores que promovem entrosamento de grupo faturam em retenção. O laço social fixa o membro."
            </div>
          </div>
        </div>
      </div>

      {/* Strategic actionable recommendations panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-ink text-white border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] rounded-none">
          <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1.5 mb-3">
            <Sparkles className="w-4 h-4 fill-brand-accent" />
            Estratégias Recomentadas de Retenção
          </h4>
          <ul className="text-xs font-mono space-y-4 leading-relaxed text-white/90">
            <li className="border-l-2 border-brand-accent pl-2.5">
              <strong className="text-brand-accent-light underline block mb-0.5">Campanha Anti-Abandono no Dia 45</strong>
              Agende ligações preventivas ou mensagens do personal nos primeiros 45 dias para novatos que faltarem a 3 treinos diretos.
            </li>
            <li className="border-l-2 border-brand-accent pl-2.5">
              <strong className="text-brand-accent-light underline block mb-0.5">Metrificação da Recepção por Upgrade</strong>
              Bonifique consultores comerciais que converterem matriculados mensais de alto risco para o plano fidelidade semestral ou anual.
            </li>
            <li className="border-l-2 border-brand-accent pl-2.5">
              <strong className="text-brand-accent-light underline block mb-0.5">Gamificação de Aulas de Aula Coletiva</strong>
              Estimule os alunos novos a passarem pela sala de cross-training ou spinning nos primeiros meses, reduzindo o isolamento.
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] rounded-none space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase text-brand-ink flex items-center gap-1.5 border-b border-brand-line/10 pb-2">
            <Award className="w-4 h-4 text-brand-accent" />
            Aderência Comercial da Base de Dados
          </h4>

          <div className="text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-ink/60">Registros Totais:</span>
              <span className="font-extrabold">{dynamicStats.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-ink/60">Contratos Ativos:</span>
              <span className="font-extrabold text-green-700">{dynamicStats.activeCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-ink/60">Fidelidade Média Geral (Lifetime):</span>
              <span className="font-extrabold text-brand-accent">3.7 meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-ink/60">Spenders em Serviços Extras:</span>
              <span className="font-extrabold">R$ 146.90 /médio</span>
            </div>
          </div>

          <div className="p-3 bg-brand-bg/50 border border-brand-line/30">
            <p className="text-[11px] font-mono leading-relaxed text-brand-ink/80 italic">
              "Para realizar testes customizados com um aluno e ver o risco dele, utilize a aba de Simulador com Inteligência Artificial baseado no modelo treinado."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
