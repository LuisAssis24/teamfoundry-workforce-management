import { useEffect, useMemo, useState } from "react";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import InputField from "../../../../components/ui/Input/InputField.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { fetchProfileOptions } from "../../../../api/profileOptions.js";
import {
  fetchCandidatePreferences,
  updateCandidatePreferences,
  setCandidatePreferencesEmail,
} from "../../../../api/candidatePreferences.js";
import { fetchCandidateProfile } from "../../../../api/candidateProfile.js";

const initialForm = {
  role: "",
  areas: [],
  skills: [],
};

export default function Preferences() {
  const [form, setForm] = useState(initialForm);
  const [options, setOptions] = useState({ functions: [], geoAreas: [], competences: [] });
  const [displayName, setDisplayName] = useState("Nome Sobrenome");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        try {
          const profile = await fetchCandidateProfile();
          if (!isMounted) return;
          setDisplayName(formatName(profile?.firstName, profile?.lastName));
          setCandidatePreferencesEmail(profile?.email);
        } catch {
          if (!isMounted) return;
          setCandidatePreferencesEmail(null);
        }

        const [optionsData, preferencesData] = await Promise.all([
          fetchProfileOptions(),
          fetchCandidatePreferences(),
        ]);

        if (!isMounted) return;

        setOptions({
          functions: Array.isArray(optionsData?.functions) ? optionsData.functions : [],
          geoAreas: Array.isArray(optionsData?.geoAreas) ? optionsData.geoAreas : [],
          competences: Array.isArray(optionsData?.competences) ? optionsData.competences : [],
        });

        setForm({
          role: preferencesData?.role ?? "",
          areas: Array.isArray(preferencesData?.areas) ? preferencesData.areas : [],
          skills: Array.isArray(preferencesData?.skills) ? preferencesData.skills : [],
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || "N�o foi poss�vel carregar as prefer�ncias.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const functionOptions = useMemo(() => {
    const list = Array.isArray(options.functions) ? [...options.functions] : [];
    if (form.role && !list.includes(form.role)) {
      return [form.role, ...list];
    }
    return list;
  }, [options.functions, form.role]);

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, role: value }));
    clearFieldError("role");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await updateCandidatePreferences({
        role: form.role,
        areas: form.areas,
        skills: form.skills,
      });
      setFeedback("Preferências atualizadas com sucesso.");
    } catch (err) {
      setError(err.message || "Não foi possível guardar as preferências.");
    } finally {
      setSaving(false);
    }
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
    if (feedback) setFeedback("");
  };

  const addSelection = (field, value) => {
    if (!value) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value] }));
    clearFieldError(field);
  };

  const removeSelection = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  return (
    <section>
      <ProfileHeader name={displayName} />
      <ProfileTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Função preferencial"
                as="select"
                placeholder="Selecione a função"
                value={form.role}
                onChange={handleRoleChange}
                disabled={loading || saving || functionOptions.length === 0}
                error={fieldErrors.role}
              >
                {functionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </InputField>

              <MultiValueSelector
                label="Área(s) Geográfica(s)"
                placeholder="Adicionar área geográfica"
                selected={form.areas}
                options={options.geoAreas}
                onAdd={(value) => addSelection("areas", value)}
                onRemove={(value) => removeSelection("areas", value)}
                disabled={loading || saving}
                error={fieldErrors.areas}
              />

              <div className="md:col-span-2">
                <MultiValueSelector
                  label="Competências"
                  placeholder="Adicionar competência"
                  selected={form.skills}
                  options={options.competences}
                  onAdd={(value) => addSelection("skills", value)}
                  onRemove={(value) => removeSelection("skills", value)}
                  disabled={loading || saving}
                  error={fieldErrors.skills}
                />
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col items-center gap-3 max-w-3xl mx-auto">
            {error && (
              <div className="alert alert-error w-full text-sm" role="alert">
                {error}
              </div>
            )}
            {feedback && (
              <div className="alert alert-success w-full text-sm" role="status">
                {feedback}
              </div>
            )}
            <div className="w-56">
              <Button
                label={saving ? "A guardar..." : loading ? "A carregar..." : "Guardar"}
                type="submit"
                disabled={saving || loading}
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function MultiValueSelector({
  label,
  placeholder,
  selected,
  options = [],
  onAdd,
  onRemove,
  disabled,
  error,
}) {
  const availableOptions = Array.isArray(options)
    ? options.filter((option) => !selected.includes(option))
    : [];
  const hasSelections = selected.length > 0;
  const selectDisabled = disabled || availableOptions.length === 0;

  return (
    <div>
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="input input-bordered w-full min-h-12 flex items-center gap-2 flex-wrap py-2 px-3">
        {hasSelections ? (
          selected.map((item) => (
            <span key={item} className="px-2 py-1 rounded-md bg-base-200 text-sm flex items-center gap-1">
              {item}
              <button
                type="button"
                className="text-base-content/70 hover:text-error transition-colors"
                onClick={() => onRemove(item)}
                disabled={disabled}
                aria-label={`Remover ${item}`}
              >
                <i className="bi bi-x" aria-hidden="true" />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-base-content/70">Nenhuma opção selecionada.</span>
        )}
      </div>

      <select
        className="select select-bordered w-full mt-3"
        value=""
        onChange={(event) => {
          const value = event.target.value;
          if (value) {
            onAdd(value);
            event.target.value = "";
          }
        }}
        disabled={selectDisabled}
      >
        <option value="">
          {selectDisabled ? "Todas as opções adicionadas" : placeholder}
        </option>
        {availableOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}

function validateForm(form) {
  const errors = {};
  if (!form.role) {
    errors.role = "Selecione uma função.";
  }
  if (!Array.isArray(form.areas) || form.areas.length === 0) {
    errors.areas = "Selecione pelo menos uma área geográfica.";
  }
  if (!Array.isArray(form.skills) || form.skills.length === 0) {
    errors.skills = "Selecione pelo menos uma competência.";
  }
  return errors;
}

function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim();
  const trimmedLast = lastName?.trim();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}


