import { useEffect, useState } from "react";
import { listEmployeeOffers, acceptEmployeeOffer, listEmployeeJobs } from "../../../../api/profile/profileJobs.js";
import { useEmployeeProfile } from "../EmployeeProfileContext.jsx";
import JobOfferCard from "./JobOfferCard.jsx";

export default function JobOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const { setJobsData, jobsData, offersData, setOffersData, offersLoaded, setOffersLoaded } = useEmployeeProfile();

  useEffect(() => {
    let isMounted = true;
    async function loadOffers() {
      // Se já existem ofertas cacheadas, evita novo request.
      if (offersLoaded && Array.isArray(offersData)) {
        setOffers(offersData);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await listEmployeeOffers();
        if (!isMounted) return;
        setOffers(Array.isArray(data) ? data : []);
        setOffersData(Array.isArray(data) ? data : []);
        setOffersLoaded(true);
      } catch (err) {
        if (isMounted) setError(err.message || "Não foi possível carregar as ofertas.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOffers();
    return () => {
      isMounted = false;
    };
  }, [offersData, offersLoaded, setOffersData, setOffersLoaded]);

  const handleAccept = async (id) => {
    setError("");
    setFeedback("");
    try {
      await acceptEmployeeOffer(id);
      const next = (prev) => prev.filter((offer) => offer.requestId !== id && offer.id !== id);
      setOffers(next);
      setOffersData(next);
      // Refresh histórico após aceitar
      const history = await listEmployeeJobs();
      setJobsData(Array.isArray(history) ? history : jobsData);
      setFeedback("Oferta aceite com sucesso.");
    } catch (err) {
      setError(err.message || "Não foi possível aceitar a oferta.");
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <i className="bi bi-bell-fill text-4xl text-primary" aria-hidden="true" />
        <h2 className="text-3xl font-semibold">Ofertas de Trabalho</h2>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6 space-y-4">
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

          {loading ? (
            <SkeletonList />
          ) : offers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {offers.map((offer) => (
                <JobOfferCard key={offer.requestId ?? offer.id} offer={offer} onAccept={handleAccept} />
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
      Não existem ofertas pendentes neste momento.
    </div>
  );
}
