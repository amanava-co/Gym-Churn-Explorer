import { useState, useMemo } from "react";
import { GymMember } from "../gym_churn_data";
import { Info, HelpCircle } from "lucide-react";

interface BoxplotChartProps {
  id: string;
  members: GymMember[];
}

interface NumericVarConfig {
  key: keyof GymMember;
  label: string;
  unit: string;
  description: string;
}

const numericVars: NumericVarConfig[] = [
  {
    key: "Age",
    label: "Idade dos Clientes",
    unit: " anos",
    description: "Membros que cancelam (churn) costumam ser estatisticamente mais jovens. Clientes mais maduros tendem a apresentar maior assiduidade e taxas de renovação elevadas."
  },
  {
    key: "Lifetime",
    label: "Fidelidade de Matrícula (Lifetime)",
    unit: " meses",
    description: "A variável com maior discernimento. Clientes novos (frequentando há menos de 3 meses) estão no pico de probabilidade de desistência. Aqueles com mais de 5 meses raramente abandonam."
  },
  {
    key: "Avg_additional_charges_total",
    label: "Gastos Extras Financeiros (Adicionais)",
    unit: " R$",
    description: "Distribuição do faturamento por serviços adicionais (personal trainer, bar de proteínas, massagens). Clientes engajados spenders têm menores riscos de churn."
  },
  {
    key: "Avg_class_frequency_total",
    label: "Frequência Semanal Média Geral",
    unit: " treinos/sem",
    description: "Média de treinos semanais calculada desde o cadastro inicial. Estabelece um panorama regular clássico de estilo de vida."
  },
  {
    key: "Avg_class_frequency_current_month",
    label: "Frequência Semanal Mês Atual",
    unit: " treinos/sem",
    description: "O maior indicador sintomático de churn de curto prazo. Quando as visitas reduzem bruscamente de 2 ou 3 vezes por semana para abaixo de 1 vez, o risco de evasão dispara."
  },
  {
    key: "Month_to_end_contract",
    label: "Meses Restantes de Contrato",
    unit: " meses",
    description: "Reflete a barreira contratual remanescente. Quanto menor o tempo até o término (especialmente em planos mensais com valor 1), mais imediato é o ponto de decisão de churn."
  }
];

// Linear interpolation for percentile calculation (exact Pandas/NumPy method)
function getPercentile(sortedArr: number[], p: number): number {
  if (sortedArr.length === 0) return 0;
  if (sortedArr.length === 1) return sortedArr[0];
  const pos = (sortedArr.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArr[base + 1] !== undefined) {
    return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
  } else {
    return sortedArr[base];
  }
}

interface BoxplotStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  lowerWhisker: number;
  upperWhisker: number;
  outliers: number[];
  mean: number;
  count: number;
}

export function BoxplotChart({ id, members }: BoxplotChartProps) {
  const [selectedVarKey, setSelectedVarKey] = useState<keyof GymMember>("Lifetime");
  const [showOutliers, setShowOutliers] = useState<boolean>(true);

  const activeVar = useMemo(() => {
    return numericVars.find(v => v.key === selectedVarKey) || numericVars[1];
  }, [selectedVarKey]);

  // Compute absolute Boxplot statistics for current state
  const stats = useMemo(() => {
    const activeMembers = members.filter(m => m.Churn === 0);
    const churnedMembers = members.filter(m => m.Churn === 1);

    const compute = (group: GymMember[]): BoxplotStats => {
      const values = group.map(m => m[selectedVarKey] as number).sort((a, b) => a - b);
      const count = values.length;
      if (count === 0) {
        return { min: 0, q1: 0, median: 0, q3: 0, max: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], mean: 0, count: 0 };
      }

      const mean = values.reduce((sum, v) => sum + v, 0) / count;
      const q1 = getPercentile(values, 0.25);
      const median = getPercentile(values, 0.50);
      const q3 = getPercentile(values, 0.75);
      const min = values[0];
      const max = values[count - 1];

      const iqr = q3 - q1;
      const lowerLimit = q1 - 1.5 * iqr;
      const upperLimit = q3 + 1.5 * iqr;

      // Whisker values are the lowest and highest data points within 1.5 * IQR limit
      const lowerWhisker = values.find(v => v >= lowerLimit) ?? min;
      const upperWhisker = [...values].reverse().find(v => v <= upperLimit) ?? max;

      const outliers = values.filter(v => v < lowerWhisker || v > upperWhisker);

      return {
        min,
        q1,
        median,
        q3,
        max,
        lowerWhisker,
        upperWhisker,
        outliers,
        mean,
        count
      };
    };

    return {
      active: compute(activeMembers),
      churned: compute(churnedMembers)
    };
  }, [members, selectedVarKey]);

  // Determine scaling parameters for SVG rendering
  const svgLayout = useMemo(() => {
    const globalMin = Math.min(stats.active.min, stats.churned.min);
    const globalMax = Math.max(stats.active.max, stats.churned.max);

    // Padding on edges to look great
    const range = globalMax - globalMin || 1;
    const padding = range * 0.1;
    const minScale = Math.max(0, globalMin - padding);
    const maxScale = globalMax + padding;

    return {
      minScale,
      maxScale,
      range: maxScale - minScale
    };
  }, [stats]);

  // Helper to map active value to height coordinate in SVG (y-axis coordinate)
  const mapValueToY = (val: number, height: number, padding: number) => {
    const plotHeight = height - 2 * padding;
    const ratio = (val - svgLayout.minScale) / svgLayout.range;
    // We want smaller values on the bottom, so reverse the coordinate
    return padding + plotHeight * (1 - ratio);
  };

  const svgHeight = 400;
  const svgWidth = 500;
  const paddingY = 40;
  const activeColX = 150;
  const churnedColX = 350;
  const boxWidth = 90;

  return (
    <div id={id} className="bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414]">
      {/* Component Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-line pb-4 mb-6">
        <div>
          <h3 className="text-base font-serif italic font-bold text-brand-ink flex items-center gap-2">
            <span className="bg-[#141414] text-white p-1 text-[10px] font-mono tracking-wider">BOXPLOTS ESTATÍSTICOS</span>
            Análise Multivariada de Quartis (Seaborn Distribution)
          </h3>
          <p className="text-xs font-mono text-brand-ink/65 mt-1">
            Veja a variabilidade, mediana, dispersão e anomalias de cada métrica divididas por grupo de churn.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showOutliers}
              onChange={(e) => setShowOutliers(e.target.checked)}
              className="accent-brand-accent cursor-pointer w-4 h-4 border-2 border-brand-line rounded-none"
            />
            <span>Exibir Outliers</span>
          </label>
        </div>
      </div>

      {/* Selector layout & Variable documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-brand-ink mb-2">
              Métrica Contínua Selecionada:
            </label>
            <div className="space-y-1">
              {numericVars.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setSelectedVarKey(v.key)}
                  className={`w-full text-left p-2 px-3 border-2 font-mono text-xs font-bold transition-all flex items-center justify-between cursor-pointer rounded-none ${
                    selectedVarKey === v.key
                      ? "bg-brand-accent text-white border-brand-line shadow-[2px_2px_0px_0px_#141414]"
                      : "bg-[#f9f9f9] text-brand-ink border-transparent hover:bg-brand-bg hover:border-brand-line/30"
                  }`}
                >
                  <span>{v.label}</span>
                  <span className="opacity-70 text-[10px]">{v.unit}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-bg/65 p-4 border border-brand-line space-y-2">
            <h4 className="text-xs font-mono font-bold flex items-center gap-1.5 text-brand-ink">
              <Info className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>O que é um Boxplot?</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-brand-ink/80 font-mono">
              Também chamado de diagrama de caixa, ele expõe de uma vez:
            </p>
            <ul className="text-[10px] font-mono list-disc list-inside space-y-1 text-brand-ink/75 bg-white p-2 border border-brand-line/30">
              <li><strong className="text-brand-ink">Haste Superior</strong>: Valor máximo sem outliers.</li>
              <li><strong className="text-brand-ink">Topo Caixa (Q3)</strong>: Percentil 75%.</li>
              <li><strong className="text-brand-accent font-bold">Faixa (Mediana)</strong>: Divisor exato (50% da base).</li>
              <li><strong className="text-brand-ink">Base Caixa (Q1)</strong>: Percentil 25%.</li>
              <li><strong className="text-brand-ink">Haste Inferior</strong>: Valor mínimo sem outliers.</li>
              <li><strong className="text-brand-accent">Pontos Livres</strong>: Outliers estatísticos extremos.</li>
            </ul>
          </div>
        </div>

        {/* SVG Centered Boxplot graphics comparison */}
        <div className="lg:col-span-2 bg-[#fcfcfc] border-2 border-brand-line flex flex-col items-center justify-center p-3 relative shadow-[2px_2px_0px_0px_#141414]">
          <div className="absolute top-3 left-4 text-[10px] font-mono text-brand-ink/60 bg-white border border-brand-line/20 px-1.5 py-0.5 z-10">
            sns.boxplot(y="{selectedVarKey}", x="Churn", data=gym_churn)
          </div>

          <div className="text-center w-full mb-1">
            <span className="text-xs font-mono font-bold text-brand-accent bg-brand-accent-ultralight p-1 px-3 border border-brand-accent/30 lowercase">
              {activeVar.label} ({activeVar.unit})
            </span>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[440px] h-auto my-1 select-none">
            {/* Horizontal Grid lines correlating to scale values */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, index) => {
              const value = svgLayout.minScale + svgLayout.range * ratio;
              const y = mapValueToY(value, svgHeight, paddingY);
              return (
                <g key={index}>
                  <line
                    x1={45}
                    y1={y}
                    x2={svgWidth - 15}
                    y2={y}
                    stroke="#e6e6e6"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={35}
                    y={y + 4}
                    textAnchor="end"
                    className="font-mono text-[10px] fill-brand-ink/60"
                  >
                    {parseFloat(value.toFixed(selectedVarKey === "Avg_class_frequency_current_month" ? 2 : 1))}
                  </text>
                </g>
              );
            })}

            {/* Left border guideline */}
            <line x1={45} y1={paddingY} x2={45} y2={svgHeight - paddingY} stroke="#141414" strokeWidth={1.5} />

            {/* Render COLUMN 1: ACTIVE (Churn = 0) */}
            {(() => {
              const active = stats.active;
              const yMin = mapValueToY(active.min, svgHeight, paddingY);
              const yMax = mapValueToY(active.max, svgHeight, paddingY);
              const yQ1 = mapValueToY(active.q1, svgHeight, paddingY);
              const yMed = mapValueToY(active.median, svgHeight, paddingY);
              const yQ3 = mapValueToY(active.q3, svgHeight, paddingY);
              const yLowWhisker = mapValueToY(active.lowerWhisker, svgHeight, paddingY);
              const yHighWhisker = mapValueToY(active.upperWhisker, svgHeight, paddingY);

              return (
                <g>
                  {/* Vertical center connecting line */}
                  <line
                    x1={activeColX}
                    y1={yLowWhisker}
                    x2={activeColX}
                    y2={yHighWhisker}
                    stroke="#141414"
                    strokeWidth={2}
                    strokeDasharray="1,1"
                  />

                  {/* Whiskers caps */}
                  <line
                    x1={activeColX - 25}
                    y1={yLowWhisker}
                    x2={activeColX + 25}
                    y2={yLowWhisker}
                    stroke="#141414"
                    strokeWidth={2}
                  />
                  <line
                    x1={activeColX - 25}
                    y1={yHighWhisker}
                    x2={activeColX + 25}
                    y2={yHighWhisker}
                    stroke="#141414"
                    strokeWidth={2}
                  />

                  {/* Handcrafted main box */}
                  <rect
                    x={activeColX - boxWidth / 2}
                    y={yQ3}
                    width={boxWidth}
                    height={Math.abs(yQ1 - yQ3) || 2}
                    fill="#ffffff"
                    stroke="#141414"
                    strokeWidth={2.5}
                  />

                  {/* Median Line (Bold Accent color) */}
                  <line
                    x1={activeColX - boxWidth / 2}
                    y1={yMed}
                    x2={activeColX + boxWidth / 2}
                    y2={yMed}
                    stroke="#141414"
                    strokeWidth={3.5}
                  />

                  {/* Outliers if turned on */}
                  {showOutliers && active.outliers.map((val, idx) => {
                    // Jitter outliers slightly to avoid stacking overlap
                    const jitter = Math.sin(idx * 45) * 8;
                    const y = mapValueToY(val, svgHeight, paddingY);
                    return (
                      <circle
                        key={`act-out-${idx}`}
                        cx={activeColX + jitter}
                        cy={y}
                        r={2.5}
                        fill="#141414"
                        fillOpacity={0.25}
                        stroke="#141414"
                        strokeWidth={0.5}
                      />
                    );
                  })}
                </g>
              );
            })()}

            {/* Render COLUMN 2: CHURNED (Churn = 1) */}
            {(() => {
              const churned = stats.churned;
              const yMin = mapValueToY(churned.min, svgHeight, paddingY);
              const yMax = mapValueToY(churned.max, svgHeight, paddingY);
              const yQ1 = mapValueToY(churned.q1, svgHeight, paddingY);
              const yMed = mapValueToY(churned.median, svgHeight, paddingY);
              const yQ3 = mapValueToY(churned.q3, svgHeight, paddingY);
              const yLowWhisker = mapValueToY(churned.lowerWhisker, svgHeight, paddingY);
              const yHighWhisker = mapValueToY(churned.upperWhisker, svgHeight, paddingY);

              return (
                <g>
                  {/* Vertical center connecting line */}
                  <line
                    x1={churnedColX}
                    y1={yLowWhisker}
                    x2={churnedColX}
                    y2={yHighWhisker}
                    stroke="#F27D26"
                    strokeWidth={2}
                    strokeDasharray="1,1"
                  />

                  {/* Whiskers caps */}
                  <line
                    x1={churnedColX - 25}
                    y1={yLowWhisker}
                    x2={churnedColX + 25}
                    y2={yLowWhisker}
                    stroke="#F27D26"
                    strokeWidth={2}
                  />
                  <line
                    x1={churnedColX - 25}
                    y1={yHighWhisker}
                    x2={churnedColX + 25}
                    y2={yHighWhisker}
                    stroke="#F27D26"
                    strokeWidth={2}
                  />

                  {/* Handcrafted main box in Orange style */}
                  <rect
                    x={churnedColX - boxWidth / 2}
                    y={yQ3}
                    width={boxWidth}
                    height={Math.abs(yQ1 - yQ3) || 2}
                    fill="rgba(242, 125, 38, 0.15)"
                    stroke="#F27D26"
                    strokeWidth={2.5}
                  />

                  {/* Median Line (Bold Black/Orange) */}
                  <line
                    x1={churnedColX - boxWidth / 2}
                    y1={yMed}
                    x2={churnedColX + boxWidth / 2}
                    y2={yMed}
                    stroke="#F27D26"
                    strokeWidth={3.5}
                  />

                  {/* Outliers if turned on */}
                  {showOutliers && churned.outliers.map((val, idx) => {
                    const jitter = Math.sin(idx * 73) * 8;
                    const y = mapValueToY(val, svgHeight, paddingY);
                    return (
                      <circle
                        key={`chu-out-${idx}`}
                        cx={churnedColX + jitter}
                        cy={y}
                        r={2.5}
                        fill="#F27D26"
                        fillOpacity={0.35}
                        stroke="#F27D26"
                        strokeWidth={0.5}
                      />
                    );
                  })}
                </g>
              );
            })()}

            {/* Bottom X-Axis category labels */}
            <g className="font-mono text-xs font-bold fill-brand-ink">
              <text x={activeColX} y={svgHeight - 12} textAnchor="middle">
                ATIVOS (CHURN = 0)
              </text>
              <text x={churnedColX} y={svgHeight - 12} textAnchor="middle" fill="#F27D26">
                EVADIDOS (CHURN = 1)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Numerical Data Summary Table below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="border border-brand-line p-4 rounded-none bg-white">
          <div className="text-xs font-mono font-bold uppercase text-brand-ink border-b border-brand-line/15 pb-1 mb-2">
            🟢 Quartis dos Membros Ativos (n={stats.active.count})
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs font-mono text-brand-ink/90">
            <div className="text-brand-ink/60">Limite Máximo:</div>
            <div className="text-right font-bold">{stats.active.upperWhisker.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Percentil 75% (Q3):</div>
            <div className="text-right font-bold">{stats.active.q3.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Valor Mediano (Q2):</div>
            <div className="text-right font-bold text-brand-ink underline">{stats.active.median.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Percentil 25% (Q1):</div>
            <div className="text-right font-bold">{stats.active.q1.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Limite Mínimo:</div>
            <div className="text-right font-bold">{stats.active.lowerWhisker.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60 border-t border-brand-line/10 pt-1.5">Média Aritmética:</div>
            <div className="text-right font-bold text-brand-ink border-t border-brand-line/10 pt-1.5">{stats.active.mean.toFixed(2)}{activeVar.unit}</div>
          </div>
        </div>

        <div className="border border-brand-line p-4 rounded-none bg-brand-accent-ultralight/20">
          <div className="text-xs font-mono font-bold uppercase text-brand-accent border-b border-brand-accent/20 pb-1 mb-2">
            🔴 Quartis dos Membros Evadidos (n={stats.churned.count})
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs font-mono text-brand-ink/90">
            <div className="text-brand-ink/60">Limite Máximo:</div>
            <div className="text-right font-bold">{stats.churned.upperWhisker.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Percentil 75% (Q3):</div>
            <div className="text-right font-bold">{stats.churned.q3.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Valor Mediano (Q2):</div>
            <div className="text-right font-bold text-brand-accent underline">{stats.churned.median.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Percentil 25% (Q1):</div>
            <div className="text-right font-bold">{stats.churned.q1.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60">Limite Mínimo:</div>
            <div className="text-right font-bold">{stats.churned.lowerWhisker.toFixed(2)}{activeVar.unit}</div>

            <div className="text-brand-ink/60 border-t border-brand-line/10 pt-1.5">Média Aritmética:</div>
            <div className="text-right font-bold text-brand-accent border-t border-brand-line/10 pt-1.5">{stats.churned.mean.toFixed(2)}{activeVar.unit}</div>
          </div>
        </div>
      </div>

      {/* Explanatory insights footer */}
      <div className="mt-4 p-3 bg-brand-bg/40 border border-brand-line/45 text-[11px] font-mono leading-relaxed text-brand-ink/80 flex gap-2">
        <span className="text-brand-accent font-bold">💡 S.O.S. Churn Insight:</span>
        <div>
          <span>
            {activeVar.description} O Boxplot permite analisar visualmente a sobreposição (overlap) de caixas.
            {Math.abs(stats.active.median - stats.churned.median) > (stats.active.q3 - stats.active.q1) * 0.3 ? (
              <strong> As faixas medianas estão fortemente desviadas, provando a significância estatística desta variável!</strong>
            ) : (
              <span> Há um certo overlap de distribuição, o que significa que essa variável deve ser combinada com outras no algoritmo de Regressão Logística.</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
