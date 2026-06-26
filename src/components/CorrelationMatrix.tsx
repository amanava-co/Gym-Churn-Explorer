import { useState } from "react";
import { GymMember, computeCorrelationMatrix } from "../gym_churn_data";
import { Info, HelpCircle } from "lucide-react";

interface CorrelationMatrixProps {
  id: string;
  members: GymMember[];
}

const FIELDS: { name: keyof GymMember; label: string; desc: string }[] = [
  { name: "Near_Location", label: "Próximo", desc: "Se o cliente mora ou trabalha perto da academia" },
  { name: "Partner", label: "Parceiro", desc: "Se é funcionário de uma empresa parceira (desconto)" },
  { name: "Promo_friends", label: "Promo Amigos", desc: "Se usou código de amigo na matrícula piloto" },
  { name: "Contract_period", label: "Contrato", desc: "Duração do plano de contrato atual (meses)" },
  { name: "Group_visits", label: "Aulas Grupo", desc: "Se participa de aulas coletivas" },
  { name: "Age", label: "Idade", desc: "Idade do membro em anos" },
  { name: "Lifetime", label: "Lifetime", desc: "Meses desde a primeira visita à academia" },
  { name: "Avg_class_frequency_current_month", label: "Freq Atual", desc: "Frequência média semanal de visitas no mês atual" },
  { name: "Churn", label: "Churn", desc: "Se cancelou ou abandonou a academia (0 = Não, 1 = Sim)" }
];

export function CorrelationMatrix({ id, members }: CorrelationMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number; val: number } | null>(null);

  const fieldsKeys = FIELDS.map(f => f.name);
  const matrix = computeCorrelationMatrix(members, fieldsKeys);

  // Helper to color cells based on value: negative -> dark gray, positive -> brand orange, neutral -> sand
  const getCellColor = (val: number) => {
    if (val === 1) return "bg-brand-accent text-white font-bold border border-brand-line";
    
    const absVal = Math.abs(val);
    if (val > 0) {
      if (absVal > 0.4) return "bg-brand-accent text-white font-medium border border-brand-line";
      if (absVal > 0.2) return "bg-brand-accent-light text-brand-ink border border-brand-line/30";
      return "bg-brand-accent-ultralight text-brand-ink border border-brand-line/10";
    } else {
      if (absVal > 0.4) return "bg-brand-ink text-white font-medium border border-brand-line";
      if (absVal > 0.2) return "bg-brand-ink/40 text-brand-ink border border-brand-line/30";
      return "bg-brand-ink/5 text-brand-ink border border-brand-line/10";
    }
  };

  const getInterpretation = (val: number, label1: string, label2: string) => {
    if (val === 1) return "Identidade própria perfeita (autocorrelação).";
    const abs = Math.abs(val);
    let strength = "fraca";
    if (abs > 0.4) strength = "forte";
    else if (abs > 0.15) strength = "moderada";

    const direction = val > 0 
      ? `positiva (${strength}): quando um aumenta, o outro tende a aumentar também.` 
      : `negativa (${strength}): quando um aumenta, o outro tende a diminuir.`;

    if ((label1 === "Churn" || label2 === "Churn") && val < 0) {
      return `Correlação ${direction} Indica que este fator ajuda a REDUZIR a taxa de cancelamento.`;
    }
    if ((label1 === "Churn" || label2 === "Churn") && val > 0) {
      return `Correlação ${direction} Indica que este fator está associado a MAIOR chance de cancelamento.`;
    }
    return `Relação ${direction}`;
  };

  return (
    <div id={id} className="bg-white rounded-none border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-brand-line pb-4">
        <div>
          <h3 className="text-base font-serif italic font-bold text-brand-ink flex items-center gap-2">
            Matriz de Correlação Dinâmica
            <Info className="w-4 h-4 text-brand-ink cursor-help" title="Calcula o coeficiente de Pearson (-1 a 1) para cada par de variáveis em tempo real" />
          </h3>
          <p className="text-xs font-mono text-brand-ink/65 mt-1">
            Valores próximos de <span className="font-semibold text-brand-accent">1.00</span> indicam forte correlação positiva. Próximos de <span className="font-semibold text-brand-ink"> -1.00</span> indicam forte relação inversa.
          </p>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 bg-brand-accent-ultralight py-1 px-2 border border-brand-line/25">
            <span className="w-2.5 h-2.5 rounded-none bg-brand-accent" />
            <span>Relação Direta (+)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 py-1 px-2 border border-brand-line/25">
            <span className="w-2.5 h-2.5 rounded-none bg-brand-ink" />
            <span>Relação Inversa (-)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto select-none border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 text-right text-brand-ink/50 font-medium font-serif italic text-sm">Variaveis</th>
              {FIELDS.map((f, idx) => (
                <th key={idx} className="p-2 font-bold text-brand-ink text-center uppercase tracking-wider min-w-[72px]">
                  <span className="cursor-help py-1 px-1.5 border border-brand-line/20 bg-brand-bg/40 block text-[10px]" title={f.desc}>
                    {f.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((fRow, i) => (
              <tr key={i} className="hover:bg-brand-bg/20 transition-colors">
                <td className="p-2 text-right font-bold text-brand-ink pr-4 min-w-[110px] text-[11px]" title={fRow.desc}>
                  {fRow.label}
                </td>
                {FIELDS.map((fCol, j) => {
                  const val = matrix[i][j];
                  const isHovered = hoveredCell && hoveredCell.i === i && hoveredCell.j === j;
                  const isPrimaryHover = hoveredCell && (hoveredCell.i === i || hoveredCell.j === j);
                  
                  return (
                    <td
                      key={j}
                      onMouseEnter={() => setHoveredCell({ i, j, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`p-3 text-center border transition-all duration-150 cursor-crosshair text-[11px] ${getCellColor(val)} ${
                        isHovered ? "ring-2 ring-brand-accent scale-105 z-10 font-bold" : isPrimaryHover ? "brightness-[0.97]" : ""
                      }`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Interpretation Panel */}
      <div className="mt-6 p-4 bg-brand-bg/40 rounded-none border border-brand-line border-dashed flex items-start gap-3 min-h-[90px] transition-all duration-300">
        <HelpCircle className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
        {hoveredCell ? (
          <div>
            <h4 className="text-[10px] font-mono text-brand-ink/50 uppercase tracking-widest">
              Relação ativa: <span className="font-serif italic font-medium text-brand-ink">{FIELDS[hoveredCell.i].label}</span> x <span className="font-serif italic font-medium text-brand-ink">{FIELDS[hoveredCell.j].label}</span>
            </h4>
            <p className="text-2xl font-mono font-extrabold text-brand-ink mt-0.5 mr-2 inline-block">
              {hoveredCell.val.toFixed(3)}
            </p>
            <p className="text-xs text-brand-ink mt-1 font-serif italic">
              {getInterpretation(hoveredCell.val, FIELDS[hoveredCell.i].label, FIELDS[hoveredCell.j].label)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center h-full">
            <h4 className="text-xs font-mono font-bold text-brand-ink uppercase tracking-wider">Explorador de Correlação de Pearson</h4>
            <p className="text-xs text-brand-ink/70 mt-1 font-serif italic leading-relaxed">
              Passe o cursor sobre os coeficientes numéricos da matriz para visualizar a força estatística, a direção da correlação linear e o impacto prático específico na probabilidade de Churn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
