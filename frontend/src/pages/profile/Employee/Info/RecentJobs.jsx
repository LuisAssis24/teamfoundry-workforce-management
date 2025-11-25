import { useEffect, useState } from "react";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import { useEmployeeProfile } from "../EmployeeProfileContext.jsx";
import RecentJobCard from "./components/RecentJobCard.jsx";
import { listEmployeeJobs } from "../../../../api/profile/profileJobs.js";

export default function RecentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { profile, refreshProfile, jobsData, setJobsData } = useEmployeeProfile();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        if (jobsData) {
          setJobs(jobsData);
          return;
        }
        const data = await listEmployeeJobs();
        if (!isMounted) return;
        setJobs(Array.isArray(data) ? data : []);
        setJobsData(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError(err.message || "Não foi possível carregar os trabalhos.");
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
                <RecentJobCard key={job.requestId ?? job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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
      Ainda não existem registos de trabalhos concluídos.
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

