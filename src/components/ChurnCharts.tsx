import { useState, useMemo } from "react";
import { GymMember } from "../gym_churn_data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import { BarChart3, TrendingDown, Users, Calendar, Compass, Layers, Info } from "lucide-react";

interface ChurnChartsProps {
  id: string;
  members: GymMember[];
}

interface VariableConfig {
  key: keyof GymMember;
  label: string;
  type: "categorical" | "numerical";
  categories?: { [key: number]: string };
  unit?: string;
  description: string;
}

const variablesConfig: VariableConfig[] = [
  { 
    key: "gender", 
    label: "Gênero de Cadastro", 
    type: "categorical", 
    categories: { 0: "Gênero 0 (Feminino)", 1: "Gênero 1 (Masculino)" },
    description: "Distribuição e taxa de cancelamento entre os gêneros declarados no cadastro dos integrantes."
  },
  { 
    key: "Near_Location", 
    label: "Mora/Trabalha Perto (Near)", 
    type: "categorical", 
    categories: { 0: "Membro Longe", 1: "Mundo Perto (Near_Location)" },
    description: "Pesquisa se a proximidade geográfica da casa ou trabalho do aluno influencia diretamente seu abandono."
  },
  { 
    key: "Partner", 
    label: "Parceiro de Empresa Conveniada", 
    type: "categorical", 
    categories: { 0: "Sem Desconto Conveniado", 1: "Conveniado (Partner)" },
    description: "Compara membros cuja empresa possui parceria corporativa subvencionando a academia vs adesões comuns."
  },
  { 
    key: "Promo_friends", 
    label: "Promoção 'Indique um Amigo'", 
    type: "categorical", 
    categories: { 0: "Cadastro Orgânico", 1: "Entrou via Convite de Amigo" },
    description: "Taxa de churn de voluntários vindos através de campanhas promocionais de recomendação de colegas."
  },
  { 
    key: "Phone", 
    label: "Disponibilidade de Telefone", 
    type: "categorical", 
    categories: { 0: "Telefone Não Cadastrado", 1: "Possui Celular Registrado" },
    description: "Avalia se a presença de dados de contato atualizados aponta maior sociabilidade ou alcance da academia."
  },
  { 
    key: "Contract_period", 
    label: "Período do Contrato", 
    type: "categorical", 
    categories: { 1: "1 Mês (Mensal)", 6: "6 Meses (Semestral)", 12: "12 Meses (Anual)" },
    description: "Uma das variáveis mais impactantes na evasão de assinaturas. Prazos estendidos mostram fidelidade absoluta."
  },
  { 
    key: "Group_visits", 
    label: "Aulas de Ginástica Coletiva", 
    type: "categorical", 
    categories: { 0: "Não faz Aulas em Grupo", 1: "Treina Aulas em Grupo" },
    description: "Análise quantitativa do hábito de assistir à aulas em grupos programados de exercícios estruturados."
  },
  { 
    key: "Age", 
    label: "Idade dos Clientes", 
    type: "numerical", 
    unit: " anos",
    description: "Curva cronológica dos associados. A idade costuma ser um fator estabilizador chave no comportamento de assiduidade."
  },
  { 
    key: "Avg_additional_charges_total", 
    label: "Gastos Extras Financeiros", 
    type: "numerical", 
    unit: " R$",
    description: "Faturamento médio secundário obtido através desta pessoa em lanchonete, barras de proteína, personal ou spa."
  },
  { 
    key: "Month_to_end_contract", 
    label: "Meses para Término do Plano", 
    type: "numerical", 
    unit: " meses",
    description: "Fator contratual dinâmico que contabiliza o tempo estrito restante até a renovação compulsória de plano."
  },
  { 
    key: "Lifetime", 
    label: "Fidelidade de Matrícula (Lifetime)", 
    type: "numerical", 
    unit: " meses",
    description: "Fator clássico que contabiliza a antiguidade de inscrição e meses constantes frequentando as dependências."
  },
  { 
    key: "Avg_class_frequency_total", 
    label: "Frequência Semanal Total", 
    type: "numerical", 
    unit: " treinos/sem",
    description: "Frequência média semanal geral acumulativa desde o primeiro momento pós ativação de contrato."
  },
  { 
    key: "Avg_class_frequency_current_month", 
    label: "Frequência Semanal Mês Atual", 
    type: "numerical", 
    unit: " treinos/sem",
    description: "A queda de visitas à academia em curto prazo serve como gatilho prioritário de predição de churn."
  }
];

export function ChurnCharts({ id, members }: ChurnChartsProps) {
  const [activeChartTab, setActiveChartTab] = useState<string>("all_variables");
  const [selectedVariable, setSelectedVariable] = useState<keyof GymMember>("Contract_period");

  // Re-compute static presets for standard tabs to keep user experience intact
  const chartData = useMemo(() => {
    const churned = members.filter(m => m.Churn === 1);
    const active = members.filter(m => m.Churn === 0);

    const avgFreqActive = active.reduce((acc, m) => acc + m.Avg_class_frequency_current_month, 0) / (active.length || 1);
    const avgFreqChurned = churned.reduce((acc, m) => acc + m.Avg_class_frequency_current_month, 0) / (churned.length || 1);

    const avgLifetimeActive = active.reduce((acc, m) => acc + m.Lifetime, 0) / (active.length || 1);
    const avgLifetimeChurned = churned.reduce((acc, m) => acc + m.Lifetime, 0) / (churned.length || 1);

    const terms = [1, 6, 12];
    const contractRates = terms.map(term => {
      const termMembers = members.filter(m => m.Contract_period === term);
      const termChurned = termMembers.filter(m => m.Churn === 1);
      const rate = (termChurned.length / (termMembers.length || 1)) * 100;
      return {
        name: term === 1 ? "1 Mês" : `${term} Meses`,
        "Taxa de Churn (%)": parseFloat(rate.toFixed(1)),
        count: termMembers.length
      };
    });

    const groupNo = members.filter(m => m.Group_visits === 0);
    const groupYes = members.filter(m => m.Group_visits === 1);
    const rateGroupNo = (groupNo.filter(m => m.Churn === 1).length / (groupNo.length || 1)) * 100;
    const rateGroupYes = (groupYes.filter(m => m.Churn === 1).length / (groupYes.length || 1)) * 100;

    const groupRates = [
      { name: "Sem Aulas", "Taxa de Churn (%)": parseFloat(rateGroupNo.toFixed(1)) },
      { name: "Com Aulas", "Taxa de Churn (%)": parseFloat(rateGroupYes.toFixed(1)) }
    ];

    const scatterData = [...members]
      .sort(() => 0.5 - Math.random())
      .slice(0, 150)
      .map(m => ({
        x: m.Lifetime,
        y: parseFloat(m.Avg_class_frequency_current_month.toFixed(2)),
        churn: m.Churn,
        name: m.Churn === 1 ? "Cancelou" : "Ativo",
        genderLabel: m.gender === 1 ? "H" : "M",
        age: m.Age,
        charges: parseFloat(m.Avg_additional_charges_total.toFixed(0))
      }));

    return {
      frequencyVsChurn: [
        { name: "Ativos (Fieis)", "Frequência Semanal Média": parseFloat(avgFreqActive.toFixed(2)) },
        { name: "Cancelados (Churn)", "Frequência Semanal Média": parseFloat(avgFreqChurned.toFixed(2)) }
      ],
      lifetimeVsChurn: [
        { name: "Ativos (Fieis)", "Meses de Fidelidade": parseFloat(avgLifetimeActive.toFixed(2)) },
        { name: "Cancelados (Churn)", "Meses de Fidelidade": parseFloat(avgLifetimeChurned.toFixed(2)) }
      ],
      contractRates,
      groupRates,
      scatterData
    };
  }, [members]);

  // Compute stats and percentages for the custom chosen feature dynamically
  const variableAnalysis = useMemo(() => {
    const config = variablesConfig.find(v => v.key === selectedVariable) || variablesConfig[5];
    const churned = members.filter(m => m.Churn === 1);
    const active = members.filter(m => m.Churn === 0);

    if (config.type === "numerical") {
      const valuesActive = active.map(m => m[config.key] as number);
      const valuesChurned = churned.map(m => m[config.key] as number);

      const meanActive = valuesActive.length ? valuesActive.reduce((acc, v) => acc + v, 0) / valuesActive.length : 0;
      const meanChurned = valuesChurned.length ? valuesChurned.reduce((acc, v) => acc + v, 0) / valuesChurned.length : 0;

      const sortedActive = [...valuesActive].sort((a, b) => a - b);
      const sortedChurned = [...valuesChurned].sort((a, b) => a - b);

      const getMedian = (arr: number[]) => {
        if (!arr.length) return 0;
        const mid = Math.floor(arr.length / 2);
        return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
      };

      const getStd = (arr: number[], mean: number) => {
        if (!arr.length) return 0;
        const sumSq = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
        return Math.sqrt(sumSq / arr.length);
      };

      const statsActive = {
        count: active.length,
        mean: meanActive,
        median: getMedian(sortedActive),
        min: valuesActive.length ? Math.min(...valuesActive) : 0,
        max: valuesActive.length ? Math.max(...valuesActive) : 0,
        std: getStd(valuesActive, meanActive)
      };

      const statsChurned = {
        count: churned.length,
        mean: meanChurned,
        median: getMedian(sortedChurned),
        min: valuesChurned.length ? Math.min(...valuesChurned) : 0,
        max: valuesChurned.length ? Math.max(...valuesChurned) : 0,
        std: getStd(valuesChurned, meanChurned)
      };

      return {
        config,
        chartData: [
          { label: "Membros Ativos", "Valor Médio": parseFloat(meanActive.toFixed(2)) },
          { label: "Cancelados (Churn)", "Valor Médio": parseFloat(meanChurned.toFixed(2)) }
        ],
        statsActive,
        statsChurned
      };
    } else {
      const categories = config.categories || {};
      const uniqueValues = Array.from(new Set(members.map(m => m[config.key] as number))).sort((a, b) => a - b);

      const categoryRates = uniqueValues.map(val => {
        const catMembers = members.filter(m => m[config.key] === val);
        const catChurned = catMembers.filter(m => m.Churn === 1);
        const rate = catMembers.length ? (catChurned.length / catMembers.length) * 100 : 0;
        const name = categories[val] !== undefined ? categories[val] : `Valor ${val}`;

        return {
          name,
          "Taxa de Churn (%)": parseFloat(rate.toFixed(1)),
          ativos: catMembers.filter(m => m.Churn === 0).length,
          churns: catChurned.length,
          total: catMembers.length
        };
      });

      return {
        config,
        categoryRates
      };
    }
  }, [members, selectedVariable]);

  const currentConfig = useMemo(() => {
    return variablesConfig.find(v => v.key === selectedVariable) || variablesConfig[5];
  }, [selectedVariable]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-ink text-white border-2 border-brand-line p-3 rounded-none text-xs font-mono">
          <p className="font-bold underline mb-1">{label}</p>
          {payload.map((pld: any, idx: number) => (
            <p key={idx} className="flex items-center gap-1.5" style={{ color: pld.color || "#F27D26" }}>
              <span className="w-2.5 h-2.5 bg-brand-accent-light inline-block" />
              {pld.name}: {pld.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipAverages = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-ink text-white border-2 border-brand-line p-3 rounded-none text-xs font-mono">
          <p className="font-bold underline mb-1">{label}</p>
          {payload.map((pld: any, idx: number) => (
            <p key={idx} className="flex items-center gap-1.5" style={{ color: pld.color || "#F27D26" }}>
              <span className="w-2.5 h-2.5 bg-brand-accent inline-block" />
              {pld.name}: {pld.value} {currentConfig.unit || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-ink text-white border-2 border-brand-line p-3 rounded-none text-xs font-mono space-y-1">
          <p className="font-bold border-b border-white/20 pb-1" style={{ color: data.churn === 1 ? "#F27D26" : "#ffffff" }}>
            Membro: {data.name}
          </p>
          <p>• Lifetime: {data.x} meses</p>
          <p>• Freq. Atual: {data.y} vezes/sem</p>
          <p>• Gastos Extras: R$ {data.charges}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id={id} className="bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414]">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
        <div>
          <h3 className="text-base font-serif italic font-bold text-brand-ink flex items-center gap-2">
            <span className="bg-brand-accent/10 text-brand-accent p-1 text-xs border border-brand-accent/20">MUITAS VARIÁVEIS</span>
            Painel de Exploração Gráfica e Correlações
          </h3>
          <p className="text-xs font-mono text-brand-ink/65 mt-1">
            Gráficos interativos cobrindo a distribuição da base de membros da academia em relação ao abandono.
          </p>
        </div>

        {/* Tab Controllers */}
        <div className="flex flex-wrap gap-1 bg-brand-bg/40 p-1 border border-brand-line self-start">
          {[
            { id: "all_variables", label: "Tudo Sobre Churn (13 Variáveis) 🔥", icon: Layers },
            { id: "frequencies", label: "Frequência Semanal", icon: BarChart3 },
            { id: "lifetime", label: "Fidelidade (Lifetime)", icon: TrendingDown },
            { id: "contracts", label: "Tempo de Plano", icon: Calendar },
            { id: "group", label: "Aulas Coletivas", icon: Users },
            { id: "dispersion", label: "Dispersão (Clusters)", icon: Compass }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeChartTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id)}
                className={`py-1.5 px-3 rounded-none text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isTabActive
                    ? "bg-brand-accent text-white border-brand-line shadow-[2px_2px_0px_0px_#141414]"
                    : "text-brand-ink hover:bg-brand-accent-ultralight border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2]" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeChartTab === "all_variables" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-bg/60 border-2 border-brand-line p-4">
            <div className="flex flex-col justify-center">
              <label className="block text-xs font-mono font-bold uppercase text-brand-ink mb-1.5 flex items-center gap-1">
                <span>1. Escolha Qualquer Característica:</span>
              </label>
              <select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value as keyof GymMember)}
                className="w-full bg-white border-2 border-brand-line p-2.5 text-xs font-mono font-bold text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-none cursor-pointer shadow-[2px_2px_0px_0px_#141414]"
              >
                {variablesConfig.map((v) => (
                  <option key={v.key} value={v.key}>
                    {v.label} {v.type === "categorical" ? "(Categórica)" : "(Numérica)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-start gap-2.5 bg-white p-3 border border-brand-line">
              <Info className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs font-mono leading-relaxed">
                <span className="font-bold underline text-brand-accent block mb-0.5">Explicação Teórica</span>
                <span className="text-brand-ink/80">{currentConfig.description}</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4 border-2 border-brand-line p-2 bg-[#fbfbfb]">
            <ResponsiveContainer width="100%" height="100%">
              {currentConfig.type === "numerical" ? (
                <BarChart data={variableAnalysis.chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                  <XAxis dataKey="label" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                  <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                  <Tooltip content={<CustomTooltipAverages />} cursor={false} />
                  <Bar dataKey="Valor Médio" maxBarSize={70} stroke="#141414" strokeWidth={1}>
                    <Cell fill="#141414" />
                    <Cell fill="#F27D26" />
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={variableAnalysis.categoryRates} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                  <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit="%" />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="Taxa de Churn (%)" maxBarSize={70} stroke="#141414" strokeWidth={1}>
                    {variableAnalysis.categoryRates?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#141414" : "#F27D26"} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {currentConfig.type === "numerical" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-brand-line bg-white p-3 text-xs font-mono shadow-[2px_2px_0px_0px_#141414]">
                <div className="font-bold underline text-brand-ink mb-1.5 flex items-center justify-between">
                  <span>🟢 MEMBROS ATIVOS</span>
                  <span className="bg-brand-ink/5 px-2 py-0.5 border border-brand-line/20 text-[10px]">Contagem: {variableAnalysis.statsActive?.count}</span>
                </div>
                <div className="space-y-1 text-brand-ink/90">
                  <p>• Valor Médio: <strong className="font-bold text-brand-ink">{variableAnalysis.statsActive?.mean.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Mediana: <strong className="font-bold">{variableAnalysis.statsActive?.median.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Desvio Padrão (std): <strong className="font-bold">{variableAnalysis.statsActive?.std.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Extremos de Min/Max: <strong className="font-bold text-[11px]">{variableAnalysis.statsActive?.min.toFixed(1)} até {variableAnalysis.statsActive?.max.toFixed(1)}{currentConfig.unit}</strong></p>
                </div>
              </div>
              <div className="border-2 border-brand-line bg-brand-accent-ultralight/20 p-3 text-xs font-mono shadow-[2px_2px_0px_0px_#141414]">
                <div className="font-bold underline text-brand-accent mb-1.5 flex items-center justify-between">
                  <span>🔴 MEMBROS EVADIDOS (CHURN)</span>
                  <span className="bg-brand-accent/5 px-2 py-0.5 border border-brand-accent/20 text-brand-accent text-[10px]">Contagem: {variableAnalysis.statsChurned?.count}</span>
                </div>
                <div className="space-y-1 text-brand-ink/95">
                  <p>• Valor Médio: <strong className="font-bold text-brand-accent">{variableAnalysis.statsChurned?.mean.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Mediana: <strong className="font-bold">{variableAnalysis.statsChurned?.median.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Desvio Padrão (std): <strong className="font-bold">{variableAnalysis.statsChurned?.std.toFixed(2)}{currentConfig.unit}</strong></p>
                  <p>• Extremos de Min/Max: <strong className="font-bold text-[11px]">{variableAnalysis.statsChurned?.min.toFixed(1)} até {variableAnalysis.statsChurned?.max.toFixed(1)}{currentConfig.unit}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-brand-line bg-white shadow-[2px_2px_0px_0px_#141414] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-ink text-white border-b-2 border-brand-line text-[10px] uppercase tracking-wider">
                    <th className="p-2 border-r border-brand-line/30">Grupos da Característica ({currentConfig.label})</th>
                    <th className="p-2 border-r border-brand-line/30 text-center">Registrados Totais (N)</th>
                    <th className="p-2 border-r border-brand-line/30 text-center">Permaneceram (Ativos)</th>
                    <th className="p-2 border-r border-brand-line/30 text-center">Cancelaram (Churn)</th>
                    <th className="p-2 text-center text-brand-accent-light">Taxa de Churn Efetiva</th>
                  </tr>
                </thead>
                <tbody>
                  {variableAnalysis.categoryRates?.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-brand-line/20 hover:bg-brand-bg/40 text-[11px]">
                      <td className="p-2 font-bold border-r border-brand-line/20">{row.name}</td>
                      <td className="p-2 text-center border-r border-brand-line/20">{row.total}</td>
                      <td className="p-2 text-center border-r border-brand-line/20 text-green-700 font-bold">{row.ativos}</td>
                      <td className="p-2 text-center border-r border-brand-line/20 text-brand-accent font-bold">{row.churns}</td>
                      <td className="p-2 text-center font-bold bg-brand-accent-ultralight/20 text-brand-accent text-xs">
                        {row["Taxa de Churn (%)"]}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Primary Chart Area */}
      <div className="w-full">
        {activeChartTab === "frequencies" && (
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.frequencyVsChurn} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit="/w" />
                <Tooltip content={<CustomTooltipAverages />} cursor={false} />
                <Bar dataKey="Frequência Semanal Média" maxBarSize={70} stroke="#141414" strokeWidth={1}>
                  <Cell fill="#141414" />
                  <Cell fill="#F27D26" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartTab === "lifetime" && (
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.lifetimeVsChurn} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit=" m" />
                <Tooltip content={<CustomTooltipAverages />} cursor={false} />
                <Bar dataKey="Meses de Fidelidade" maxBarSize={70} stroke="#141414" strokeWidth={1}>
                  <Cell fill="#141414" />
                  <Cell fill="#F27D26" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartTab === "contracts" && (
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.contractRates} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit="%" />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="Taxa de Churn (%)" maxBarSize={75} stroke="#141414" strokeWidth={1}>
                  {chartData.contractRates.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={idx === 0 ? "#F27D26" : idx === 1 ? "rgba(242, 125, 38, 0.5)" : "#141414"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartTab === "group" && (
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.groupRates} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" />
                <YAxis stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit="%" />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="Taxa de Churn (%)" maxBarSize={80} stroke="#141414" strokeWidth={1}>
                  <Cell fill="#F27D26" />
                  <Cell fill="#141414" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartTab === "dispersion" && (
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -25, bottom: 10 }}>
                <XAxis type="number" dataKey="x" name="Lifetime" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit=" m" label={{ value: 'Lifetime (Meses)', position: 'insideBottom', offset: -4, fill: '#141414', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis type="number" dataKey="y" name="Frequência" stroke="#141414" fontSize={11} tickLine={true} axisLine={true} className="font-mono" unit="/w" label={{ value: 'Freq/w', angle: -90, position: 'insideLeft', offset: 10, fill: '#141414', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '2 2', stroke: '#141414' }} />
                <Scatter name="Membros" data={chartData.scatterData}>
                  {chartData.scatterData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.churn === 1 ? "#F27D26" : "#141414"} fillOpacity={0.8} stroke="#141414" strokeWidth={1} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Explanatory description card matching seaborn comments */}
      <div className="mt-4 pt-4 border-t border-brand-line border-dashed flex flex-col md:flex-row justify-between text-[11px] text-brand-ink/80 gap-3 font-mono">
        <div className="flex-1">
          {activeChartTab === "all_variables" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> Este modo permite realizar cruzamentos e descriptivas customizadas com todas as {variablesConfig.length} variáveis do dataset <code>gym_churn_us.csv</code> de forma instantânea.</span>
          )}
          {activeChartTab === "frequencies" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> Clientes em Churn ativo possuem comportamento muito menos frequente (média de treinos abaixo de 1 vez na semana no mês atual).</span>
          )}
          {activeChartTab === "lifetime" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> Clientes com alto Lifetime (fidelidade de vários meses) permanecem na academia de forma consistente.</span>
          )}
          {activeChartTab === "contracts" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> Planos mensais de curta duração têm Churn gigante, enquanto pacotes anuais de 12 meses fixam o atleta com segurança.</span>
          )}
          {activeChartTab === "group" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> A interação social e amizades formadas através de aulas em grupo atuam diretamente na fidelidade do cliente de academia.</span>
          )}
          {activeChartTab === "dispersion" && (
            <span>💡 <strong className="font-bold underline">Comentário Técnico:</strong> O scatterplot exibe dois agrupamentos estatísticos clássicos: fidelizados no topo direito e canceladores no canto inferior esquerdo.</span>
          )}
        </div>
        {(activeChartTab === "dispersion" || activeChartTab === "all_variables") && (
          <div className="flex items-center gap-3 text-[10px] self-end md:self-auto flex-shrink-0 bg-brand-bg p-1 px-2 border border-brand-line">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-ink border border-white" /> Ativos</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#F27D26] border border-white" /> Churned</span>
          </div>
        )}
      </div>
    </div>
  );
}
