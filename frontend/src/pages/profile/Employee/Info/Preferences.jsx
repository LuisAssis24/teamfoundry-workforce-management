import { useEffect, useMemo, useState } from "react";
import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import MultiSelectDropdown from "../../../../components/ui/MultiSelect/MultiSelectDropdown.jsx";
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
          if (isMounted) {
            setDisplayName(formatName(profile?.firstName, profile?.lastName));
            setCandidatePreferencesEmail(profile?.email ?? null);
          }
        } catch {
          if (isMounted) {
            setCandidatePreferencesEmail(null);
          }
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
          setError(err.message || "Nao foi possivel carregar as preferencias.");
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
      setFeedback("Preferencias atualizadas com sucesso.");
    } catch (err) {
      setError(err.message || "Nao foi possivel guardar as preferencias.");
    } finally {
      setSaving(false);
    }
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
    if (feedback) setFeedback("");
  };

  const handleRoleDropdownChange = (values) => {
    const normalized = Array.isArray(values) ? values.filter(Boolean) : [];
    const lastSelected = normalized[normalized.length - 1] || "";
    setForm((prev) => ({ ...prev, role: lastSelected }));
    clearFieldError("role");
  };

  const handleAreasChange = (values) => {
    const normalized = Array.isArray(values) ? Array.from(new Set(values.filter(Boolean))) : [];
    setForm((prev) => ({ ...prev, areas: normalized }));
    clearFieldError("areas");
  };

  const handleSkillsChange = (values) => {
    const normalized = Array.isArray(values) ? Array.from(new Set(values.filter(Boolean))) : [];
    setForm((prev) => ({ ...prev, skills: normalized }));
    clearFieldError("skills");
  };

  return (
    <section>
      <ProfileHeader name={displayName} />
      <ProfileTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <MultiSelectDropdown
                  label="Funcao preferencial"
                  options={functionOptions}
                  selectedOptions={form.role ? [form.role] : []}
                  onChange={handleRoleDropdownChange}
                  placeholder="Selecione a funcao"
                  disabled={loading || saving || functionOptions.length === 0}
                />
                {fieldErrors.role && (
                  <p className="mt-2 text-sm text-error">{fieldErrors.role}</p>
                )}
              </div>

              <div>
                <MultiSelectDropdown
                  label="Area(s) Geograficas"
                  options={options.geoAreas}
                  selectedOptions={form.areas}
                  onChange={handleAreasChange}
                  placeholder="Adicionar area geografica"
                  disabled={loading || saving}
                />
                {fieldErrors.areas && (
                  <p className="mt-2 text-sm text-error">{fieldErrors.areas}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <MultiSelectDropdown
                  label="Competencias"
                  options={options.competences}
                  selectedOptions={form.skills}
                  onChange={handleSkillsChange}
                  placeholder="Adicionar competencia"
                  disabled={loading || saving}
                />
                {fieldErrors.skills && (
                  <p className="mt-2 text-sm text-error">{fieldErrors.skills}</p>
                )}
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

function validateForm(form) {
  const errors = {};
  if (!form.role) {
    errors.role = "Selecione uma funcao.";
  }
  if (!Array.isArray(form.areas) || form.areas.length === 0) {
    errors.areas = "Selecione pelo menos uma area geografica.";
  }
  if (!Array.isArray(form.skills) || form.skills.length === 0) {
    errors.skills = "Selecione pelo menos uma competencia.";
  }
  return errors;
}

function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim();
  const trimmedLast = lastName?.trim();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}
