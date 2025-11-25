import { useEffect, useMemo, useState } from "react";
import TeamManagementCard from "./TeamManagementCard.jsx";
import SuperAdminNavbar from "../SuperAdmin/SuperAdminNavbar.jsx";
import { teamRequestsAPI } from "../../../api/teamRequests.js";

const STATUS_OPTIONS = [
    { value: "ALL", label: "Todos" },
    { value: "PENDING", label: "Pendente" },
    { value: "ACCEPTED", label: "Aceite" },
    { value: "COMPLETE", label: "Concluída" },
    { value: "INCOMPLETE", label: "Incompleta" },
    { value: "REJECTED", label: "Rejeitada" },
];

const DATE_ORDER_OPTIONS = [
    { value: "DESC", label: "Mais recentes" },
    { value: "ASC", label: "Mais antigos" },
];

const WORKFORCE_ORDER_OPTIONS = [
    { value: "DESC", label: "Maior MdO" },
    { value: "ASC", label: "Menor MdO" },
];

export default function TeamManagement() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [dateOrder, setDateOrder] = useState("DESC");
    const [workforceOrder, setWorkforceOrder] = useState("DESC");

    useEffect(() => {
        let canceled = false;

        async function loadAssignedRequests() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await teamRequestsAPI.getAssignedToMe();
                if (!canceled) setRequests(data);
            } catch (err) {
                if (!canceled) setError(err.message || "Erro ao carregar as requisições atribuídas.");
            } finally {
                if (!canceled) setIsLoading(false);
            }
        }

        loadAssignedRequests();
        return () => {
            canceled = true;
        };
    }, []);

    const filteredRequests = useMemo(() => {
        const list = [...requests];

        const byStatus =
            statusFilter === "ALL" ? list : list.filter((request) => request.state === statusFilter);

        const sorted = byStatus.sort((a, b) => {
            if (workforceOrder) {
                const diff =
                    workforceOrder === "ASC"
                        ? a.workforceNeeded - b.workforceNeeded
                        : b.workforceNeeded - a.workforceNeeded;
                if (diff !== 0) return diff;
            }

            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();
            return dateOrder === "ASC" ? dateA - dateB : dateB - dateA;
        });

        return sorted.map((request) => ({
            id: request.id,
            company: request.companyName ?? "N/A",
            email: request.companyEmail ?? "N/A",
            phone: request.companyPhone ?? "N/A",
            workforce:
                request.workforceNeeded > 0
                    ? `${request.workforceNeeded} funcionários`
                    : "Sem requisições de funcionários",
        }));
    }, [requests, statusFilter, dateOrder, workforceOrder]);

    const filterControls = [
        {
            id: "status",
            label: "Status",
            value: statusFilter,
            options: STATUS_OPTIONS,
            onChange: (event) => setStatusFilter(event.target.value),
        },
        {
            id: "date",
            label: "Data",
            value: dateOrder,
            options: DATE_ORDER_OPTIONS,
            onChange: (event) => setDateOrder(event.target.value),
        },
        {
            id: "workforce",
            label: "MdO",
            value: workforceOrder,
            options: WORKFORCE_ORDER_OPTIONS,
            onChange: (event) => setWorkforceOrder(event.target.value),
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            <SuperAdminNavbar />
            <main className="flex justify-center px-6 pb-16 pt-10">
                <div className="w-full max-w-6xl">
                    <div className="flex flex-col gap-6 rounded-2xl bg-[#F0F0F0] p-8 shadow">
                        <header className="flex flex-wrap items-center justify-center">
                            <h1 className="text-3xl font-bold text-[#1F2959]">Equipas</h1>
                        </header>

                        <section className="grid gap-4 md:grid-cols-3">
                            {filterControls.map((control) => (
                                <div
                                    key={control.id}
                                    className="rounded-2xl border border-[#60678E] bg-[#F0F0F0] p-4 shadow flex items-center justify-between gap-3"
                                >
                                    <span className="text-lg font-medium text-[#2C3A74]">{control.label}:</span>
                                    <select
                                        value={control.value}
                                        onChange={control.onChange}
                                        className="select select-ghost text-sm bg-[#F0F0F0] text-[#1F2959]"
                                    >
                                        {control.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </section>

                        {error && (
                            <div className="alert alert-error shadow">
                                <span>{error}</span>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="py-10 text-center text-base-content/70">
                                Carregando requisições atribuídas...
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="alert alert-info shadow">
                                <span>Nenhuma requisição encontrada com os filtros selecionados.</span>
                            </div>
                        ) : (
                            <section className="flex flex-col gap-4">
                                {filteredRequests.map((team) => (
                                    <TeamManagementCard key={team.id} {...team} />
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
