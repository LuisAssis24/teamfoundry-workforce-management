import { useEffect, useRef, useState } from "react";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import InputField from "../../../../components/ui/Input/InputField.jsx";
import Modal from "../../../../components/ui/Modal/Modal.jsx";
import {
  createCandidateEducation,
  listCandidateEducation,
} from "../../../../api/candidateEducation.js";
import { fetchCandidateProfile } from "../../../../api/candidateProfile.js";

const initialForm = {
  name: "",
  institution: "",
  location: "",
  completionDate: "",
  description: "",
  file: null,
};

export default function Education() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [displayName, setDisplayName] = useState("Nome Sobrenome");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function loadEducation() {
      try {
        const data = await listCandidateEducation();
        if (!isMounted) return;
        setEducations(Array.isArray(data) ? data : []);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Nuo foi poss??vel carregar as forma????es.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadProfileName() {
      try {
        const profile = await fetchCandidateProfile();
        if (!isMounted) return;
        setDisplayName(formatName(profile?.firstName, profile?.lastName));
      } catch {
      }
    }

    loadEducation();
    loadProfileName();
    return () => {
      isMounted = false;
    };
  }, []);  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      setForm((prev) => ({ ...prev, file }));
    }
  };

  const prevent = (event) => event.preventDefault();

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "O nome da formação é obrigatório.";
    if (!form.institution.trim()) newErrors.institution = "A instituição é obrigatória.";
    if (!form.completionDate) newErrors.completionDate = "Indique a data de conclusão.";
    if (!form.file) newErrors.file = "É necessário anexar o certificado.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    setErrorMessage("");

    try {
      const payload = await buildPayload(form);
      const created = await createCandidateEducation(payload);
      setEducations((prev) => [created, ...prev]);
      setSuccessMessage("Formação adicionada com sucesso.");
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível guardar a formação.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setForm(initialForm);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openModal = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setForm(initialForm);
    setErrors({});
    setOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section>
      <ProfileHeader name={displayName} />
      <ProfileTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6 space-y-4">
          {errorMessage && (
            <div className="alert alert-error text-sm" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success text-sm" role="status">
              {successMessage}
            </div>
          )}

          {loading ? (
            <SkeletonList />
          ) : educations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {educations.map((education) => (
                <EducationCard key={education.id} education={education} />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <div className="w-56">
              <Button label="Adicionar Formação" onClick={openModal} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title="Nova Formação"
        actions={
          <>
            <button type="button" className="btn btn-neutral" onClick={closeModal} disabled={saving}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "A guardar..." : "Adicionar"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Nome da Formação"
            name="name"
            placeholder="Ex.: Ensino Secundário"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Instituição"
            name="institution"
            placeholder="Ex.: Escola A"
            value={form.institution}
            onChange={handleChange}
            error={errors.institution}
          />
          <InputField
            label="Local (opcional)"
            name="location"
            placeholder="Cidade ou país"
            value={form.location}
            onChange={handleChange}
          />
          <InputField
            label="Data de Conclusão"
            name="completionDate"
            type="date"
            value={form.completionDate}
            onChange={handleChange}
            error={errors.completionDate}
          />
          <InputField
            label="Descrição (opcional)"
            name="description"
            as="textarea"
            rows={3}
            placeholder="Notas adicionais sobre a formação"
            value={form.description}
            onChange={handleChange}
          />

          <div>
            <label className="label">
              <span className="label-text font-medium">Certificado</span>
            </label>
            <div
              className={`border border-dashed rounded-xl p-6 text-center cursor-pointer bg-base-50 ${
                errors.file ? "border-error" : "border-base-300"
              }`}
              onDragOver={prevent}
              onDragEnter={prevent}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-base-content/80">
                <i className="bi bi-plus-square text-2xl" />
                <span>Arraste o certificado aqui ou procure no dispositivo.</span>
                {form.file && <span className="text-sm mt-1">Selecionado: {form.file.name}</span>}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            {errors.file && <p className="mt-2 text-sm text-error">{errors.file}</p>}
          </div>
        </div>
      </Modal>
    </section>
  );
}

function EducationCard({ education }) {
  const { name, institution, location, completionDate, description } = education;
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-base-200 flex items-center justify-center">
            <i className="bi bi-mortarboard" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-sm text-base-content/70">
              Instituição: {institution}
              {location ? ` · ${location}` : ""}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary text-primary-content text-xs">
          Certificado
        </span>
      </div>
      <div className="border-t border-base-300 px-4 py-3 flex flex-col gap-1 text-sm">
        <span className="text-base-content/80">Concluído em: {formatDate(completionDate)}</span>
        {description && <span className="text-base-content/80">{description}</span>}
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
      Ainda não adicionou formações. Clique em “Adicionar Formação” para registar a primeira.
    </div>
  );
}

function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim();
  const trimmedLast = lastName?.trim();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}
async function buildPayload(form) {
  const certificateFile = form.file ? await fileToBase64(form.file) : null;
  return {
    name: form.name.trim(),
    institution: form.institution.trim(),
    location: form.location?.trim() || null,
    completionDate: form.completionDate,
    description: form.description?.trim() || null,
    certificateFile,
    certificateFileName: form.file?.name ?? null,
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDate(date) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("pt-PT");
  } catch {
    return date;
  }
}


