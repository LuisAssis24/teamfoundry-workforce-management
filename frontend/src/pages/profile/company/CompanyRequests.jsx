import { useEffect, useMemo, useState } from "react";
import Tabs from "../../../components/sections/Tabs.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import Modal from "../../../components/ui/Modal/Modal.jsx";
import InputField from "../../../components/ui/Input/InputField.jsx";
import { useCompanyProfile } from "./CompanyProfileContext.jsx";
import CompanyRequestCard from "./components/CompanyRequestCard.jsx";
import { createCompanyRequest } from "../../../api/profile/companyRequests.js";

const TABS = [
  { key: "ACTIVE", label: "Ativas" },
  { key: "PENDING", label: "Pendentes" },
  { key: "PAST", label: "Passadas" },
];

/**
 * Página de requisições da empresa: tabs + botão para criar requisição.
 */
export default function CompanyRequests() {
  const {
    requestsData,
    requestsLoaded,
    refreshRequests,
    setRequestsData,
    setRequestsLoaded,
  } = useCompanyProfile();

  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    teamName: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await refreshRequests();
        if (!mounted) return;
        setRequestsData(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || "Não foi possível carregar as requisições.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!requestsLoaded) {
      load();
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [refreshRequests, requestsLoaded, setRequestsData]);

  const filteredRequests = useMemo(
    () => (requestsData || []).filter((req) => req.computedStatus === activeTab),
    [requestsData, activeTab]
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFeedback("");
    try {
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      const created = await createCompanyRequest(payload);
      const updated = [created, ...(requestsData || [])];
      setRequestsData(updated);
      setRequestsLoaded(true);
      setFeedback("Requisição criada com sucesso.");
      setModalOpen(false);
      setForm({ teamName: "", description: "", location: "", startDate: "", endDate: "" });
      // muda para tab coerente com o status calculado
      if (created?.computedStatus) {
        setActiveTab(created.computedStatus);
      }
    } catch (err) {
      setError(err.message || "Não foi possível criar a requisição.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-base-content/70">Gestão de requisições</p>
          <h1 className="text-3xl font-semibold">Requisições</h1>
        </div>
        <Button
          label="Fazer requisição"
          variant="primary"
          fullWidth={false}
          onClick={() => setModalOpen(true)}
        />
      </header>

      <Tabs
        tabs={TABS.map((tab) => ({ key: tab.key, label: tab.label }))}
        activeKey={activeTab}
        onTabChange={setActiveTab}
      />

      {error && (
        <div className="alert alert-error text-sm" role="alert">
          {error}
        </div>
      )}
      {feedback && (
        <div className="alert alert-success text-sm" role="status">
          {feedback}
        </div>
      )}

      <section className="rounded-xl border border-base-300 bg-base-100 shadow p-5 min-h-[50vh]">
        {loading ? (
          <SkeletonList />
        ) : filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <CompanyRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-20 bg-base-200 rounded-xl" />
      <div className="h-20 bg-base-200 rounded-xl" />
      <div className="h-20 bg-base-200 rounded-xl" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-base-content/70 py-12 border border-dashed border-base-300 rounded-xl">
      Ainda não existem requisições nesta categoria.
    </div>
  );
}
