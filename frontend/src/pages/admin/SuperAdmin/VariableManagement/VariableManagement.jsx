import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createIndustry,
  createPartner,
  fetchHomepageConfig,
  reorderIndustries,
  reorderPartners,
  reorderSections,
  updateIndustry,
  updatePartner,
  updateSection,
  uploadSiteImage,
  deleteIndustry,
  deletePartner,
} from "../../../../api/siteManagement.js";
import Modal from "../../../../components/ui/Modal/Modal.jsx";
import DropZone from "../../../../components/ui/Upload/DropZone.jsx";
import { clearTokens } from "../../../../auth/tokenStorage.js";
import AppHomeManager from "../AppHomeManager.jsx";

const SECTION_LABELS = {
  HERO: "Hero (topo)",
  INDUSTRIES: "IndÃºstrias",
  PARTNERS: "Parceiros",
};

const VIEW_TABS = [
  {
    id: "publicHome",
    label: "Home pÃºblica",
    description: "Configura a landing page visÃ­vel antes do login.",
  },
  {
    id: "appHome",
    label: "Home autenticada",
    description: "ConteÃºdo mostrado quando o utilizador jÃ¡ fez login.",
  },
  {
    id: "otherPages",
    label: "Outras pÃ¡ginas",
    description: "Futuras secÃ§Ãµes do site que serÃ£o controladas aqui.",
  },
];

const EMPTY_FORMS = {
  industry: {
    name: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    active: true,
  },
  partner: {
    name: "",
    description: "",
    imageUrl: "",
    websiteUrl: "",
    active: true,
  },
};

export default function VariableManagement() {
  const navigate = useNavigate();
  const mountedRef = useRef(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeView, setActiveView] = useState("publicHome");

  const [banner, setBanner] = useState(null);

  const [heroForm, setHeroForm] = useState(null);
  const [savingHero, setSavingHero] = useState(false);

  const [modalState, setModalState] = useState({
    open: false,
    entity: null,
    mode: "create",
    record: null,
  });
  const [modalForm, setModalForm] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  const handleUnauthorized = useCallback(() => {
    clearTokens();
    navigate("/admin", { replace: true });
  }, [navigate]);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const payload = await fetchHomepageConfig();
      if (!mountedRef.current) return;
      setConfig(normalizeConfig(payload));
    } catch (err) {
      if (!mountedRef.current) return;
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      setLoadError(err.message || "NÃ£o foi possÃ­vel carregar as configuraÃ§Ãµes.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    mountedRef.current = true;
    loadConfig();
    return () => {
      mountedRef.current = false;
    };
  }, [loadConfig]);

  const heroSection = useMemo(
    () => config?.sections?.find((section) => section.type === "HERO"),
    [config]
  );

  useEffect(() => {
    if (!heroSection) return;
    setHeroForm({
      title: heroSection.title ?? "",
      subtitle: heroSection.subtitle ?? "",
      primaryCtaLabel: heroSection.primaryCtaLabel ?? "",
      primaryCtaUrl: heroSection.primaryCtaUrl ?? "",
      secondaryCtaLabel: heroSection.secondaryCtaLabel ?? "",
      secondaryCtaUrl: heroSection.secondaryCtaUrl ?? "",
      active: Boolean(heroSection.active),
    });
  }, [heroSection]);

  const handleHeroFieldChange = (field, value) => {
    setHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroSubmit = async (event) => {
    event.preventDefault();
    if (!heroSection || !heroForm) return;
    setSavingHero(true);
    setBanner(null);
    try {
      const updated = await updateSection(heroSection.id, heroForm);
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === updated.id ? updated : section
        ),
      }));
      setBanner({ type: "success", message: "Hero atualizado com sucesso." });
    } catch (err) {
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel guardar o hero.",
      });
    } finally {
      setSavingHero(false);
    }
  };

  const handleSectionMove = async (id, direction) => {
    if (!config) return;
    const next = moveItemInList(config.sections, id, direction);
    if (!next) return;

    const previous = config.sections;
    setConfig((prev) => ({ ...prev, sections: next }));
    setBanner(null);

    try {
      await reorderSections(next.map((section) => section.id));
      setBanner({ type: "success", message: "Ordem das secÃ§Ãµes atualizada." });
    } catch (err) {
      setConfig((prev) => ({ ...prev, sections: previous }));
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel reordenar as secÃ§Ãµes.",
      });
    }
  };

  const handleSectionToggle = async (section) => {
    setBanner(null);
    try {
      const updated = await updateSection(section.id, {
        title: section.title,
        subtitle: section.subtitle,
        primaryCtaLabel: section.primaryCtaLabel,
        primaryCtaUrl: section.primaryCtaUrl,
        secondaryCtaLabel: section.secondaryCtaLabel,
        secondaryCtaUrl: section.secondaryCtaUrl,
        active: !section.active,
      });
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((item) => (item.id === updated.id ? updated : item)),
      }));
      setBanner({
        type: "success",
        message: `SecÃ§Ã£o ${updated.active ? "ativada" : "ocultada"} com sucesso.`,
      });
    } catch (err) {
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel atualizar a secÃ§Ã£o.",
      });
    }
  };

  const handleIndustryMove = async (id, direction) =>
    handleReorderList("industries", reorderIndustries, id, direction);
  const handlePartnerMove = async (id, direction) =>
    handleReorderList("partners", reorderPartners, id, direction);

  const handleReorderList = async (key, apiFn, id, direction) => {
    const list = config?.[key];
    if (!Array.isArray(list)) return;

    const next = moveItemInList(list, id, direction);
    if (!next) return;

    const previous = list;
    setConfig((prev) => ({ ...prev, [key]: next }));
    setBanner(null);
    try {
      await apiFn(next.map((item) => item.id));
      setBanner({ type: "success", message: "OrdenaÃ§Ã£o atualizada." });
    } catch (err) {
      setConfig((prev) => ({ ...prev, [key]: previous }));
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel reordenar a lista.",
      });
    }
  };

  const handleDeleteIndustry = async (record, { confirmDeletion = true } = {}) => {
    if (!record) return false;
    if (confirmDeletion && !window.confirm(`Eliminar a indÃºstria "${record.name}"?`)) {
      return false;
    }
    setBanner(null);
    try {
      await deleteIndustry(record.id);
      setConfig((prev) => ({
        ...prev,
        industries: prev.industries.filter((item) => item.id !== record.id),
      }));
      setBanner({ type: "success", message: "IndÃºstria removida com sucesso." });
      return true;
    } catch (err) {
      if (err?.status === 401) {
        handleUnauthorized();
        return false;
      }
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel eliminar a indÃºstria.",
      });
      return false;
    }
  };

  const handleDeletePartner = async (record, { confirmDeletion = true } = {}) => {
    if (!record) return false;
    if (confirmDeletion && !window.confirm(`Eliminar o parceiro "${record.name}"?`)) {
      return false;
    }
    setBanner(null);
    try {
      await deletePartner(record.id);
      setConfig((prev) => ({
        ...prev,
        partners: prev.partners.filter((item) => item.id !== record.id),
      }));
      setBanner({ type: "success", message: "Parceiro removido com sucesso." });
      return true;
    } catch (err) {
      if (err?.status === 401) {
        handleUnauthorized();
        return false;
      }
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel eliminar o parceiro.",
      });
      return false;
    }
  };

  const openModal = (entity, record = null) => {
    const mode = record ? "edit" : "create";
    setModalState({ open: true, entity, mode, record });
    setModalForm(getModalForm(entity, record));
  };

  const closeModal = () => {
    setModalState({ open: false, entity: null, mode: "create", record: null });
    setModalForm(null);
    setModalSaving(false);
  };

  const handleModalFieldChange = (field, value) => {
    setModalForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault();
    if (!modalState.open || !modalState.entity || !modalForm) return;

    setModalSaving(true);
    setBanner(null);

    const { entity, mode, record } = modalState;
    try {
      if (entity === "industry") {
        const payload = {
          name: modalForm.name?.trim() ?? "",
          description: modalForm.description ?? record?.description ?? "",
          imageUrl: modalForm.imageUrl,
          linkUrl: modalForm.linkUrl ?? record?.linkUrl ?? "",
          active: Boolean(modalForm.active),
        };
        const result =
          mode === "create"
            ? await createIndustry(payload)
            : await updateIndustry(record.id, payload);
        setConfig((prev) => ({
          ...prev,
          industries: sortByOrder(
            mode === "create"
              ? [...prev.industries, result]
              : prev.industries.map((item) => (item.id === result.id ? result : item))
          ),
        }));
      } else {
        const payload = {
          name: modalForm.name?.trim() ?? "",
          description: modalForm.description ?? "",
          imageUrl: modalForm.imageUrl,
          websiteUrl: modalForm.websiteUrl ?? "",
          active: Boolean(modalForm.active),
        };
        const result =
          mode === "create"
            ? await createPartner(payload)
            : await updatePartner(record.id, payload);
        setConfig((prev) => ({
          ...prev,
          partners: sortByOrder(
            mode === "create"
              ? [...prev.partners, result]
              : prev.partners.map((item) => (item.id === result.id ? result : item))
          ),
        }));
      }
      closeModal();
      setBanner({ type: "success", message: "ConteÃºdo guardado com sucesso." });
    } catch (err) {
      setBanner({
        type: "error",
        message: err.message || "NÃ£o foi possÃ­vel guardar os dados.",
      });
      setModalSaving(false);
    }
  };

  const handleModalDelete = async () => {
    if (modalState.mode !== "edit" || !modalState.record) return;
    const fn = modalState.entity === "industry" ? handleDeleteIndustry : handleDeletePartner;
    const success = await fn(modalState.record);
    if (success) {
      closeModal();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      );
    }

    if (loadError && !config) {
      return (
        <div className="flex flex-col items-center gap-4 py-20">
          <p className="text-lg text-base-content/70">{loadError}</p>
          <button type="button" className="btn btn-primary" onClick={loadConfig}>
            Tentar novamente
          </button>
        </div>
      );
    }

        if (!config) return null;

    if (activeView === "appHome") {
      return <AppHomeManager onUnauthorized={handleUnauthorized} />;
    }



    return (
      <div className="space-y-10">
        {banner && (
          <div
            className={`alert ${
              banner.type === "error" ? "alert-error" : "alert-success"
            } shadow flex justify-between`}
          >
            <span>{banner.message}</span>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setBanner(null)}
            >
              Fechar
            </button>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary/70">
                ConteÃºdo
              </p>
              <h2 className="card-title text-3xl">Hero e chamadas</h2>
              <p className="text-base-content/70">
                Atualize o texto principal, subtÃ­tulo e CTAs apresentados no topo do
                site pÃºblico.
              </p>
            </div>
            {heroForm && (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleHeroSubmit}>
                <label className="form-control md:col-span-2">
                  <span className="label-text font-semibold">TÃ­tulo</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    required
                    value={heroForm.title}
                    onChange={(e) => handleHeroFieldChange("title", e.target.value)}
                  />
                </label>

                <label className="form-control md:col-span-2">
                  <span className="label-text font-semibold">SubtÃ­tulo</span>
                  <textarea
                    className="textarea textarea-bordered min-h-[120px]"
                    value={heroForm.subtitle}
                    onChange={(e) => handleHeroFieldChange("subtitle", e.target.value)}
                  />
                </label>

                <FieldGroup
                  label="Texto do CTA principal"
                  value={heroForm.primaryCtaLabel}
                  onChange={(value) => handleHeroFieldChange("primaryCtaLabel", value)}
                  placeholder="Ex.: Quero trabalhar"
                />
                <FieldGroup
                  label="URL do CTA principal"
                  value={heroForm.primaryCtaUrl}
                  onChange={(value) => handleHeroFieldChange("primaryCtaUrl", value)}
                  placeholder="/login"
                />
                <FieldGroup
                  label="Texto do CTA secundÃ¡rio"
                  value={heroForm.secondaryCtaLabel}
                  onChange={(value) =>
                    handleHeroFieldChange("secondaryCtaLabel", value)
                  }
                  placeholder="Sou empresa"
                />
                <FieldGroup
                  label="URL do CTA secundÃ¡rio"
                  value={heroForm.secondaryCtaUrl}
                  onChange={(value) => handleHeroFieldChange("secondaryCtaUrl", value)}
                  placeholder="/company-register"
                />

                <label className="label cursor-pointer md:col-span-2 justify-start gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={heroForm.active}
                    onChange={(e) => handleHeroFieldChange("active", e.target.checked)}
                  />
                  <span className="label-text">Mostrar esta secÃ§Ã£o no site pÃºblico</span>
                </label>

                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingHero}
                  >
                    {savingHero ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        A guardarâ€¦
                      </>
                    ) : (
                      "Guardar alteraÃ§Ãµes"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <SectionOrderCard
          sections={config.sections}
          onMove={handleSectionMove}
          onToggle={handleSectionToggle}
        />

        <ShowcaseList
          title="IndÃºstrias em destaque"
          description="Controle quais setores aparecem e a ordem apresentada na home page."
          type="industry"
          items={config.industries}
          onCreate={() => openModal("industry")}
          onEdit={(record) => openModal("industry", record)}
          onMove={handleIndustryMove}
        />

        <ShowcaseList
          title="Parceiros principais"
          description="Atualize os parceiros apresentados e o destaque dado a cada um."
          type="partner"
          items={config.partners}
          onCreate={() => openModal("partner")}
          onEdit={(record) => openModal("partner", record)}
          onMove={handlePartnerMove}
        />
      </div>
    );
  };

  return (
    <section className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-[0.35em] text-primary/80">
          GestÃ£o do site
        </p>
        <h1 className="text-4xl font-extrabold text-primary">ConfiguraÃ§Ãµes do site</h1>
        <p className="text-base-content/70 mt-2">
          Gerencie o conteÃºdo dinÃ¢mico da home page e mantenha o site sempre
          alinhado com a estratÃ©gia da TeamFoundry.
        </p>
      </header>

      <nav className="tabs tabs-boxed bg-base-100 shadow-sm w-fit">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab ${activeView === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {renderContent()}

      <ShowcaseModal
        state={modalState}
        form={modalForm}
        saving={modalSaving}
        onClose={closeModal}
        onChange={handleModalFieldChange}
        onSubmit={handleModalSubmit}
        onDelete={handleModalDelete}
      />
    </section>
  );
}

function FieldGroup({ label, value, onChange, placeholder }) {
  return (
    <label className="form-control">
      <span className="label-text font-semibold">{label}</span>
      <input
        type="text"
        className="input input-bordered"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SectionOrderCard({ sections = [], onMove, onToggle }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-2xl">Ordem das secÃ§Ãµes</h2>
          <p className="text-base-content/70">
            Defina a sequÃªncia com que cada bloco aparece para os visitantes.
          </p>
        </div>
        <ol className="space-y-3">
          {sections.map((section, index) => (
            <li
              key={section.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-base-300 bg-base-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary">{index + 1}.</span>
                <div>
                  <p className="font-semibold">{SECTION_LABELS[section.type] ?? section.type}</p>
                  <p className="text-sm text-base-content/70">{section.title}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {typeof onToggle === "function" && (
                  <label className="label cursor-pointer gap-3">
                    <span className="text-sm text-base-content/70">
                      {section.active ? "VisÃ­vel" : "Oculta"}
                    </span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={section.active}
                      onChange={() => onToggle(section)}
                    />
                  </label>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => onMove(section.id, "up")}
                  disabled={index === 0}
                >
                  <i className="bi bi-arrow-up" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => onMove(section.id, "down")}
                  disabled={index === sections.length - 1}
                >
                  <i className="bi bi-arrow-down" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ShowcaseList({
  title,
  description,
  items,
  onCreate,
  onEdit,
  onMove,
  type,
}) {
  const isIndustry = type === "industry";
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="card-title text-2xl">{title}</h2>
            <p className="text-base-content/70">{description}</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onCreate}>
            Adicionar {isIndustry ? "indÃºstria" : "parceiro"}
          </button>
        </div>
        {safeItems.length ? (
          <div className="space-y-4">
            {safeItems.map((item, index) => (
              <article
                key={item.id}
                className="rounded-2xl border border-base-200 p-5 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                  <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-base-200 border border-base-300">
                    <ShowcasePreview src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span
                        className={`badge ${
                          item.active ? "badge-success" : "badge-ghost"
                        } uppercase`}
                      >
                        {item.active ? "VisÃ­vel" : "Oculto"}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-base-content/60">
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost"
                          onClick={() => onMove(item.id, "up")}
                          disabled={index === 0}
                          aria-label="Subir item"
                        >
                          <i className="bi bi-arrow-up" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost"
                          onClick={() => onMove(item.id, "down")}
                          disabled={index === safeItems.length - 1}
                          aria-label="Descer item"
                        >
                          <i className="bi bi-arrow-down" />
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-base-content/70 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
            <p className="text-base-content/60">
              Ainda nÃ£o existem {isIndustry ? "indÃºstrias" : "parceiros"} configurados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShowcaseModal({ state, form, saving, onClose, onChange, onSubmit, onDelete }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  if (!state.open || !form) return null;
  const isIndustry = state.entity === "industry";

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadError(null);
    setUploadingImage(true);
    try {
      const result = await uploadSiteImage(file);
      onChange("imageUrl", result.url);
    } catch (err) {
      setUploadError(err.message || "NÃ£o foi possÃ­vel carregar a imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Modal
      open
      title={
        state.mode === "create"
          ? `Adicionar ${isIndustry ? "indÃºstria" : "parceiro"}`
          : `Editar ${isIndustry ? "indÃºstria" : "parceiro"}`
      }
      onClose={onClose}
      actions={
        <>
          {state.mode === "edit" && (
            <button
              type="button"
              className="btn btn-error btn-outline mr-auto"
              onClick={onDelete}
              disabled={saving}
            >
              Eliminar
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="showcase-form"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                A guardarâ€¦
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </>
      }
    >
      <form id="showcase-form" className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control">
            <span className="label-text font-semibold">Nome</span>
            <input
              type="text"
              className="input input-bordered"
              required
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </label>
          <div className="rounded-2xl border border-base-300 bg-base-100/80 px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-base-content/80">Visibilidade</p>
              <p className="text-xs text-base-content/60">
                Controle se aparece na pÃ¡gina inicial
              </p>
            </div>
            <label className="label cursor-pointer gap-3">
              <span className="text-sm">{form.active ? "Online" : "Oculto"}</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={form.active}
                onChange={(e) => onChange("active", e.target.checked)}
              />
            </label>
          </div>
        </div>

        {!isIndustry && (
          <label className="form-control">
            <span className="label-text font-semibold">DescriÃ§Ã£o</span>
            <textarea
              className="textarea textarea-bordered min-h-[120px]"
              required
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </label>
        )}

        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100/80 p-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 space-y-3">
              <DropZone
                label="Imagem (arraste ou clique para carregar)"
                onSelect={handleImageUpload}
              />
              {uploadingImage && (
                <div className="text-sm text-primary flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  A enviar imagemâ€¦
                </div>
              )}
              {uploadError && <p className="text-sm text-error">{uploadError}</p>}
              <label className="form-control">
                <span className="label-text text-sm text-base-content/70">
                  Ou cole um URL de imagem
                </span>
                <input
                  type="text"
                  className="input input-bordered"
                  required
                  value={form.imageUrl}
                  onChange={(e) => onChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </label>
            </div>
            <div className="flex-1 rounded-2xl border border-base-300 bg-base-200 h-48 overflow-hidden">
              <ShowcasePreview src={form.imageUrl} alt={form.name} />
            </div>
          </div>
        </div>

        {isIndustry ? (
          <>
            <input type="hidden" value={form.description ?? ""} readOnly />
            <input type="hidden" value={form.linkUrl ?? ""} readOnly />
          </>
        ) : (
          <input type="hidden" value={form.websiteUrl ?? ""} readOnly />
        )}
      </form>
    </Modal>
  );
}

function moveItemInList(list, id, direction) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return null;
  const next = [...list];
  const [removed] = next.splice(index, 1);
  next.splice(target, 0, removed);
  return next;
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function normalizeConfig(payload) {
  return {
    sections: sortByOrder(payload?.sections ?? []),
    industries: sortByOrder(payload?.industries ?? []),
    partners: sortByOrder(payload?.partners ?? []),
  };
}

function getModalForm(entity, record) {
  if (!record) {
    return { ...EMPTY_FORMS[entity] };
  }
  if (entity === "industry") {
    return {
      name: record.name ?? "",
      description: record.description ?? "",
      imageUrl: record.imageUrl ?? "",
      linkUrl: record.linkUrl ?? "",
      active: Boolean(record.active),
    };
  }
  return {
    name: record.name ?? "",
    description: record.description ?? "",
    imageUrl: record.imageUrl ?? "",
    websiteUrl: record.websiteUrl ?? "",
    active: Boolean(record.active),
  };
}

function ShowcasePreview({ src, alt }) {
  if (!src) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-base-200 text-base-content/40 text-xs">
        Sem imagem
      </div>
    );
  }
  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />;
}

