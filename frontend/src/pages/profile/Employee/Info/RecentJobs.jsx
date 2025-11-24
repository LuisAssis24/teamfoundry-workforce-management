import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import { listCandidateJobs } from "../../../../api/candidateJobs.js";
import { useEmployeeProfile } from "../EmployeeProfileContext.jsx";

export default function RecentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { profile, refreshProfile, jobsData, setJobsData } = useEmployeeProfile();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    let isMounted = true;
    // Reutiliza cache de jobs; só chama API se ainda não houver dados.
    async function loadJobs() {
      try {
        const data = jobsData || (await listCandidateJobs({ status: "COMPLETED", page: 0, size: 10 }));
        if (!isMounted) return;
        setJobs(data?.content ?? []);
        if (!jobsData) setJobsData(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Nuo foi poss??vel carregar os gltimos trabalhos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadJobs();
    if (!profile) {
      refreshProfile().then((data) => {
        if (isMounted && data) {
          setDisplayName(formatName(data.firstName, data.lastName));
        }
      });
    } else {
      setDisplayName(formatName(profile.firstName, profile.lastName));
    }
    return () => {
      isMounted = false;
    };
  }, [profile, refreshProfile, jobsData, setJobsData]);

  return (
    <section>
      <ProfileHeader name={displayName} />
      <ProfileTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6 space-y-4">
          {error && (
            <div className="alert alert-error text-sm" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <SkeletonList />
          ) : jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JobCard({ job }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <i className="bi bi-building text-lg" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="font-semibold">{job.companyName}</span>
            <span className="text-sm text-base-content/70">
              {job.location || "Local não informado"}
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-base-content/70">
          <div>{formatDateRange(job.startDate, job.endDate)}</div>
          {job.status && (
            <span className="badge badge-ghost mt-1">{toStatusLabel(job.status)}</span>
          )}
        </div>
      </div>

      <div className="border-t border-base-300 px-4 py-3 flex items-center gap-3 text-sm">
        <i className="bi bi-briefcase" aria-hidden="true" />
        <span className="text-base-content/90">Função: {job.role}</span>
      </div>

      <div className="border-t border-base-300 px-4 py-3 flex items-center gap-3 text-sm">
        <i className="bi bi-cash-coin" aria-hidden="true" />
        <span className="text-base-content/90">
          Pagamento: {formatPay(job.payRate, job.payUnit)}
        </span>
      </div>
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
      Ainda não existem registos de trabalhos concluídos para este candidato.
    </div>
  );
}

function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim();
  const trimmedLast = lastName?.trim();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}
function formatDateRange(start, end) {
  const options = { year: "numeric", month: "short" };
  const format = (date) => (date ? new Date(date).toLocaleDateString("pt-PT", options) : "—");
  return `${format(start)} · ${format(end)}`;
}

function formatPay(rate, unit) {
  if (!rate || !unit) return "Não informado";
  const unitLabel = { HOUR: "hora", DAY: "dia", MONTH: "mês" }[unit] || unit.toLowerCase();
  return `${Number(rate).toFixed(2)} € / ${unitLabel}`;
}

function toStatusLabel(status) {
  const labels = {
    COMPLETED: "Concluído",
    ACTIVE: "Ativo",
    PLANNED: "Planeado",
    CANCELLED: "Cancelado",
  };
  return labels[status] || status;
}


