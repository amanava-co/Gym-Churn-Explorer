import React, { useState } from "react";
import { GymMember, getCSVString } from "../gym_churn_data";
import { Search, Download, Trash2, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

interface CsvTableProps {
  id: string;
  members: GymMember[];
  onAddMember: (m: GymMember) => void;
  onResetData: () => void;
}

export function CsvTable({ id, members, onAddMember, onResetData }: CsvTableProps) {
  // Filtering & Pagination state
  const [search, setSearch] = useState("");
  const [churnFilter, setChurnFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<keyof GymMember>("Lifetime");
  const [sortAsc, setSortAsc] = useState(false);

  // Modal form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<GymMember>>({
    gender: 1,
    Near_Location: 1,
    Partner: 0,
    Promo_friends: 0,
    Phone: 1,
    Contract_period: 1,
    Group_visits: 0,
    Age: 25,
    Avg_additional_charges_total: 80,
    Month_to_end_contract: 1,
    Lifetime: 1,
    Avg_class_frequency_total: 1.5,
    Avg_class_frequency_current_month: 1.0,
    Churn: 0
  });

  const handleSort = (field: keyof GymMember) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMember: GymMember = {
      gender: Number(newMember.gender ?? 1),
      Near_Location: Number(newMember.Near_Location ?? 1),
      Partner: Number(newMember.Partner ?? 0),
      Promo_friends: Number(newMember.Promo_friends ?? 0),
      Phone: Number(newMember.Phone ?? 1),
      Contract_period: Number(newMember.Contract_period ?? 1),
      Group_visits: Number(newMember.Group_visits ?? 0),
      Age: Number(newMember.Age ?? 25),
      Avg_additional_charges_total: Number(newMember.Avg_additional_charges_total ?? 80),
      Month_to_end_contract: Number(newMember.Month_to_end_contract ?? 1),
      Lifetime: Number(newMember.Lifetime ?? 1),
      Avg_class_frequency_total: Number(newMember.Avg_class_frequency_total ?? 1.5),
      Avg_class_frequency_current_month: Number(newMember.Avg_class_frequency_current_month ?? 1.0),
      Churn: Number(newMember.Churn ?? 0)
    };
    onAddMember(cleanMember);
    setIsAddOpen(false);
    // Reset Form
    setNewMember({
      gender: 1,
      Near_Location: 1,
      Partner: 0,
      Promo_friends: 0,
      Phone: 1,
      Contract_period: 1,
      Group_visits: 0,
      Age: 25,
      Avg_additional_charges_total: 80,
      Month_to_end_contract: 1,
      Lifetime: 1,
      Avg_class_frequency_total: 1.5,
      Avg_class_frequency_current_month: 1.0,
      Churn: 0
    });
  };

  const downloadCSV = () => {
    const csvContent = getCSVString(members);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "gym_churn_us_modified.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search logic
  const filteredMembers = members.filter(m => {
    // Churn filter
    if (churnFilter === "active" && m.Churn !== 0) return false;
    if (churnFilter === "churned" && m.Churn !== 1) return false;

    // Search query matched on numeric age or other properties if relevant
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchAge = m.Age.toString().includes(q);
      const matchLifetime = m.Lifetime.toString().includes(q);
      const matchContract = m.Contract_period.toString().includes(q);
      return matchAge || matchLifetime || matchContract;
    }

    return true;
  });

  // Sorting logic
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination bounds
  const totalRows = sortedMembers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex);

  return (
    <div id={id} className="bg-white rounded-none border-2 border-brand-line shadow-[4px_4px_0px_0px_#141414] overflow-hidden">
      {/* Search and Action Bar */}
      <div className="p-5 border-b border-brand-line flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-brand-bg/40 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-ink/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por idade, plano ou lifetime..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-1.5 rounded-none border border-brand-line text-xs text-brand-ink bg-white placeholder-brand-ink/40 focus:outline-hidden focus:border-brand-accent transition-all w-full sm:w-[250px]"
            />
          </div>

          <select
            value={churnFilter}
            onChange={(e) => { setChurnFilter(e.target.value); setCurrentPage(1); }}
            className="py-1.5 px-3 rounded-none border border-brand-line text-xs text-brand-ink bg-white focus:outline-hidden focus:border-brand-accent"
          >
            <option value="all">Filtro: Todos</option>
            <option value="active">Apenas Ativos (Churn = 0)</option>
            <option value="churned">Apenas Cancelados (Churn = 1)</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-bold font-mono py-2 px-4 rounded-none border border-brand-line cursor-pointer shadow-[2px_2px_0px_0px_#141414] transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Membro
          </button>
          
          <button
            onClick={downloadCSV}
            title="Exportar dados para gym_churn_us_modified.csv"
            className="p-2 bg-white hover:bg-brand-bg/40 border border-brand-line rounded-none text-xs text-brand-ink font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onResetData}
            title="Restaurar dataset original"
            className="p-2 bg-red-100 hover:bg-red-200 border border-brand-line rounded-none text-red-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>
        </div>
      </div>

      {/* Dataset Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-brand-ink">
          <thead>
            <tr className="bg-brand-ink border-b border-brand-line text-white font-mono font-bold uppercase tracking-wider">
              {/* Table Column sorting headers */}
              <th className="p-4 pl-6 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("gender")}>Gênero {sortField === "gender" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Age")}>Idade {sortField === "Age" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Contract_period")}>Contrato {sortField === "Contract_period" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Lifetime")}>Lifetime {sortField === "Lifetime" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Avg_class_frequency_current_month")}>Freq Mês {sortField === "Avg_class_frequency_current_month" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Group_visits")}>Grupo {sortField === "Group_visits" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 cursor-pointer hover:bg-brand-accent-light/10 select-none border-r border-brand-line/20" onClick={() => handleSort("Avg_additional_charges_total")}>Gastos Extras {sortField === "Avg_additional_charges_total" && (sortAsc ? "▲" : "▼")}</th>
              <th className="p-4 pr-6 cursor-pointer hover:bg-brand-accent-light/10 select-none" onClick={() => handleSort("Churn")}>Churn Status {sortField === "Churn" && (sortAsc ? "▲" : "▼")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line font-mono text-[11px]">
            {paginatedMembers.map((m, idx) => (
              <tr key={idx} className="hover:bg-brand-bg/35 transition-colors border-b border-brand-line">
                <td className="p-4 pl-6 font-medium text-brand-ink border-r border-brand-line/10">
                  {m.gender === 1 ? "Masculino" : "Feminino"}
                </td>
                <td className="p-4 font-bold text-brand-ink border-r border-brand-line/10">{m.Age} anos</td>
                <td className="p-4 border-r border-brand-line/10">
                  <span className={`inline-flex items-center px-2 py-0.5 border border-brand-line rounded-none text-[10px] font-bold ${
                    m.Contract_period === 12
                      ? "bg-brand-ink text-white"
                      : m.Contract_period === 6
                        ? "bg-white text-brand-ink"
                        : "bg-brand-bg text-brand-ink/75"
                  }`}>
                    {m.Contract_period === 12 ? "12 Meses (Anual)" : m.Contract_period === 6 ? "6 Meses" : "1 Mês (Mensal)"}
                  </span>
                </td>
                <td className="p-4 text-brand-ink border-r border-brand-line/10">{m.Lifetime} {m.Lifetime === 1 ? "mês" : "meses"}</td>
                <td className="p-4 text-brand-ink border-r border-brand-line/10">{m.Avg_class_frequency_current_month.toFixed(2)} /semana</td>
                <td className="p-4 border-r border-brand-line/10">
                  {m.Group_visits === 1 ? (
                    <span className="font-bold text-brand-ink">[✓] Sim</span>
                  ) : (
                    <span className="text-brand-ink/40">[ ] Não</span>
                  )}
                </td>
                <td className="p-4 font-bold text-brand-ink border-r border-brand-line/10">R$ {m.Avg_additional_charges_total.toFixed(0)}</td>
                <td className="p-4 pr-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 border border-brand-line rounded-none text-[10px] font-extrabold uppercase tracking-wide ${
                    m.Churn === 1
                      ? "bg-brand-accent text-white"
                      : "bg-white text-brand-ink"
                  }`}>
                    {m.Churn === 1 ? "Cancelou" : "Ativo"}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedMembers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-brand-ink/50 text-xs">
                  Nenhum registro encontrado correspondente aos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      <div className="p-4 border-t border-brand-line flex flex-col sm:flex-row gap-3 items-center justify-between text-xs font-mono text-brand-ink/75 bg-brand-bg/40">
        <div>
          Mostrando <span className="font-bold text-brand-ink">{totalRows > 0 ? startIndex + 1 : 0}</span> até{" "}
          <span className="font-bold text-brand-ink">{Math.min(endIndex, totalRows)}</span> de{" "}
          <span className="font-bold text-brand-ink">{totalRows}</span> membros filtrados
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={validPage === 1}
            className="p-1.5 rounded-none border border-brand-line bg-white hover:bg-brand-bg/40 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-medium text-brand-ink/90">
            Página <span className="font-bold text-brand-accent">{validPage}</span> de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={validPage === totalPages}
            className="p-1.5 rounded-none border border-brand-line bg-white hover:bg-brand-bg/40 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Member modal Drawer overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-brand-ink/80 flex items-center justify-center p-4 z-50">
          <div className="bg-brand-bg rounded-none border-4 border-brand-line shadow-[8px_8px_0px_0px_rgba(20,20,20,0.5)] p-6 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-brand-line mb-5">
              <h3 className="text-sm font-mono font-bold text-brand-ink">Cadastrar Novo Membro no Dataset</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-brand-ink hover:text-brand-accent text-sm font-bold p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Gênero</label>
                  <select
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.gender}
                    onChange={(e) => setNewMember(prev => ({ ...prev, gender: parseInt(e.target.value) }))}
                  >
                    <option value={1}>Masculino</option>
                    <option value={0}>Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Idade</label>
                  <input
                    type="number"
                    min="16"
                    max="80"
                    required
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Age}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Age: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Contrato (Meses)</label>
                  <select
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Contract_period}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Contract_period: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1 Mês (Mensal)</option>
                    <option value={6}>6 Meses</option>
                    <option value={12}>12 Meses (Anual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Fidelidade (Lifetime)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Lifetime}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Lifetime: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Freq Total Semanal</label>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    step="0.1"
                    required
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Avg_class_frequency_total}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Avg_class_frequency_total: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Freq Semanal Atual</label>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    step="0.1"
                    required
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Avg_class_frequency_current_month}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Avg_class_frequency_current_month: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Gastos Extras (R$)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    required
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs outline-none"
                    value={newMember.Avg_additional_charges_total}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Avg_additional_charges_total: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-brand-ink/65 font-bold mb-1">Status Churn</label>
                  <select
                    className="w-full p-2 border border-brand-line rounded-none bg-white text-xs font-bold outline-none"
                    value={newMember.Churn}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Churn: parseInt(e.target.value) }))}
                  >
                    <option value={0}> Ativo (Churn = 0)</option>
                    <option value={1}> Cancelado (Churn = 1)</option>
                  </select>
                </div>
              </div>

              {/* Binary Switches checkboxes  */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4 bg-white p-3 border border-brand-line select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.Group_visits === 1}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Group_visits: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-brand-accent cursor-pointer"
                  />
                  <span>Aulas em Grupo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.Partner === 1}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Partner: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-brand-accent cursor-pointer"
                  />
                  <span>Convênio Parceiro</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.Promo_friends === 1}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Promo_friends: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-brand-accent cursor-pointer"
                  />
                  <span>Promo Amigos</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.Near_Location === 1}
                    onChange={(e) => setNewMember(prev => ({ ...prev, Near_Location: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 accent-brand-accent cursor-pointer"
                  />
                  <span>Mora Perto</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-brand-line mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-1.5 px-4 rounded-none border-2 border-brand-line bg-white text-brand-ink hover:bg-brand-bg/40 cursor-pointer font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-none border-2 border-brand-line bg-brand-accent hover:bg-brand-accent/90 text-white font-bold cursor-pointer shadow-[2px_2px_0px_0px_#141414] transition-all"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
