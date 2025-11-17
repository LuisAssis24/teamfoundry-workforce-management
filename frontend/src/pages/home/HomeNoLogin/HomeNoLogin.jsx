import { useEffect, useMemo, useState } from "react";
import { fetchPublicHomepage } from "../../../api/siteManagement.js";
import Navbar from "../../../components/sections/Navbar.jsx";
import Footer from "../../../components/sections/Footer.jsx";
import logoPrimary from "../../../assets/images/logo/teamFoundry_LogoPrimary.png";

const SECTION_COMPONENTS = {
  HERO: HeroSection,
  INDUSTRIES: IndustriesSection,
  PARTNERS: PartnersSection,
};

const SECTION_NAV_LINKS = {
  HERO: { to: "#hero", label: "Topo" },
  INDUSTRIES: { to: "#industrias", label: "Indústrias" },
  PARTNERS: { to: "#parceiros", label: "Parceiros" },
};

export function HomeNoLogin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPublicHomepage()
      .then((payload) => {
        if (active) {
          setData(payload);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Falha ao carregar a página inicial.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const orderedSections = useMemo(() => {
    if (!Array.isArray(data?.sections)) return [];
    return [...data.sections]
      .filter((section) => section.active)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [data]);

  const navLinks = [];

  const renderSection = (section) => {
    const Component = SECTION_COMPONENTS[section.type];
    if (!Component) return null;
    return (
      <Component
        key={section.id}
        section={section}
        industries={data?.industries ?? []}
        partners={data?.partners ?? []}
      />
    );
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar variant="public" homePath="/" links={navLinks} />
      {loading && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {error && !loading && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="alert alert-error shadow-lg max-w-lg">
            <i className="bi bi-exclamation-triangle-fill text-xl" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {orderedSections.length ? (
            orderedSections.map(renderSection)
          ) : (
            <div className="max-w-6xl mx-auto px-6 py-24">
              <EmptyState message="Nenhuma secção foi ativada ainda." />
            </div>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

function HeroSection({ section }) {
  const title = section?.title ?? "TeamFoundry";
  const subtitle =
    section?.subtitle ??
    "A forma mais fácil de conectar profissionais a projetos industriais e criar equipas de alto desempenho.";

  return (
    <section id="hero" className="bg-base-100 text-base-content border-b border-base-200">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-5">
        <div className="flex items-center justify-center gap-3">
          <img src={logoPrimary} alt="TeamFoundry" className="h-12 w-12 object-contain" />
          <span className="text-xl font-semibold tracking-[0.2em] uppercase text-primary">
            TeamFoundry
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-base-content">{title}</h1>
        <p className="text-lg text-base-content/70 leading-relaxed">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {section?.primaryCtaLabel && section?.primaryCtaUrl && (
            <a href={section.primaryCtaUrl} className="btn btn-primary btn-wide shadow">
              {section.primaryCtaLabel}
            </a>
          )}
          {section?.secondaryCtaLabel && section?.secondaryCtaUrl && (
            <a href={section.secondaryCtaUrl} className="btn btn-outline btn-wide shadow-sm">
              {section.secondaryCtaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection({ section, industries }) {
  return (
    <section id="industrias" className="max-w-6xl mx-auto px-6 py-16 space-y-10">
      <SectionHeader
        section={section}
        fallbackTitle="Indústrias em que atuamos"
        fallbackSubtitle="Segmentos onde ligamos empresas e profissionais especializados."
      />
      {industries?.length ? (
        <div className="grid gap-8 md:grid-cols-3">
          {industries.map((industry) => (
            <article
              key={industry.id}
              className="card bg-base-100 shadow-xl overflow-hidden border border-base-200"
            >
              <figure className="h-56 bg-base-200">
                <ShowcaseImage src={industry.imageUrl} alt={industry.name} />
              </figure>
              <div className="card-body space-y-3">
                <h3 className="card-title text-2xl">{industry.name}</h3>
                {industry.description && (
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {industry.description}
                  </p>
                )}
                {industry.linkUrl && (
                  <a
                    href={industry.linkUrl}
                    className="link link-primary text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Saber mais
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="Ainda não há indústrias destacadas." />
      )}
    </section>
  );
}

function PartnersSection({ section, partners }) {
  return (
    <section id="parceiros" className="bg-base-200 py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <SectionHeader
          section={section}
          fallbackTitle="Parceiros principais"
          fallbackSubtitle="Empresas que confiam na TeamFoundry para acelerar os seus projetos."
        />
        {partners?.length ? (
          <div className="grid gap-8 md:grid-cols-2">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="bg-base-100 rounded-2xl shadow-lg p-6 space-y-4 border border-base-300"
              >
                <div className="h-64 rounded-xl overflow-hidden bg-base-200">
                  <ShowcaseImage src={partner.imageUrl} alt={partner.name} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-primary">{partner.name}</h3>
                  <p className="text-sm text-base-content/80 leading-relaxed">
                    {partner.description}
                  </p>
                </div>
                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    className="btn btn-link px-0 text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visitar website
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Ainda não há parceiros publicados." />
        )}
      </div>
    </section>
  );
}

function SectionHeader({ section, fallbackTitle, fallbackSubtitle }) {
  const hasSubtitle = (section?.subtitle ?? fallbackSubtitle)?.length;
  return (
    <div className="text-center space-y-3">
      <p className="text-xs uppercase tracking-[0.5em] text-primary/70">
        TeamFoundry
      </p>
      <h2 className="text-3xl font-bold">{section?.title ?? fallbackTitle}</h2>
      {hasSubtitle && (
        <p className="text-base-content/70 max-w-3xl mx-auto">
          {section?.subtitle ?? fallbackSubtitle}
        </p>
      )}
    </div>
  );
}

function ShowcaseImage({ src, alt }) {
  if (!src) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-base-200 text-base-content/50">
        {alt}
      </div>
    );
  }
  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />;
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/60 p-10 text-center">
      <p className="text-base-content/60">{message}</p>
    </div>
  );
}
