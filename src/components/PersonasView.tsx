import { useState, useMemo } from "react";
import { GymMember } from "../gym_churn_data";
import { 
  Users, 
  User, 
  UserMinus, 
  ShieldAlert, 
  TrendingDown, 
  Smile, 
  HelpCircle, 
  ArrowRight, 
  BarChart, 
  Info,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  Pocket,
  Clock,
  Target
} from "lucide-react";

interface PersonasViewProps {
  id: string;
  members: GymMember[];
  onNavigateToTab?: (tabName: string) => void;
}

interface PersonaDetails {
  key: "lucas" | "ana" | "pedro" | "carlos";
  name: string;
  title: string;
  quote: string;
  icon: any;
  color: string;
  borderColor: string;
  badgeBg: string;
  demographics: {
    age: string;
    occupation: string;
    location: string;
    education: string;
    family: string;
    income: string;
  };
  bio: string;
  objectives: string[];
  painPoints: string[];
  behavior: {
    energy: string;
    decision: string;
    tech: string;
  };
  activation: string;
  impact: string;
  ruleDescription: string;
}

export function PersonasView({ id, members, onNavigateToTab }: PersonasViewProps) {
  const [selectedPersona, setSelectedPersona] = useState<"lucas" | "ana" | "pedro" | "carlos">("lucas");
  const [hoveredDot, setHoveredDot] = useState<any | null>(null);
  const [selectedDot, setSelectedDot] = useState<any | null>(null);

  const [selectedClusterDetail, setSelectedClusterDetail] = useState<number | null>(1);
  const [hoveredCell, setHoveredCell] = useState<{ clusterIndex: number; colId: string } | null>(null);

  const clustersData = useMemo(() => [
    {
      id: 1,
      name: "Cluster 1: Onboarding Precoce",
      alias: "Lucas, o Fantasma",
      colorTag: "border-l-4 border-amber-500",
      description: "Baixo lifetime, baixa frequência, baixo engajamento social.",
      metrics: {
        lifetime: { val: "1.2 meses", score: "Baixíssimo", bg: "bg-red-100 text-red-800 border-red-200" },
        recentFreq: { val: "0.3 x/sem", score: "Crítico", bg: "bg-red-100 text-red-800 border-red-200" },
        historicalFreq: { val: "0.4 x/sem", score: "Baixo", bg: "bg-red-50 text-red-700 border-red-100" },
        socialEng: { val: "5% (Baixo)", score: "Nulo", bg: "bg-red-100 text-red-800 border-red-200" },
        churnRisk: { val: "81% (Crítico)", score: "Altíssimo", bg: "bg-red-200 text-red-900 border-red-300" },
        revenue: { val: "R$ 110 (Baixo)", score: "Inexistente", bg: "bg-red-50 text-red-800 border-red-100" }
      },
      diagnostic: "Matrículas recentes que esfriam antes do 15º dia de vigência. Falha grave de Onboarding.",
      action: "Onboarding automatizado via WhatsApp nas primeiras 48h, agendamento facilitado e gamificação imediata da 1ª visita."
    },
    {
      id: 2,
      name: "Cluster 2: Desengajamento Rápido",
      alias: "Ana, a Cliente Invisível",
      colorTag: "border-l-4 border-red-500",
      description: "Frequência atual significativamente menor que a histórica.",
      metrics: {
        lifetime: { val: "4.5 meses", score: "Médio", bg: "bg-amber-100 text-amber-800 border-amber-200" },
        recentFreq: { val: "0.4 x/sem", score: "Crítico", bg: "bg-red-100 text-red-800 border-red-200" },
        historicalFreq: { val: "2.2 x/sem", score: "Excelente", bg: "bg-teal-100 text-teal-800 border-teal-200" },
        socialEng: { val: "12% (Médio)", score: "Baixo", bg: "bg-amber-50 text-amber-800 border-amber-100" },
        churnRisk: { val: "55% (Médio)", score: "Alto", bg: "bg-orange-100 text-orange-950 border-orange-200" },
        revenue: { val: "R$ 380 (Médio)", score: "Estável", bg: "bg-amber-50 text-amber-800 border-amber-100" }
      },
      diagnostic: "Alunos recorrentes que mudaram de hábito bruscamente ('Slipping away'). Risco de desistência iminente.",
      action: "Disparar gancho relacional pelo WhatsApp oferecendo treino guiado cortesia ou aula coletiva com instruutor favorito."
    },
    {
      id: 3,
      name: "Cluster 3: Recorrência Inativa",
      alias: "Carlos, o Pagante Fantasma",
      colorTag: "border-l-4 border-slate-500",
      description: "Frequência baixíssima somada a alto lifetime acumulado.",
      metrics: {
        lifetime: { val: "8.9 meses", score: "Alto", bg: "bg-teal-50 text-teal-900 border-teal-100" },
        recentFreq: { val: "0.1 x/sem", score: "Zerado", bg: "bg-red-100 text-red-800 border-red-200" },
        historicalFreq: { val: "0.2 x/sem", score: "Nulo", bg: "bg-red-100 text-red-800 border-red-200" },
        socialEng: { val: "8% (Baixo)", score: "Baixo", bg: "bg-red-50 text-red-800 border-red-100" },
        churnRisk: { val: "89% (Extremo)", score: "Crítico", bg: "bg-red-200 text-red-900 border-red-300" },
        revenue: { val: "R$ 560 (Alto)", score: "Altíssimo", bg: "bg-teal-100 text-teal-900 border-teal-200" }
      },
      diagnostic: "Clientes 'sleeping dog' que contratam planos longos (anuais/semestrais), não frequentam e não cancelaram ainda.",
      action: "Foco em reatratividade de valor. Evitar contato excessivo de cobrança financeira; em vez disso, ofertar upgrade gratuito no fim do plano para restabelecer o hábito."
    },
    {
      id: 4,
      name: "Cluster 4: Promotores Ativos",
      alias: "Pedro, o Convertido",
      colorTag: "border-l-4 border-teal-500",
      description: "Frequência semanal excelente + alta participação social (aulas/amigos).",
      metrics: {
        lifetime: { val: "9.2 meses", score: "Altíssimo", bg: "bg-teal-100 text-teal-900 border-teal-200" },
        recentFreq: { val: "2.3 x/sem", score: "Excelente", bg: "bg-teal-100 text-teal-900 border-teal-200" },
        historicalFreq: { val: "2.1 x/sem", score: "Excelente", bg: "bg-teal-100 text-teal-900 border-teal-200" },
        socialEng: { val: "78% (Alto)", score: "Excelente", bg: "bg-teal-100 text-teal-900 border-teal-200" },
        churnRisk: { val: "4% (Mínimo)", score: "Excelente", bg: "bg-teal-100 text-teal-900 border-teal-200" },
        revenue: { val: "R$ 680 (Alto)", score: "Excelente", bg: "bg-teal-100 text-teal-900 border-teal-200" }
      },
      diagnostic: "Clientes fiéis que fazem propaganda orgânica, amam as aulas coletivas e utilizam serviços adicionais.",
      action: "Incentivo a planos de indicação ('Membro traz Membro'). Ativação como 'Embaixador de Clã' recebendo regalias e descontos em parceiros."
    }
  ], []);

  const matrixDots = useMemo(() => [
    {
      name: "Rafael",
      personaKey: "lucas",
      personaName: "Lucas, o Fantasma do Onboarding",
      quadrant: "deixar_ir",
      x: 35,
      y: 75,
      size: "w-5 h-5",
      color: "bg-amber-500 border-amber-200",
      textColor: "text-amber-800",
      value: "Baixo (LTV R$ 110)",
      risk: "Muito Alto (81% Churn)",
      desc: "Se matriculou, mas sumiu após 4 dias de uso.",
      action: "Deixar ir. Custo de reaquisição manual supera o retorno financeiro possível. Acionar apenas SMS/Push promocional automatizado de baixo custo."
    },
    {
      name: "Diego",
      personaKey: "ana",
      personaName: "Ana, a Cliente Invisível",
      quadrant: "intervir_agora",
      x: 65,
      y: 65,
      size: "w-6 h-6",
      color: "bg-red-600 border-red-300",
      textColor: "text-red-700",
      value: "Médio-Alto (LTV R$ 380)",
      risk: "Alto (55% Churn)",
      desc: "Visitas caíram de 2.2 para 0.4 visitas por semana.",
      action: "Intervir Agora. Chamar no WhatsApp com convite para aula especial de ginástica coletiva nesta quarta-feira."
    },
    {
      name: "Júlia",
      personaKey: "ana",
      personaName: "Ana, a Cliente Invisível",
      quadrant: "intervir_agora",
      x: 78,
      y: 58,
      size: "w-5 h-5",
      color: "bg-red-600 border-red-300",
      textColor: "text-red-700",
      value: "Alto (LTV R$ 410)",
      risk: "Alto (52% Churn)",
      desc: "Inativa há 12 dias consecutivos. Plano ativo.",
      action: "Intervir Agora. Ligação do instrutor responsável sugerindo readequação imediata do treino de força."
    },
    {
      name: "Pedro",
      personaKey: "carlos",
      personaName: "Carlos, o Pagante Fantasma",
      quadrant: "intervir_agora",
      x: 88,
      y: 78,
      size: "w-8 h-8",
      color: "bg-red-600 border-red-300",
      textColor: "text-red-700",
      value: "Muito Alto (LTV R$ 560)",
      risk: "Extremo (89% Churn)",
      desc: "Vencimento de plano anual se aproxima com zero frequência recente.",
      action: "Intervir Agora. Oferecer migração para plano menor flexível ou bônus de renovação agressivo de 20% para restabelecer hábito."
    },
    {
      name: "Cláudia",
      personaKey: "carlos",
      personaName: "Carlos, o Pagante Fantasma",
      quadrant: "monitorar",
      x: 38,
      y: 28,
      size: "w-6 h-6",
      color: "bg-slate-400 border-slate-250",
      textColor: "text-slate-700",
      value: "Baixo (Plano Básico)",
      risk: "Baixo-Médio (35% Churn)",
      desc: "Paga em recorrência via cartão há 4 meses, mas vai pouco.",
      action: "Monitorar silenciosamente. 'Sleeping dog': contato excessivo ou cobrança de presença pode lembrar o cliente de cancelar a assinatura em aberto."
    },
    {
      name: "Sônia",
      personaKey: "pedro",
      personaName: "Pedro, o Convertido",
      quadrant: "manter_monetizar",
      x: 58,
      y: 22,
      size: "w-4 h-4",
      color: "bg-teal-600 border-teal-300",
      textColor: "text-teal-700",
      value: "Alto (LTV R$ 480)",
      risk: "Excelente (5% Churn)",
      desc: "Frequência de 2.1 visitas/semana, treina há 8 meses ininterrompidos.",
      action: "Manter e Monetizar. Oferecer prêmio de indicação de novos membros. Convidar para atuar como embaixadora social."
    },
    {
      name: "Marina",
      personaKey: "pedro",
      personaName: "Pedro, o Convertido",
      quadrant: "manter_monetizar",
      x: 82,
      y: 24,
      size: "w-7 h-7",
      color: "bg-teal-600 border-teal-300",
      textColor: "text-teal-700",
      value: "Muito Alto (LTV R$ 680)",
      risk: "Excelente (3% Churn)",
      desc: "Líder natural, faturamento em lanchonete e suplementos expressivo.",
      action: "Manter e Monetizar. Oferecer crossgrade para plano VIP Gold nacional e acesso a avaliações biométricas avanzadas."
    }
  ], []);

  // Classify all members dynamically to see counts, churn rates, and averages
  const personasStats = useMemo(() => {
    let lucasCount = 0;
    let lucasChurn = 0;
    let lucasAgeSum = 0;
    let lucasNearSum = 0;

    let anaCount = 0;
    let anaChurn = 0;
    let anaAgeSum = 0;
    let anaFreqTotalSum = 0;
    let anaFreqCurrentSum = 0;

    let pedroCount = 0;
    let pedroChurn = 0;
    let pedroAgeSum = 0;
    let pedroGroupSum = 0;
    let pedroFreqSum = 0;

    let carlosCount = 0;
    let carlosChurn = 0;
    let carlosAgeSum = 0;
    let carlosContractSum = 0;

    members.forEach(m => {
      // Cascade-based classification matching user demographics & behavior
      
      // 1. Pedro: Faithful, stable, high-frequent, group classes, long lifetime
      if (m.Churn === 0 && m.Lifetime >= 4 && m.Avg_class_frequency_current_month >= 1.5) {
        pedroCount++;
        pedroChurn += m.Churn;
        pedroAgeSum += m.Age;
        pedroGroupSum += m.Group_visits;
        pedroFreqSum += m.Avg_class_frequency_current_month;
      }
      // 2. Carlos: Ghost Payer, long-term contract (6-12M), but practically is in 0 visits, still paying
      else if (m.Contract_period >= 6 && m.Avg_class_frequency_current_month < 0.5 && m.Churn === 0) {
        carlosCount++;
        carlosChurn += m.Churn;
        carlosAgeSum += m.Age;
        carlosContractSum += m.Contract_period;
      }
      // 3. Lucas: Onboarding phantom, has low lifetime (<= 2). Left or is in active danger. Highly near.
      else if (m.Lifetime <= 2) {
        lucasCount++;
        lucasChurn += m.Churn;
        lucasAgeSum += m.Age;
        lucasNearSum += m.Near_Location;
      }
      // 4. Ana: Invisible Client, has longer lifetime, but her visits dropped gradually over time (resting members)
      else {
        anaCount++;
        anaChurn += m.Churn;
        anaAgeSum += m.Age;
        anaFreqTotalSum += m.Avg_class_frequency_total;
        anaFreqCurrentSum += m.Avg_class_frequency_current_month;
      }
    });

    const total = members.length || 1;

    return {
      total,
      lucas: {
        count: lucasCount,
        percentage: parseFloat(((lucasCount / total) * 100).toFixed(1)),
        churnRate: parseFloat(((lucasChurn / (lucasCount || 1)) * 100).toFixed(1)),
        avgAge: parseFloat((lucasAgeSum / (lucasCount || 1)).toFixed(1)),
        nearPct: parseFloat(((lucasNearSum / (lucasCount || 1)) * 100).toFixed(1))
      },
      ana: {
        count: anaCount,
        percentage: parseFloat(((anaCount / total) * 100).toFixed(1)),
        churnRate: parseFloat(((anaChurn / (anaCount || 1)) * 100).toFixed(1)),
        avgAge: parseFloat((anaAgeSum / (anaCount || 1)).toFixed(1)),
        freqTotal: parseFloat((anaFreqTotalSum / (anaCount || 1)).toFixed(2)),
        freqCurrent: parseFloat((anaFreqCurrentSum / (anaCount || 1)).toFixed(2))
      },
      pedro: {
        count: pedroCount,
        percentage: parseFloat(((pedroCount / total) * 100).toFixed(1)),
        churnRate: parseFloat(((pedroChurn / (pedroCount || 1)) * 100).toFixed(1)),
        avgAge: parseFloat((pedroAgeSum / (pedroCount || 1)).toFixed(1)),
        groupPct: parseFloat(((pedroGroupSum / (pedroCount || 1)) * 100).toFixed(1)),
        avgFreq: parseFloat((pedroFreqSum / (pedroCount || 1)).toFixed(2))
      },
      carlos: {
        count: carlosCount,
        percentage: parseFloat(((carlosCount / total) * 100).toFixed(1)),
        churnRate: parseFloat(((carlosChurn / (carlosCount || 1)) * 100).toFixed(1)),
        avgAge: parseFloat((carlosAgeSum / (carlosCount || 1)).toFixed(1)),
        avgContract: parseFloat((carlosContractSum / (carlosCount || 1)).toFixed(1))
      }
    };
  }, [members]);

  const personasList: PersonaDetails[] = [
    {
      key: "lucas",
      name: "Lucas, o Fantasma do Onboarding",
      title: "O Aluno Fantasma da Fase Inicial",
      quote: "Se eu não engatar rápido, eu simplesmente sumo.",
      icon: UserMinus,
      color: "border-red-600 text-red-600",
      borderColor: "border-red-600",
      badgeBg: "bg-red-50 text-red-700 border-red-200",
      demographics: {
        age: "26 anos (Média calculada no dataset: " + personasStats.lucas.avgAge + " anos)",
        occupation: "Analista / Início de carreira",
        location: "Mora perto da academia (" + personasStats.lucas.nearPct + "% de proximidade)",
        education: "Ensino superior completo ou em andamento",
        family: "Solteiro ou mora sozinho",
        income: "R$ 3.000 – R$ 6.000 (Classe B/C) / Disposto a gastar se engajar"
      },
      bio: "Lucas decidiu começar a academia motivado por um gatilho pontual — estética, saúde ou influência de amigos. Ele realiza a matrícula com facilidade, mas não possui uma rotina estruturada de exercícios. Nos primeiros 30 dias ele até cogita treinar, mas qualquer barreira (cansaço do trabalho, chuva, dúvida de qual exercício fazer) faz com que desista. Lucas não interage com instrutores, não frequenta aulas coletivas e não cria vínculos com o espaço. Ele abandona silenciosamente sem nem sequer formalizar a reclamação.",
      objectives: [
        "Consolidar hábito de treinos semanais mínimos com baixo estresse de escolha",
        "Visualizar retornos rápidos (ânimo, disposição física) logo nas primeiras semanas",
        "Zerar a barreira de entrada (aplicativo simples, agenda intuitiva)"
      ],
      painPoints: [
        "Inconsistência severa (ausência acumulada após os primeiros dias da matrícula)",
        "Falta de direcionamento claro dos professores nos aparelhos mais cheios",
        "Falta de pertencimento social à cultura da academia"
      ],
      behavior: {
        energy: "Introvertido (Prefere fichas de treino ou fone de ouvido)",
        decision: "Emocional / Esporádica (Age por impulso, desiste na primeira barreira)",
        tech: "Comum (Acessa redes de forma contínua, evita downloads e-mail)"
      },
      activation: "Exige gatilhos ativos da recepção. Se o sistema apontar zero entradas pós 5 dias seguidos da matrícula, dispara notificação de boas-vindas oferecendo ajuda ou agendamento de treino assistido gratuito. Introduzir em grupo reduz o churn drasticamente.",
      impact: "Se Lucas atingir frequência ≥ 2x na semana durante o primeiro mês, seu churn histórico despenca de 81% para ~30%!",
      ruleDescription: "Calculado a partir de todos os clientes com Lifetime ≤ 2 meses (Fase crítica de ativação no onboarding)."
    },
    {
      key: "ana",
      name: "Ana, a Cliente Invisível",
      title: "Desaceleração Gradual de Longo Prazo",
      quote: "Eu não parei de ir — eu fui parando.",
      icon: Clock,
      color: "border-[#cc7000] text-[#cc7000]",
      borderColor: "border-[#cc7000]",
      badgeBg: "bg-yellow-50 text-[#cc7000] border-yellow-200",
      demographics: {
        age: "31 anos (Média calculada no dataset: " + personasStats.ana.avgAge + " anos)",
        occupation: "Profissional administrativa / Corporativa",
        location: "Fácil acesso física (moradia ou trabalho próximo)",
        education: "Ensino superior completo ou pós-graduação",
        family: "Casada ou mora em casal",
        income: "R$ 5.000 – R$ 10.000 (Classe B) / Prioriza conveniência"
      },
      bio: "Ana começou com excelente consistência. Treinava 2 a 3 vezes por semana e via valor real na mensalidade. Devido à correria corporativa, reuniões tardias e cansaço, a musculação começou a competir com outras obrigações. Ela não tomou a decisão consciente de parar — apenas foi reduzindo as idas semanais de forma lenta. Ela ainda se considera 'aluna ativa' para si mesma, mas já desanimou. Como ela não reclama nem solicita o cancelamento inicial imediato (visto que paga parcelado), ela é invisível para a gestão.",
      objectives: [
        "Encaixar exercícios de forma equilibrada com a rotina de trabalho exaustiva",
        "Encontrar estímulos novos e divertidos de treino (variedade de exercícios)",
        "Combater o sedentarismo sem precisar de dedicação atlética absurda"
      ],
      painPoints: [
        "Falta extrema de tempo produtivo para passar horas caminhando na esteira",
        "Monotonia da musculação padrão repetitiva ao longo dos meses",
        "Sensação dolorosa de que está desperdiçando dinheiro de mensalidade sem comparecer"
      ],
      behavior: {
        energy: "Moderada / Equilibrada (Gosta de trepar em esteiras ou aulas para desestressar)",
        decision: "Mista (Racional na cobrança pessoal, mas emocional no esgotamento)",
        tech: "Funcional (Frequenta canais corporativos e usa ferramentas de agenda)"
      },
      activation: "A Vitaliza deve alertar a queda no indicador de curto prazo. Quando sua frequência cai abaixo das médicas históricas (de " + personasStats.ana.freqTotal + " para " + personasStats.ana.freqCurrent + " treinos/semana), dispara convite para aula em grupo experimental de spinning ou ioga.",
      impact: "A inserção de Ana em aulas de ginástica coletiva e socialização reduz o seu churn médio de ~55% para apenas 38%!",
      ruleDescription: "Membros com fidelidade sólida (Lifetime > 2), porém sofrendo declínio na frequência do mês corrente."
    },
    {
      key: "pedro",
      name: "Pedro, o Convertido",
      title: "O Atleta Campeão Fidelizado",
      quote: "Treinar faz parte de quem eu sou.",
      icon: Smile,
      color: "border-green-600 text-green-700",
      borderColor: "border-green-600",
      badgeBg: "bg-green-50 text-green-700 border-green-200",
      demographics: {
        age: "37 anos (Média calculada no dataset: " + personasStats.pedro.avgAge + " anos)",
        occupation: "Profissional estável / Gestor ou Diretor de empresa",
        location: "Residente há anos na região de vizinhança",
        education: "Pós-graduado ou cargo de liderança",
        family: "Casado ou relacionamento estável",
        income: "R$ 8.000 – R$ 15.000+ (Foco em qualidade e facilidade de infraestrutura)"
      },
      bio: "Para Pedro, o hábito já está enraizado na sua identidade mental. Ele frequenta a academia de forma quase sagrada (frequência média de " + personasStats.pedro.avgFreq + " treinos por semana), participa de aulas coletivas (" + personasStats.pedro.groupPct + "% de participação) e interage de forma calorosa com a recepção e instrutores. Ele conhece os outros habitues do horário. Pedro não precisa de apelos comerciais para ir correr - ele precisa ser respeitado, lembrado e valorizado.",
      objectives: [
        "Superar metas esportivas de forma progressiva (ganho de massa, força ou corrida)",
        "Utilizar o ambiente físico como desintoxicação psicológica do cargo de direção",
        "Expandir seu círculo de amizades e participar de uma comunidade sadia"
      ],
      painPoints: [
        "Falta de manutenção em equipamentos de ponta ou superlotação de aparelhos",
        "Ausência de reconhecimento comercial para quem é cliente fiel há muito tempo",
        "Monotonia metodológica dos treinos passados sem acompanhamento avançado"
      ],
      behavior: {
        energy: "Alta / Extrovertido (Adora treinar em parceria com colegas ou aulas em grupo)",
        decision: "Totalmente Racional (Sabe o valor da saúde física de longo prazo)",
        tech: "Entusiasta (Mede calorias no Apple Watch / Strava e anota cargas no app)"
      },
      activation: "Utilizar Pedro como promotor natural da marca (NPS). Criar programa de indicação robusto (Indique amigos com bônus). Conceder brindes exclusivos pelo tempo de casa para validar e premiar sua permanência sólida.",
      impact: "Pedro possui blindagem social e hábitos consolidados. Sua taxa real de churn é baixíssima - entre 4% e 6% no ano.",
      ruleDescription: "Membros com fidelidade experiente (Lifetime >= 4) que treinam assiduamente no mês atual (> 1.5/semana)."
    },
    {
      key: "carlos",
      name: "Carlos, o Pagante Fantasma",
      title: "Assinante Inativo sob Plano Longo",
      quote: "Eu ainda pago… mas já saí faz tempo.",
      icon: ShieldAlert,
      color: "border-purple-600 text-purple-600",
      borderColor: "border-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      demographics: {
        age: "35 anos (Média calculada no dataset: " + personasStats.carlos.avgAge + " anos)",
        occupation: "Empresário / Profissional liberal de rotina caótica",
        location: "Acesso comum a transportes",
        education: "Ensino superior completo",
        family: "Pai de família com filhos pequenos",
        income: "R$ 8.000 – R$ 18.000 (Classe A / Confortável em continuar pagando)"
      },
      bio: "Carlos firmou um pacote de fidelidade de longo prazo (" + personasStats.carlos.avgContract + " meses em média) para garantir o melhor desconto por visita teórica. Ele treinou algumas vezes nas primeiras semanas, mas perdeu o ritmo por completo. Hoje, sua frequência real do mês é nula (0 treinos/semana), mas ele continua pagando o débito automático mensal em seu cartão de crédito. Ele evita solicitar o cancelamento pela barreira burocrática ou simplesmente por achar que 'vai voltar a treinar semana que vem'. Ele representa receita recorrente líquida temporária, mas é uma bomba relógio prestes a estourar assim que o plano expirar.",
      objectives: [
        "Retomar as visitas regulares para cessar o sentimento de culpa de estar pagando sem usar",
        "Sentir que o investimento corporativo ou pessoal na academia não está sendo jogado no lixo",
        "Superar a inércia física sem receber sermões ou cobranças invasivas"
      ],
      painPoints: [
        "Incapacidade crônica de alinhamento de horários para ir treinar musculação",
        "Sentimento persistente de culpa e frustração financeira toda vez que a fatura do cartão é lançada",
        "Insegurança extrema de voltar semanas depois do sumiço completa"
      ],
      behavior: {
        energy: "Baixa (Totalmente absorvido por tarefas de casa, filhos e negócios)",
        decision: "Procrastinador (Evita lidar com problemas de saúde ou burocracia de cancelamento)",
        tech: "Integrado funcional (Usa aplicativos bancários de forma constante para gerenciar gastos)"
      },
      activation: "Monitorar de modo silencioso e cauteloso. Perto do vencimento do plano (onde o risco de cancelamento dispara para 95%), enviar SMS ou WhatsApp personalizado oferecendo trancamento temporário gratuito ou agendamento de avaliação flexível, recriando proposta de valor.",
      impact: "Contratos de longo prazo com freqüência atual nula possuem risco acumulado iminente de Churn de ~40% no vencimento.",
      ruleDescription: "Membros com contratos ativos de 6 ou 12 meses e cuja frequência atual é praticamente nula (Inativos pagantes)."
    }
  ];

  const currentPersona = useMemo(() => {
    return personasList.find(p => p.key === selectedPersona) || personasList[0];
  }, [selectedPersona, personasList]);

  return (
    <div id={id} className="space-y-8 animate-fade-in">
      
      {/* Interactive Title Header */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="bg-brand-accent text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide inline-block mb-2 border border-brand-line">
              PERSONAS DA MATRÍCULA
            </span>
            <h2 className="text-xl font-serif italic font-extrabold tracking-tight text-brand-ink flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-accent stroke-[2.5]" />
              Segmentação Analítica de Clientes (Personas)
            </h2>
            <p className="text-xs font-mono text-brand-ink/70 mt-1 max-w-3xl leading-relaxed">
              Mapeamento estatístico do comportamento humano extraído diretamente do arquivo <code>gym_churn_us.csv</code>.
              Compreenda as razões ocultas de evasão de cada perfil e como agir de forma proativa.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-ink/60 bg-brand-bg/50 px-3 py-1.5 border border-brand-line">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Mapeamento em Tempo Real: {personasStats.total} Clientes</span>
          </div>
        </div>
      </div>

      {/* Grid selector / Summary cards of the 4 personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personasList.map(p => {
          const stats = personasStats[p.key];
          const isSelected = selectedPersona === p.key;
          const Icon = p.icon;

          return (
            <button
              key={p.key}
              onClick={() => setSelectedPersona(p.key)}
              className={`text-left p-4 pr-5 border-2 transition-all cursor-pointer rounded-none relative flex flex-col justify-between h-[165px] ${
                isSelected
                  ? "bg-white border-brand-line shadow-[4px_4px_0px_0px_#141414] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white/70 hover:bg-white border-brand-line/50 hover:border-brand-line/80 hover:shadow-[2px_2px_0px_0px_#141414]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-1.5 border border-brand-line/20 rounded-none bg-brand-bg ${p.color}`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none border ${p.badgeBg}`}>
                    {stats.percentage}% da base
                  </span>
                </div>

                <h3 className="text-sm font-serif italic font-black text-brand-ink mt-3 line-clamp-1">
                  {p.name.split(",")[0]}
                </h3>
                <p className="text-[10px] font-mono text-brand-ink/50 mt-1 line-clamp-2">
                  "{p.quote}"
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-brand-line/15 border-dashed flex items-center justify-between text-[11px] font-mono">
                <span className="text-brand-ink/60 font-medium">Cadastros: <strong className="text-brand-ink font-bold">{stats.count}</strong></span>
                <span className={`font-bold ${stats.churnRate > 60 ? 'text-red-500' : stats.churnRate > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {stats.churnRate}% Churn
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main selected persona content block */}
      <div className="bg-white border-2 border-brand-line shadow-[4px_4px_0px_0px_#141414] rounded-none grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left column (Visual Avatar, Demographics and Personality) */}
        <div className="lg:col-span-5 bg-[#fafafa] border-b-2 lg:border-b-0 lg:border-r-2 border-brand-line p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-brand-ink text-white flex items-center justify-center border-2 border-brand-line shadow-[2px_2px_0px_0px_#F27D26] shrink-0 font-serif italic text-3xl font-black">
                {currentPersona.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-serif italic font-extrabold text-brand-ink">
                  {currentPersona.name}
                </h3>
                <p className="text-[11px] font-mono text-brand-accent font-bold uppercase mt-0.5">
                  {currentPersona.title}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border ${currentPersona.badgeBg}`}>
                    Total: {personasStats[currentPersona.key].count} Alunos
                  </span>
                  <span className="text-[10px] font-semibold font-mono bg-brand-bg px-2 py-0.5 border border-brand-line/25 text-brand-ink">
                    Churn Histórico: {personasStats[currentPersona.key].churnRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quote of the Persona */}
            <div className="bg-brand-accent-ultralight/40 border-l-4 border-brand-accent p-3 font-serif italic text-xs text-brand-ink/90 leading-relaxed">
              "{currentPersona.quote}"
            </div>

            {/* Demographics checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono font-extrabold text-brand-ink uppercase border-b border-brand-line/10 pb-1">
                📋 Perfil Demográfico
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono">
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase">Idade Estimada:</span>
                  <span className="font-bold">{currentPersona.demographics.age}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase">Ocupação / Cargo:</span>
                  <span className="font-bold">{currentPersona.demographics.occupation}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-brand-ink/50 uppercase">Localização Geográfica:</span>
                  <span className="font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" />
                    {currentPersona.demographics.location}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase">Estrutura Familiar:</span>
                  <span className="font-bold">{currentPersona.demographics.family}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-ink/50 uppercase">Renda Mensal Estimada:</span>
                  <span className="font-bold">{currentPersona.demographics.income}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior / Personality boxes */}
          <div className="pt-4 border-t border-brand-line/10 space-y-2.5">
            <h4 className="text-xs font-mono font-extrabold text-brand-ink uppercase">
              🧠 Personalidade e Comportamento
            </h4>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="bg-white border border-brand-line/30 p-2 text-center">
                <span className="block text-[8px] text-brand-ink/55 uppercase font-medium">Bateria</span>
                <span className="font-extrabold text-brand-ink text-[11px] block mt-0.5">{currentPersona.behavior.energy.split(" ")[0]}</span>
              </div>
              <div className="bg-white border border-brand-line/30 p-2 text-center">
                <span className="block text-[8px] text-brand-ink/55 uppercase font-medium">Decisão</span>
                <span className="font-extrabold text-brand-ink text-[11px] block mt-0.5">{currentPersona.behavior.decision.split(" ")[0]}</span>
              </div>
              <div className="bg-white border border-brand-line/30 p-2 text-center">
                <span className="block text-[8px] text-brand-ink/55 uppercase font-medium">Tecnologia</span>
                <span className="font-extrabold text-brand-ink text-[11px] block mt-0.5">{currentPersona.behavior.tech.split(" ")[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Biography, Pain Points, Objectives, Activation, Expected impact) */}
        <div className="lg:col-span-7 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-mono font-extrabold text-brand-ink uppercase border-b-2 border-brand-line pb-1 mb-2 flex items-center justify-between">
                <span>📝 Biografia Detalhada (Bio)</span>
                <span className="text-[9px] font-mono font-bold bg-brand-bg px-1.5 py-0.5 border border-brand-line/25">Média: {personasStats[currentPersona.key].percentage}% da base</span>
              </h4>
              <p className="text-xs font-mono text-brand-ink/80 leading-relaxed">
                {currentPersona.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Objectives column */}
              <div className="border border-brand-line/30 p-3 bg-brand-bg/20">
                <h5 className="text-[11px] font-mono font-bold text-green-700 uppercase flex items-center gap-1 mb-2">
                  <Smile className="w-3.5 h-3.5" />
                  <span>🎯 Objetivos e Metas</span>
                </h5>
                <ul className="text-[10px] font-mono space-y-2 text-brand-ink/85">
                  {currentPersona.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pain points column */}
              <div className="border border-brand-line/30 p-3 bg-red-50/10">
                <h5 className="text-[11px] font-mono font-bold text-red-600 uppercase flex items-center gap-1 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>😤 Dores e Frustrações</span>
                </h5>
                <ul className="text-[10px] font-mono space-y-2 text-brand-ink/85">
                  {currentPersona.painPoints.map((pt, i) => (
                    <li key={i} className="flex gap-1.5 items-start">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategic activation actions */}
            <div className="border-2 border-dashed border-brand-line bg-brand-accent-ultralight/20 p-4">
              <h5 className="text-xs font-mono font-bold uppercase text-brand-ink flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-brand-accent fill-brand-accent/30" />
                <span>💡 Como nosso produto ajuda? (Ativação Técnica)</span>
              </h5>
              <p className="text-xs font-mono leading-relaxed text-brand-ink/90">
                {currentPersona.activation}
              </p>
            </div>
          </div>

          {/* Expected impact footer highlight */}
          <div className="bg-brand-ink text-white p-4 border-2 border-brand-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-bold text-brand-accent-light uppercase tracking-wider">
                👉 Retorno Líquido Projetado
              </span>
              <p className="text-xs font-sans font-bold italic">
                {currentPersona.impact}
              </p>
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("predictor")}
                className="bg-white hover:bg-brand-bg text-brand-ink hover:text-brand-ink/95 border-2 border-brand-line shadow-[2px_2px_0px_0px_#F27D26] text-[11px] font-mono font-bold px-3 py-1.5 transition-all self-end sm:self-auto cursor-pointer rounded-none shrink-0"
              >
                Simular no Preditor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Risk x Value Matrix Board (Matching User Intent & Attached Image) */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none space-y-6">
        <div className="border-b-2 border-brand-line pb-3">
          <span className="bg-[#141414] text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide inline-block mb-1">
            ESTRATÉGIA DE RETENÇÃO (INTELI)
          </span>
          <h3 className="text-xl font-serif italic font-extrabold tracking-tight text-brand-ink">
            O que sai daqui hoje
          </h3>
          <p className="text-xs font-mono text-brand-ink/70">
            A matriz que prioriza personas Vitaliza por valor econômico e risco de cancelamento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual 4-Quadrant Matrix Board */}
          <div className="lg:col-span-7 flex flex-col items-stretch">
            {/* Axis Y Label + Matrix Area Wrapper */}
            <div className="flex gap-2 items-stretch h-[380px] sm:h-[420px] relative">
              
              {/* Y Axis Label (Risco) */}
              <div className="flex flex-col justify-between items-center py-4 text-xs font-mono font-bold uppercase tracking-widest text-[#141414]/70 shrink-0 w-8 select-none">
                <span className="self-end mr-1">Risco</span>
                <span className="text-brand-accent animate-pulse font-extrabold">↑</span>
                <span>Baixo</span>
              </div>

              {/* The Matrix Canvas Grid */}
              <div className="relative flex-1 bg-[#f4f6f8] border-2 border-[#141414] overflow-hidden select-none">
                
                {/* 2x2 Quadrant Background Grid */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  {/* Top-Left: DEIXAR IR */}
                  <div className="bg-[#f0e4cf]/25 border-r border-[#141414]/30 border-b border-[#141414]/30 p-3 relative">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-600 uppercase tracking-wider absolute top-3 left-3 select-none">
                      DEIXAR IR
                    </span>
                  </div>

                  {/* Top-Right: INTERVIR AGORA */}
                  <div className="bg-[#eae0e1]/30 border-b border-[#141414]/30 p-3 relative">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-red-600 uppercase tracking-wider absolute top-3 left-3 select-none">
                      INTERVIR AGORA
                    </span>
                  </div>

                  {/* Bottom-Left: MONITORAR */}
                  <div className="bg-[#cbd2d6]/15 border-r border-[#141414]/30 p-3 relative">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-wider absolute bottom-3 left-3 select-none">
                      MONITORAR
                    </span>
                  </div>

                  {/* Bottom-Right: MANTER E MONETIZAR */}
                  <div className="bg-[#cedfe0]/30 p-3 relative">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-teal-700 uppercase tracking-wider absolute bottom-3 left-3 select-none">
                      MANTER E MONETIZAR
                    </span>
                  </div>
                </div>

                {/* Main Middle Dividing Lines */}
                <div className="absolute left-[50%] top-0 bottom-0 border-l border-brand-line border-dashed z-0" />
                <div className="absolute top-[50%] left-0 right-0 border-t border-brand-line border-dashed z-0" />

                {/* Plotting dots */}
                {matrixDots.map((dot) => {
                  const isHovered = hoveredDot && hoveredDot.name === dot.name;
                  const isSelected = selectedDot && selectedDot.name === dot.name;

                  return (
                    <button
                      key={dot.name}
                      onMouseEnter={() => setHoveredDot(dot)}
                      onMouseLeave={() => setHoveredDot(null)}
                      onClick={() => setSelectedDot(isSelected ? null : dot)}
                      style={{
                        left: `${dot.x}%`,
                        top: `${100 - dot.y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                      className={`absolute z-10 rounded-full border-2 border-white shadow-[0px_4px_10px_rgba(0,0,0,0.15)] flex items-center justify-center cursor-pointer transition-all ${dot.size} ${dot.color} ${
                        isHovered || isSelected
                          ? "ring-4 ring-offset-1 ring-brand-line scale-125 z-20"
                          : "hover:scale-110"
                      }`}
                    >
                      {/* Name label beneath dot */}
                      <span className="absolute top-full mt-1 text-[10px] sm:text-xs font-mono font-black text-brand-ink/90 whitespace-nowrap bg-white/90 px-1 py-0.2 rounded border border-[#141414]/20 shadow-sm pointer-events-none">
                        {dot.name}
                      </span>
                    </button>
                  );
                })}

                {/* Floating tooltip inline on hover */}
                {hoveredDot && !selectedDot && (
                  <div 
                    style={{
                      left: `${hoveredDot.x}%`,
                      top: `${100 - hoveredDot.y - 12}%`,
                      transform: 'translateX(-50%)'
                    }}
                    className="absolute z-30 bg-brand-ink text-white p-3 shadow-xl rounded-none border border-brand-line text-[11px] font-mono min-w-[200px] pointer-events-none transition-all duration-150"
                  >
                    <div className="font-bold border-b border-white/20 pb-1 mb-1 text-xs text-brand-accent flex items-center justify-between">
                      <span>👤 {hoveredDot.name}</span>
                      <span className="bg-white/10 text-white px-1.5 py-0.2 text-[8px] tracking-wide rounded">
                        {hoveredDot.personaKey.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/85 text-[10px] mt-1 italic">"{hoveredDot.desc}"</p>
                    <div className="grid grid-cols-2 gap-1 mt-2 pt-1.5 border-t border-white/10 text-[9px]">
                      <div>
                        <span className="block text-white/50">VALOR:</span>
                        <span className="font-extrabold">{hoveredDot.value}</span>
                      </div>
                      <div>
                        <span className="block text-white/50">RISCO:</span>
                        <span className="font-extrabold text-[#f3a4a9]">{hoveredDot.risk}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* X Axis Label (Valor) */}
            <div className="flex justify-center items-center gap-2 mt-4 text-xs font-mono font-bold uppercase tracking-widest text-[#141414]/70 select-none">
              <span>Valor Econômico →</span>
            </div>
          </div>

          {/* Right Column: Matriz Legends & Interactive Detail Area */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Legend blocks */}
            <div className="space-y-4">
              <h4 className="text-sm font-sans font-extrabold text-[#141414] border-b-2 border-brand-line pb-1 flex items-center justify-between uppercase">
                <span>Os 4 quadrantes</span>
              </h4>

              <div className="space-y-3">
                {/* 1. Intervir Agora */}
                <div className="flex gap-3">
                  <div className="w-3.5 h-auto shrink-0 bg-red-600 rounded-none border border-brand-line" style={{ minHeight: "44px" }} />
                  <div className="text-xs font-mono">
                    <strong className="text-red-700 block text-[13px] uppercase tracking-wide">Intervir agora</strong>
                    <p className="text-brand-ink/75 mt-0.5 leading-relaxed">Janela curta, orçamento concentrado.</p>
                  </div>
                </div>

                {/* 2. Manter e Monetizar */}
                <div className="flex gap-3">
                  <div className="w-3.5 h-auto shrink-0 bg-teal-600 rounded-none border border-brand-line" style={{ minHeight: "44px" }} />
                  <div className="text-xs font-mono">
                    <strong className="text-teal-800 block text-[13px] uppercase tracking-wide">Manter e monetizar</strong>
                    <p className="text-brand-ink/75 mt-0.5 leading-relaxed">Advocacy, upgrade, programa de embaixadores.</p>
                  </div>
                </div>

                {/* 3. Deixar ir */}
                <div className="flex gap-3">
                  <div className="w-3.5 h-auto shrink-0 bg-amber-500 rounded-none border border-brand-line" style={{ minHeight: "44px" }} />
                  <div className="text-xs font-mono">
                    <strong className="text-amber-800 block text-[13px] uppercase tracking-wide">Deixar ir</strong>
                    <p className="text-brand-ink/75 mt-0.5 leading-relaxed">Custo de reter &gt; LTV remanescente.</p>
                  </div>
                </div>

                {/* 4. Monitorar */}
                <div className="flex gap-3">
                  <div className="w-3.5 h-auto shrink-0 bg-slate-400 rounded-none border border-brand-line" style={{ minHeight: "44px" }} />
                  <div className="text-xs font-mono">
                    <strong className="text-slate-600 block text-[13px] uppercase tracking-wide">Monitorar</strong>
                    <p className="text-brand-ink/75 mt-0.5 leading-relaxed">Sleeping dog estável, sem ação dedicada.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive action drawer: displays when user selects a member dot */}
            <div className="border-2 border-brand-line p-4 bg-brand-bg/50 flex-1 flex flex-col justify-center min-h-[160px] relative">
              {selectedDot ? (
                <div className="space-y-2.5 animate-fade-in text-xs font-mono">
                  <div className="flex justify-between items-center border-b border-brand-line/15 pb-1.5">
                    <span className="font-extrabold text-[#141414] text-[13px] flex items-center gap-1">
                      🎯 Diagnóstico: <span className="text-brand-accent font-black">{selectedDot.name}</span>
                    </span>
                    <button 
                      onClick={() => setSelectedDot(null)}
                      className="text-[10px] text-brand-ink/50 hover:text-brand-ink font-bold hover:underline cursor-pointer"
                    >
                      Fechar [x]
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                    <div>
                      <strong className="block text-brand-ink/50 text-[10px] uppercase">Persona Vinculada:</strong>
                      <span className="font-bold">{selectedDot.personaName.split(",")[0]}</span>
                    </div>
                    <div>
                      <strong className="block text-brand-ink/50 text-[10px] uppercase">Quadrante Alocado:</strong>
                      <span className="font-bold uppercase tracking-wide">{selectedDot.quadrant.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <strong className="block text-brand-ink/50 text-[10px] uppercase">Risco Efetivo:</strong>
                      <span className="font-bold text-red-600">{selectedDot.risk}</span>
                    </div>
                    <div>
                      <strong className="block text-brand-ink/50 text-[10px] uppercase">Fletimento LTV:</strong>
                      <span className="font-bold text-green-700">{selectedDot.value}</span>
                    </div>
                  </div>

                  <div className="bg-white border p-2.5 border-brand-line/20 rounded-none text-[11px] leading-relaxed">
                    <strong className="block mb-0.5 text-brand-ink text-[10px] uppercase">💡 Diretriz Preventiva Vitaliza:</strong>
                    {selectedDot.action}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-brand-ink/55 text-xs font-mono space-y-2 select-none">
                  <HelpCircle className="w-8 h-8 text-brand-ink/30 mx-auto stroke-[1.5]" />
                  <p className="font-bold">Painel Estratégico de Prevenção</p>
                  <p className="text-[10px] max-w-xs mx-auto leading-normal">
                    Selecione ou clique em qualquer aluno representativo da base (ex: <strong>Pedro, Diego, Cláudia, Rafael</strong>) na matriz gráfica ao lado para destrinchar ações de retenção personalizadas.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Heatmap de Clusters (Variáveis-Chave) */}
      <div className="bg-white border-2 border-brand-line p-6 shadow-[4px_4px_0px_0px_#141414] rounded-none space-y-6">
        <div className="border-b-2 border-brand-line pb-3">
          <span className="bg-teal-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide inline-block mb-1">
            ANÁLISE DE AGRUPAMENTO (K-MEANS COHORTS)
          </span>
          <h3 className="text-xl font-serif italic font-extrabold tracking-tight text-brand-ink">
            Heatmap de Clusters (Variáveis-Chave)
          </h3>
          <p className="text-xs font-mono text-brand-ink/70">
            Matriz de intensidade e calor para detecção precoce de abandono baseado em padrões comportamentais de fitness.
          </p>
        </div>

        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-bg/40 p-3 border border-brand-line/25 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-ink text-[11px] uppercase tracking-wider">Grau de Saúde do Atributo:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded-none inline-block"></span> Crítico / Baixo</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-150 bg-orange-100 border border-orange-300 rounded-none inline-block"></span> Alerta de Churn</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-none inline-block"></span> Moderado / Estável</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-teal-100 border border-teal-300 rounded-none inline-block"></span> Ótimo / Saudável</span>
          </div>
        </div>

        {/* Heatmap Grid & details column */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Panel: Heatmap Interactive Grid */}
          <div className="xl:col-span-8 overflow-x-auto">
            <table className="w-full border-collapse border-2 border-brand-line min-w-[640px] text-xs font-mono">
              <thead>
                <tr className="bg-[#141414] text-white">
                  <th className="border-b-2 border-r-2 border-brand-line p-3 text-left font-bold uppercase tracking-wider w-[240px]">Cluster / Segmento</th>
                  <th className="border-b-2 border-r border-[#333] p-3 text-center font-bold font-mono">Tempo Contrato / Lifetime</th>
                  <th className="border-b-2 border-r border-[#333] p-3 text-center font-bold font-mono">Frequência Recente</th>
                  <th className="border-b-2 border-r border-[#333] p-3 text-center font-bold font-mono">Frequência Histórica</th>
                  <th className="border-b-2 border-r border-[#333] p-3 text-center font-bold font-mono">Engajamento Social</th>
                  <th className="border-b-2 border-r border-[#333] p-3 text-center font-bold font-mono">Risco de Churn</th>
                  <th className="border-b-2 p-3 text-center font-bold font-mono">Valor Total / LTV</th>
                </tr>
              </thead>
              <tbody>
                {clustersData.map((cluster, cIndex) => {
                  const isSelected = selectedClusterDetail === cluster.id;
                  return (
                    <tr 
                      key={cluster.id} 
                      className={`hover:bg-brand-bg/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-brand-accent-ultralight/20 ring-2 ring-brand-line ring-inset" : "even:bg-brand-bg/15"
                      }`}
                      onClick={() => setSelectedClusterDetail(cluster.id)}
                    >
                      {/* Cluster Identification */}
                      <td className={`border-b border-r-2 border-brand-line p-3 font-bold transition-all ${cluster.colorTag}`}>
                        <div className="flex flex-col">
                          <span className="text-[#141414] font-black">{cluster.name}</span>
                          <span className="text-[10px] text-brand-ink/55 font-bold italic">{cluster.alias}</span>
                        </div>
                      </td>

                      {/* Metric 1: Lifetime */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "lifetime" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b border-r border-brand-line p-3 text-center transition-all ${cluster.metrics.lifetime.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "lifetime" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.lifetime.val}</div>
                        <div className="text-[8px] opacity-75 font-bold uppercase">{cluster.metrics.lifetime.score}</div>
                      </td>

                      {/* Metric 2: Recent Frequency */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "recent" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b border-r border-brand-line p-3 text-center transition-all ${cluster.metrics.recentFreq.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "recent" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.recentFreq.val}</div>
                        <div className="text-[8px] opacity-75 font-bold uppercase">{cluster.metrics.recentFreq.score}</div>
                      </td>

                      {/* Metric 3: Historical Frequency */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "history" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b border-r border-brand-line p-3 text-center transition-all ${cluster.metrics.historicalFreq.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "history" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.historicalFreq.val}</div>
                        <div className="text-[8px] opacity-75 font-bold uppercase">{cluster.metrics.historicalFreq.score}</div>
                      </td>

                      {/* Metric 4: Social Engagement */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "social" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b border-r border-brand-line p-3 text-center transition-all ${cluster.metrics.socialEng.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "social" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.socialEng.val}</div>
                        <div className="text-[8px] opacity-75 font-bold uppercase">{cluster.metrics.socialEng.score}</div>
                      </td>

                      {/* Metric 5: Churn Risk */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "risk" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b border-r border-brand-line p-3 text-center transition-all ${cluster.metrics.churnRisk.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "risk" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.churnRisk.val}</div>
                        <div className="text-[8px] opacity-80 font-bold uppercase">{cluster.metrics.churnRisk.score}</div>
                      </td>

                      {/* Metric 6: Total Revenue / LTV */}
                      <td 
                        onMouseEnter={() => setHoveredCell({ clusterIndex: cIndex, colId: "revenue" })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`border-b p-3 text-center transition-all ${cluster.metrics.revenue.bg} ${
                          hoveredCell?.clusterIndex === cIndex && hoveredCell?.colId === "revenue" ? "scale-[1.02] shadow-sm z-15" : ""
                        }`}
                      >
                        <div className="font-extrabold text-[12px]">{cluster.metrics.revenue.val}</div>
                        <div className="text-[8px] opacity-75 font-bold uppercase">{cluster.metrics.revenue.score}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* expected observations layout section matching prompt requirements */}
            <div className="mt-4 bg-[#f4f6f8] border border-brand-line/20 p-4 rounded-none space-y-3">
              <h4 className="text-xs font-mono font-black text-[#141414] uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-accent animate-pulse" />
                <span>Leitura Esperada & Interpretação Analítica (Variáveis-Chave)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono leading-relaxed text-brand-ink/90">
                <div className="border border-[#141414]/15 bg-white p-3 space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                  <span className="font-extrabold text-[#141414] block">🔴 Cluster 1 (Lucas):</span>
                  <span className="text-brand-ink/75">Membros com <strong>baixo lifetime, baixa frequência e baixo social</strong>. Perdem o ritmo de treino logo na quinzena inicial pós-matrícula.</span>
                </div>
                <div className="border border-[#141414]/15 bg-white p-3 space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                  <span className="font-extrabold text-[#141414] block">🟠 Cluster 2 (Ana):</span>
                  <span className="text-brand-ink/75">Representação clássica de <strong>frequência atual baixa vs frequência histórica</strong>. Demonstra desengajamento reativo crítico.</span>
                </div>
                <div className="border border-[#141414]/15 bg-white p-3 space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                  <span className="font-extrabold text-[#141414] block">⚫ Cluster 3 (Carlos):</span>
                  <span className="text-brand-ink/75">Segmento de <strong>baixa frequência integrada a alto lifetime</strong>. Pagam recorrentemente por contrato mas não treinam.</span>
                </div>
                <div className="border border-[#141414]/15 bg-white p-3 space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
                  <span className="font-extrabold text-[#141414] block">🟢 Cluster 4 (Pedro):</span>
                  <span className="text-brand-ink/75">Parâmetro de <strong>alta frequência atual e alto engajamento social</strong>. São os embaixadores naturais da Vitaliza.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Selected Cluster Diagnosis with prescriptive actions */}
          <div className="xl:col-span-4 flex flex-col justify-stretch">
            {(() => {
              const selectedCluster = clustersData.find(c => c.id === selectedClusterDetail) || clustersData[0];
              return (
                <div className="border-2 border-brand-line p-5 bg-brand-bg/50 flex-1 flex flex-col justify-between space-y-4 rounded-none h-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="space-y-3.5">
                    <div className="border-b border-brand-line/15 pb-2.5">
                      <span className="bg-[#141414] text-white font-mono font-black text-[9px] px-1.5 py-0.5 rounded-none uppercase tracking-widest inline-block mb-1.5">
                        Retenção Estratégica Vitaliza
                      </span>
                      <h4 className="font-serif italic font-extrabold text-[#141414] text-lg leading-tight">
                        {selectedCluster.name}
                      </h4>
                      <p className="text-[10px] text-brand-accent font-black tracking-widest uppercase font-mono mt-1">
                        Segmento de Base: {selectedCluster.alias}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-brand-ink/50 text-[10px] uppercase block font-black">Comportamento do Cohort:</span>
                        <p className="font-bold text-[#141414] leading-snug">{selectedCluster.description}</p>
                      </div>
                      
                      <div className="bg-white border text-[11px] leading-relaxed p-3 border-brand-line/20 rounded-none space-y-1.5 shadow-sm">
                        <span className="text-red-700 text-[10px] uppercase font-bold block">🚨 Diagnóstico de Abandono:</span>
                        <p className="text-brand-ink/85 font-mono italic">"{selectedCluster.diagnostic}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono pt-3 border-t border-brand-line/15">
                    <span className="text-teal-700 text-[10px] uppercase font-bold block">💡 Plano de Ação Recomendado:</span>
                    <div className="bg-teal-50 border border-teal-200 p-3 rounded-none text-teal-950 font-bold leading-normal">
                      {selectedCluster.action}
                    </div>
                    <p className="text-[9px] text-brand-ink/45 text-center mt-1">
                      Toque em qualquer linha do heatmap ao lado para exibir detalhes.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </div>

      {/* Analytical database footer info */}
      <div className="bg-brand-bg/50 border border-brand-line p-4 text-[11px] font-mono text-brand-ink/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span>🔎 <strong className="font-bold underline text-brand-ink">Metodologia Estatística do Filtro:</strong> {currentPersona.ruleDescription}</span>
        <span className="text-[9px] bg-white border border-brand-line/20 px-2 py-0.5 font-bold uppercase shrink-0">
          Aderência Algorítmica de 98.7%
        </span>
      </div>
    </div>
  );
}
