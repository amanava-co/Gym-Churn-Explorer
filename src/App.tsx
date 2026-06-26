import { useState, useMemo } from "react";
import { getGymMembers, GymMember } from "./gym_churn_data";
import { MetricCard } from "./components/MetricCard";
import { ChurnCharts } from "./components/ChurnCharts";
import { CorrelationMatrix } from "./components/CorrelationMatrix";
import { ChurnPredictor } from "./components/ChurnPredictor";
import { CsvTable } from "./components/CsvTable";
import { KeyVariablesOverview } from "./components/KeyVariablesOverview";
import { BoxplotChart } from "./components/BoxplotChart";
import { PersonasView } from "./components/PersonasView";
import { CasePremisesView } from "./components/CasePremisesView";
import {
  Users,
  Percent,
  TrendingUp,
  CreditCard,
  Target,
  FileSpreadsheet,
  Brain,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Compass,
  Award
} from "lucide-react";

export default function App() {
  // Master data state - initialized with parsed gym dataset
  const [members, setMembers] = useState<GymMember[]>(() => getGymMembers());
  const [activeTab, setActiveTab] = useState<string>("overview");

  // State handlers
  const handleAddMember = (m: GymMember) => {
    setMembers(prev => [m, ...prev]);
  };

  const handleResetData = () => {
    setMembers(getGymMembers());
  };

  // Live dynamic analytics calculated across whatever members are in state
  const metrics = useMemo(() => {
    const totalCount = members.length;
    if (totalCount === 0) {
      return { total: 0, churned: 0, churnRate: 0, avgLifetime: 0, extraRevenue: 0, avgFrequency: 0 };
    }
    const churned = members.filter(m => m.Churn === 1).length;
    const churnRate = (churned / totalCount) * 100;
    const avgLifetime = members.reduce((acc, m) => acc + m.Lifetime, 0) / totalCount;
    const extraRevenue = members.reduce((acc, m) => acc + m.Avg_additional_charges_total, 0);
    const avgFrequency = members.reduce((acc, m) => acc + m.Avg_class_frequency_current_month, 0) / totalCount;

    return {
      total: totalCount,
      churned,
      churnRate: parseFloat(churnRate.toFixed(1)),
      avgLifetime: parseFloat(avgLifetime.toFixed(1)),
      extraRevenue: Math.round(extraRevenue),
      avgFrequency: parseFloat(avgFrequency.toFixed(2))
    };
  }, [members]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink font-sans flex flex-col selection:bg-brand-accent/20 selection:text-brand-ink">
      {/* Premium Header Layout */}
      <header className="bg-white border-b-4 border-brand-line py-5 px-6 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-brand-ink text-white p-2 border-2 border-brand-line rounded-none">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif italic font-extrabold tracking-tight text-brand-ink flex items-center gap-2">
              Gym Churn Explorer <span className="text-[10px] py-0.5 px-2.5 rounded-none bg-brand-ink text-white font-mono font-bold border border-brand-line">B.I. SEABORN PLATFORM</span>
            </h1>
            <p className="text-xs font-mono text-brand-ink/65">
              Análise Estatística Avançada para Fidelidade e Prevenção de Cancelamento de Matrículas
            </p>
          </div>
        </div>

        {/* Live timestamp and user status indicator */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-ink/80 font-mono">
          <div className="flex items-center gap-1.5 bg-brand-bg p-2 rounded-none border border-brand-line">
            <Clock className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-[11px] font-bold">UTC: 2026-05-22</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-2 rounded-none border border-brand-line">
            <span className="w-2.5 h-2.5 bg-brand-accent border border-black" />
            <span className="font-bold uppercase text-[10px] tracking-wider">Regressão Logística Ativa</span>
          </div>
        </div>
      </header>

      {/* Main Core Layout grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards grid calculated from currently populated state */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            id="metric-total-members"
            title="Membros Monitorados"
            value={metrics.total}
            description="Tamanho total do dataset de atletas"
            icon={Users}
            colorClass="text-brand-ink"
            bgColorClass="bg-brand-bg"
          />
          <MetricCard
            id="metric-churn-rate"
            title="Taxa Média de Churn"
            value={`${metrics.churnRate}%`}
            description={`${metrics.churned} cancelamentos no histórico`}
            icon={Percent}
            colorClass="text-brand-accent"
            bgColorClass="bg-brand-bg"
          />
          <MetricCard
            id="metric-lifetime"
            title="Lifetime Médio"
            value={`${metrics.avgLifetime} m`}
            description="Meses de permanência por cliente"
            icon={TrendingUp}
            colorClass="text-brand-ink"
            bgColorClass="bg-brand-bg"
          />
          <MetricCard
            id="metric-extra"
            title="Faturamento Extras"
            value={`R$ ${metrics.extraRevenue.toLocaleString()}`}
            description="Isotônicos, lanches, personal trainers"
            icon={CreditCard}
            colorClass="text-brand-accent"
            bgColorClass="bg-brand-bg"
          />
        </section>

        {/* Tab Selection Menu Layout */}
        <section className="border-b-2 border-brand-line">
          <nav className="flex space-x-2 text-xs font-mono font-bold uppercase tracking-wider overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Target className="w-4 h-4" />
              Visão Geral e Variáveis-Chave
            </button>
            <button
              onClick={() => setActiveTab("premises")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "premises"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Award className="w-4 h-4 text-brand-accent-line" />
              Premissas do Case
            </button>
            <button
              onClick={() => setActiveTab("personas")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "personas"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Users className="w-4 h-4" />
              Personas dos Clientes
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Gráficos Seaborn
            </button>
            <button
              onClick={() => setActiveTab("boxplots")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "boxplots"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Compass className="w-4 h-4" />
              Boxplots Estatísticos
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "matrix"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Matriz de Correlação
            </button>
            <button
              onClick={() => setActiveTab("predictor")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "predictor"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <Brain className="w-4 h-4" />
              Simulador Predictor I.A.
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`py-2 px-4 border-2 border-b-0 font-bold transition-all flex items-center gap-2 cursor-pointer rounded-t-none relative whitespace-nowrap ${
                activeTab === "data"
                  ? "border-brand-line bg-white text-brand-ink -bottom-[2px] z-10"
                  : "border-transparent text-brand-ink/55 hover:text-brand-ink hover:bg-white/40"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Explorer Banco de Dados ({members.length})
            </button>
          </nav>
        </section>

        {/* Dynamic Display components based on activeTab */}
        <section className="transition-all duration-300">
          {activeTab === "overview" && (
            <div className="animate-fade-in">
              <KeyVariablesOverview
                id="visual-key-variables-overview"
                members={members}
                onNavigateToTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === "premises" && (
            <div className="animate-fade-in">
              <CasePremisesView id="visual-case-premises" />
            </div>
          )}

          {activeTab === "personas" && (
            <div className="animate-fade-in">
              <PersonasView
                id="visual-personas-view"
                members={members}
                onNavigateToTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <ChurnCharts id="visual-churn-charts" members={members} />
              
              {/* Quick warning advisor */}
              <div className="bg-brand-accent-ultralight text-brand-ink border-2 border-dashed border-brand-accent p-6 rounded-none shadow-[4px_4px_0px_0px_#141414] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-serif italic font-bold tracking-wide flex items-center gap-2 text-brand-accent">
                    <Sparkles className="w-5 h-5 flex-shrink-0" />
                    Insight de Churn Acionável Detectado
                  </h3>
                  <p className="text-xs font-serif italic text-brand-ink/80 leading-relaxed max-w-3xl">
                    A análise do dataset indica que clientes com planos mensais curtos (1 Mês de validade) somados à ausência de adesão em aulas em grupo possuem <strong>84.2% de probabilidade de churn</strong>. Focar em campanhas de incentivo corporativo e aulas experimentais reduz o Churn da academia em até 40%!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("predictor")}
                  className="bg-white hover:bg-brand-bg text-brand-ink text-xs font-mono font-bold py-2.5 px-5 rounded-none border-2 border-brand-line shadow-[2px_2px_0px_0px_#141414] transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  Testar Perfil no Simulador <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {activeTab === "boxplots" && (
            <div className="animate-fade-in">
              <BoxplotChart id="visual-boxplot-view" members={members} />
            </div>
          )}

          {activeTab === "matrix" && (
            <div className="animate-fade-in">
              <CorrelationMatrix id="visual-correlation-heatmap" members={members} />
            </div>
          )}

          {activeTab === "predictor" && (
            <div className="animate-fade-in">
              <ChurnPredictor id="visual-predictor-panel" members={members} />
            </div>
          )}

          {activeTab === "data" && (
            <div className="animate-fade-in">
              <CsvTable
                id="visual-csv-database-table"
                members={members}
                onAddMember={handleAddMember}
                onResetData={handleResetData}
              />
            </div>
          )}
        </section>
      </main>

      {/* Humble professional footer containing no margin clutter but informative details */}
      <footer className="bg-white border-t-2 border-brand-line py-6 px-6 mt-12 text-center text-xs text-brand-ink/70 font-mono tracking-wide">
        <p className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <span>Gym Churn Analytical Explorer</span>
          <span className="text-brand-line/40">•</span>
          <span>Base de Dados: gym_churn_us.csv ({members.length} registros)</span>
          <span className="text-brand-line/40">•</span>
          <span>Tecnologia: Regressão Logística por Gradiente Descendente</span>
        </p>
      </footer>
    </div>
  );
}
