import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/sections/Navbar.jsx";
import Footer from "../../../components/sections/Footer.jsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";

const METRICS = [
  { label: "Equipas concluidas", value: "8" },
  { label: "Requisições em aberto", value: "15" },
  { label: "Horas trabalhadas", value: "320h" },
  { label: "Avaliações médias", value: "4.7" },
];

const NEWS_PLACEHOLDERS = Array.from({ length: 6 });

const WEEKLY_TIP = {
  title: "Segurança em primeiro lugar!",
  description: [
    "Antes de começares o turno, confirma se todos os equipamentos est\u00e3o em boas condi\u00e7\u00f5es.",
    "Pequenos cuidados evitam grandes acidentes.",
  ],
};

export default function HomeLogin() {
  const { profile, loadingProfile, refreshProfile, logout } = useAuth();

  useEffect(() => {
    if (!profile && !loadingProfile) {
      refreshProfile();
    }
  }, [profile, loadingProfile, refreshProfile]);

  const displayName = profile?.firstName
    ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`
    : "Utilizador";

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Navbar variant="private" homePath="/home-login" links={[]} onLogout={logout} />
      <main className="flex-1">
        <HeroPanel displayName={displayName} loading={loadingProfile} />
        <MetricsSection />
        <WeeklyTipSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroPanel({ displayName, loading }) {
  return (
    <section className="bg-base-200/40 py-12 border-b border-base-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl bg-base-100 shadow-xl border border-base-300 p-8 flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Bem-vindo</p>
            <h1 className="text-4xl font-bold text-base-content">Olá {displayName}</h1>
            <p className="text-lg text-base-content/70">Perfil 0%</p>
          </div>
          <div className="text-base-content/70 space-y-1">
            <p>Equipa atual: Montagem - Empresa Alfa</p>
            <p>Requisições disponíveis: 2 novas oportunidades</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/candidato/dados-pessoais" className="btn btn-primary">
              Atualizar perfil
            </Link>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="loading loading-spinner loading-xs" />
                <span>A carregar dados do perfil</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-base-content">As tuas métricas</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {METRICS.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-base-200 bg-base-100 shadow-sm p-6 text-center"
          >
            <p className="text-4xl font-bold text-primary">{metric.value}</p>
            <p className="mt-2 text-sm uppercase tracking-wide text-base-content/70">
              {metric.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WeeklyTipSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <div className="rounded-3xl border border-base-200 bg-base-100 shadow p-8 space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-primary/80">Dica da Semana</p>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-base-content">{WEEKLY_TIP.title}</h3>
          {WEEKLY_TIP.description.map((paragraph, index) => (
            <p key={index} className="text-base-content/70 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <div>
          <button type="button" className="btn btn-primary btn-sm">
            Ver mais
          </button>
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  return (
    <section className="bg-base-200/40 border-t border-b border-base-200 py-14">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-base-content">Notícias Recentes</h2>
          <p className="text-sm text-base-content/70">
           As Apis estão sendo preparadas para a integração
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {NEWS_PLACEHOLDERS.map((_, idx) => (
            <article
              key={`news-${idx}`}
              className="rounded-2xl border border-dashed border-base-300 bg-base-100 h-40 flex flex-col items-center justify-center text-center text-base-content/60"
            >
              <p className="font-semibold text-base-content/70">API Not\u00edcias</p>
              <p className="text-xs text-base-content/60">Conte\u00fado chegar\u00e1 em breve.</p>
            </article>
          ))}
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-primary btn-wide">
            Ver mais
          </button>
        </div>
      </div>
    </section>
  );
}
