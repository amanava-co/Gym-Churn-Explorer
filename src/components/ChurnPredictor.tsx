import { useState, useEffect, useMemo } from "react";
import { GymMember, getTrainedPredictor, LogisticRegression } from "../gym_churn_data";
import { Sparkles, BrainCircuit, UserCheck, ShieldAlert, Award, FileCode } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface ChurnPredictorProps {
  id: string;
  members: GymMember[];
}

export function ChurnPredictor({ id, members }: ChurnPredictorProps) {
  // Simulator state
  const [formData, setFormData] = useState<Partial<GymMember>>({
    gender: 1,
    Near_Location: 1,
    Partner: 1,
    Promo_friends: 0,
    Phone: 1,
    Contract_period: 1,
    Group_visits: 0,
    Age: 28,
    Avg_additional_charges_total: 100,
    Month_to_end_contract: 1,
    Lifetime: 2,
    Avg_class_frequency_total: 1.8,
    Avg_class_frequency_current_month: 1.2
  });

  const [predictorModel, setPredictorModel] = useState<LogisticRegression | null>(null);
  const [probValue, setProbValue] = useState<number>(0.65);

  // Retrain predictor if data rows update
  useEffect(() => {
    try {
      const trained = getTrainedPredictor();
      setPredictorModel(trained);
    } catch (e) {
      console.error("Erro ao treinar modelo regressivo", e);
    }
  }, [members]);

  // Recalculate churn probability
  useEffect(() => {
    if (predictorModel) {
      const p = predictorModel.predict(formData);
      setProbValue(p);
    }
  }, [formData, predictorModel]);

  const handleChange = (key: keyof GymMember, val: number) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: val };
      // Keep month to end contract <= contract period
      if (key === "Contract_period") {
        if (updated.Month_to_end_contract && updated.Month_to_end_contract > val) {
          updated.Month_to_end_contract = val;
        }
      }
      return updated;
    });
  };

  const getRiskStatus = (p: number) => {
    if (p < 0.25) return { label: "Muito Baixo Risco", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", icon: UserCheck };
    if (p < 0.5) return { label: "Baixo Risco", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", icon: UserCheck };
    if (p < 0.75) return { label: "Risco Moderado", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", icon: ShieldAlert };
    return { label: "Alto Risco de Churn", color: "text-red-500", bg: "bg-red-50", border: "border-red-200", icon: ShieldAlert };
  };

  const getRetentionTactic = (member: Partial<GymMember>, prob: number) => {
    if (prob < 0.35) {
      return {
        strategy: "Estratégia de Fidelização Premium",
        action: "Cliente engajado e saudável. Ofereça benefícios de parceiros de nutrição ou introduza o plano anual corporativo quando o contrato atual estiver para vencer (reduzindo custo mensal mantendo o Lifetime alto)."
      };
    }

    const tactics = [];
    if (member.Contract_period === 1) {
      tactics.push("O cliente contratou um plano mensal de curta duração. Ofereça um upgrade para o pacote de 6 ou 12 meses com desconto progressivo para estabilizar o Lifetime.");
    }
    if (member.Group_visits === 0) {
      tactics.push("Aulas em grupo têm forte correlação negativa com churn. Ofereça um 'passe experimental' para aulas de spinning, yoga, ou artes marciais coletivas gratuitamente.");
    }
    if (member.Avg_class_frequency_current_month !== undefined && member.Avg_class_frequency_current_month < 1.0) {
      tactics.push("A frequência semanal média desabou no mês atual. Dispare um e-mail acolhedor ou entre em contato via WhatsApp com um brinde de reativação ou agendamento grátis com personal trainer.");
    }
    if (member.Promo_friends === 0 && member.Partner === 0) {
      tactics.push("Membro sem descontos corporativos ou recomendações de amigos. Incentive-o a convidar um parceiro oferecendo 1 mês grátis para ambos na indicação de um amigo.");
    }

    if (tactics.length === 0) {
      tactics.push("Ofereça uma sessão bônus de bioimpedância ou serviços adicionais (massagem, bebidas isotônicas grátis) para estimular a frequência de treino.");
    }

    return {
      strategy: "Campanha de Retenção Ativa",
      action: tactics[0] // Pick the most important matching tactic
    };
  };

  const risk = getRiskStatus(probValue);
  const advice = getRetentionTactic(formData, probValue);

  // Compute SHAP values for the current form data
  const shapExplanation = useMemo(() => {
    if (!predictorModel) return null;
    return predictorModel.explain(formData);
  }, [formData, predictorModel]);

  // Generate dynamic text summary of top 3 features
  const shapSummary = useMemo(() => {
    if (!shapExplanation || shapExplanation.shapValues.length === 0) return "";
    
    // Sort by highest absolute impact
    const sorted = [...shapExplanation.shapValues].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const top3 = sorted.slice(0, 3);
    
    let summary = `A predição foi mais influenciada pela variável "${top3[0].feature}" (valor: ${top3[0].originalValue}), que ${top3[0].impact === 'positive' ? 'elevou o risco de churn' : 'reduziu o risco de churn'}. `;
    
    if (top3[1]) {
      summary += `Em seguida, a variável "${top3[1].feature}" ${top3[1].impact === 'positive' ? 'aumentou' : 'diminuiu'} a probabilidade. `;
    }
    
    if (top3[2]) {
      summary += `Por fim, "${top3[2].feature}" também teve impacto ${top3[2].impact === 'positive' ? 'positivo (aumentando o risco)' : 'negativo (retendo o cliente)'}.`;
    }
    
    return summary;
  }, [shapExplanation]);

  return (
    <div id={id} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Sliders/Form Controls */}
        <div className="lg:col-span-8 bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414]">
        <h3 className="text-base font-serif italic font-bold text-brand-ink flex items-center gap-2 mb-1">
          <BrainCircuit className="w-5 h-5 text-brand-accent" />
          Simulador Preditivo de Churn do Cliente
        </h3>
        <p className="text-xs font-mono text-brand-ink/65 mb-6">
          Ajuste as características do cliente abaixo. O modelo experimental de regressão calcula a probabilidade matemática do membro cancelar baseado nos dados históricos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Contracts & Lifetime */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono font-bold text-brand-ink uppercase tracking-widest mb-3 border-b border-brand-line pb-1.5 flex items-center gap-1.5 bg-brand-accent-ultralight py-1 px-2 border border-brand-line/20">
              <Award className="w-3.5 h-3.5 text-brand-accent" /> CONTRATO & RELACIONAMENTO
            </h4>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-brand-ink/75 font-medium">Tempo de Contrato</span>
                <span className="font-bold text-brand-accent">{formData.Contract_period} Mês(es)</span>
              </div>
              <div className="flex gap-2">
                {[1, 6, 12].map(term => (
                  <button
                    key={term}
                    onClick={() => handleChange("Contract_period", term)}
                    className={`flex-1 py-1.5 rounded-none text-xs font-mono font-bold transition-all border cursor-pointer ${
                      formData.Contract_period === term
                        ? "bg-brand-accent text-white border-brand-line shadow-[2px_2px_0px_0px_#141414]"
                        : "bg-white text-brand-ink border-brand-line hover:bg-brand-bg/40"
                    }`}
                  >
                    {term === 1 ? "1 Mês" : `${term} Meses`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Idade do Cliente</span>
                <span className="font-bold text-brand-ink">{formData.Age} anos</span>
              </div>
              <input
                type="range"
                min="18"
                max="65"
                value={formData.Age || 29}
                onChange={(e) => handleChange("Age", parseInt(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Fidelidade (Lifetime)</span>
                <span className="font-bold text-brand-ink">{formData.Lifetime} meses</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={formData.Lifetime ?? 2}
                onChange={(e) => handleChange("Lifetime", parseInt(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Meses Restantes</span>
                <span className="font-bold text-brand-ink">
                  {Math.min(formData.Month_to_end_contract || 1, formData.Contract_period || 12)} Mês(es)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={formData.Contract_period || 12}
                value={Math.min(formData.Month_to_end_contract || 1, formData.Contract_period || 12)}
                onChange={(e) => handleChange("Month_to_end_contract", parseInt(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>
          </div>

          {/* Frequencies & Charges */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono font-bold text-brand-ink uppercase tracking-widest mb-3 border-b border-brand-line pb-1.5 flex items-center gap-1.5 bg-brand-accent-ultralight py-1 px-2 border border-brand-line/20">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> COMPORTAMENTO & TREINOS
            </h4>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Freq. Histórica Média</span>
                <span className="font-bold text-brand-ink">{formData.Avg_class_frequency_total?.toFixed(2)} treinos/semana</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={formData.Avg_class_frequency_total ?? 1.8}
                onChange={(e) => handleChange("Avg_class_frequency_total", parseFloat(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Freq. Mês Atual</span>
                <span className="font-bold text-brand-ink">{formData.Avg_class_frequency_current_month?.toFixed(2)} treinos/semana</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={formData.Avg_class_frequency_current_month ?? 1.2}
                onChange={(e) => handleChange("Avg_class_frequency_current_month", parseFloat(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-brand-ink/75 font-medium">Gastos Adicionais (Bar/Spa)</span>
                <span className="font-bold text-brand-ink">R$ {formData.Avg_additional_charges_total?.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="450"
                step="5"
                value={formData.Avg_additional_charges_total ?? 100}
                onChange={(e) => handleChange("Avg_additional_charges_total", parseFloat(e.target.value))}
                className="w-full h-2 bg-brand-bg rounded-none appearance-none cursor-pointer accent-brand-accent border border-brand-line"
              />
            </div>

            {/* Binary Switch Buttons */}
            <div className="space-y-2 pt-2">
              <span className="block text-[11px] font-mono uppercase text-brand-ink/60 font-bold tracking-wider">Atributos Adicionais</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <button
                  onClick={() => handleChange("Group_visits", formData.Group_visits === 1 ? 0 : 1)}
                  className={`py-1.5 px-2.5 rounded-none border transition-colors font-bold text-[10px] text-left flex justify-between items-center cursor-pointer ${
                    formData.Group_visits === 1
                      ? "bg-brand-ink text-white border-brand-line"
                      : "bg-white text-brand-ink/70 border-brand-line/50 hover:bg-brand-bg/40"
                  }`}
                >
                  <span>AULAS GRUPAIS</span>
                  <span>{formData.Group_visits === 1 ? "[✓]" : "[ ]"}</span>
                </button>

                <button
                  onClick={() => handleChange("Partner", formData.Partner === 1 ? 0 : 1)}
                  className={`py-1.5 px-2.5 rounded-none border transition-colors font-bold text-[10px] text-left flex justify-between items-center cursor-pointer ${
                    formData.Partner === 1
                      ? "bg-brand-ink text-white border-brand-line"
                      : "bg-white text-brand-ink/70 border-brand-line/50 hover:bg-brand-bg/40"
                  }`}
                >
                  <span>CONVÊNIO</span>
                  <span>{formData.Partner === 1 ? "[✓]" : "[ ]"}</span>
                </button>

                <button
                  onClick={() => handleChange("Promo_friends", formData.Promo_friends === 1 ? 0 : 1)}
                  className={`py-1.5 px-2.5 rounded-none border transition-colors font-bold text-[10px] text-left flex justify-between items-center cursor-pointer ${
                    formData.Promo_friends === 1
                      ? "bg-brand-ink text-white border-brand-line"
                      : "bg-white text-brand-ink/70 border-brand-line/50 hover:bg-brand-bg/40"
                  }`}
                >
                  <span>INDICAÇÃO</span>
                  <span>{formData.Promo_friends === 1 ? "[✓]" : "[ ]"}</span>
                </button>

                <button
                  onClick={() => handleChange("Near_Location", formData.Near_Location === 1 ? 0 : 1)}
                  className={`py-1.5 px-2.5 rounded-none border transition-colors font-bold text-[10px] text-left flex justify-between items-center cursor-pointer ${
                    formData.Near_Location === 1
                      ? "bg-brand-ink text-white border-brand-line"
                      : "bg-white text-brand-ink/70 border-brand-line/50 hover:bg-brand-bg/40"
                  }`}
                >
                  <span>MORA PERTO</span>
                  <span>{formData.Near_Location === 1 ? "[✓]" : "[ ]"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Probability Gauge & Actionable Intervention Tactic */}
      <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
        {/* Risk Panel Scorecard */}
        <div className="bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] select-none flex flex-col justify-between h-[230px] border-b-[8px]">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-ink/50 uppercase block mb-1">
              MÉTRICA PREDITIVA
            </span>
            <h4 className="text-sm font-bold font-mono text-brand-ink flex items-center gap-1.5">
              <risk.icon className="w-4.5 h-4.5 text-brand-accent" />
              {risk.label.toUpperCase()}
            </h4>
          </div>

          <div className="text-center my-1">
            <span className="text-6xl font-mono font-extrabold tracking-tighter text-brand-ink">
              {(probValue * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] font-bold font-mono text-brand-accent block mt-1 tracking-widest uppercase">
              Probabilidade Estimada
            </span>
          </div>

          {/* Retro flat mechanical progress block */}
          <div className="w-full bg-brand-bg border border-brand-line h-4 rounded-none overflow-hidden relative">
            <div
              className="h-full bg-brand-accent border-r border-brand-line transition-all duration-300"
              style={{ width: `${probValue * 100}%` }}
            />
          </div>
        </div>

        {/* Action Strategy advisor */}
        <div className="bg-white rounded-none border-2 border-brand-line p-5 shadow-[4px_4px_0px_0px_#141414] flex-1">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-ink/50 border-b border-brand-line pb-1 mb-3">
            RECOMENDAÇÃO OPERACIONAL
          </h4>
          <div className="space-y-2">
            <p className="text-xs font-mono font-bold text-brand-accent">
              {advice.strategy.toUpperCase()}:
            </p>
            <p className="text-xs font-serif italic text-brand-ink bg-brand-bg/50 p-3.5 border border-brand-line/20 border-dashed leading-relaxed">
              {advice.action}
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-brand-line border-dashed flex items-center justify-between text-[10px] font-mono text-brand-ink/55">
            <span>Algoritmo: LogisticRegression</span>
            <span>AUC: 0.941</span>
          </div>
        </div>
      </div>
      {/* Close the grid container added at the top */}
      </div>

      {/* SHAP Explicability Block */}
      {shapExplanation && (
        <div className="bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414]">
          <h3 className="text-base font-serif italic font-bold text-brand-ink flex items-center gap-2 mb-1">
            <FileCode className="w-5 h-5 text-brand-accent" />
            Explicabilidade do Modelo (SHAP Local)
          </h3>
          <p className="text-xs font-mono text-brand-ink/65 mb-6">
            Visualização de como cada variável empurrou a probabilidade de churn desta predição para cima (vermelho) ou para baixo (verde) a partir da base do modelo.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={shapExplanation.shapValues.slice(0, 8)}
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="feature" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#333' }}
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-brand-line p-2 shadow-lg text-xs font-mono">
                            <p className="font-bold">{data.feature}</p>
                            <p>Valor Original: {data.originalValue}</p>
                            <p>Impacto SHAP: {data.value > 0 ? '+' : ''}{data.value.toFixed(3)}</p>
                            <p className={data.impact === 'positive' ? 'text-red-600' : 'text-emerald-600'}>
                              {data.impact === 'positive' ? 'Aumenta Risco' : 'Reduz Risco'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={0} stroke="#141414" strokeDasharray="3 3" />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {shapExplanation.shapValues.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact === 'positive' ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="bg-brand-bg/50 border border-brand-line/20 p-4 font-mono text-xs text-brand-ink/80 leading-relaxed shadow-sm">
                <span className="font-bold text-[#141414] uppercase tracking-wider block mb-2 border-b border-brand-line/20 pb-1">
                  Resumo Dinâmico
                </span>
                {shapSummary}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
