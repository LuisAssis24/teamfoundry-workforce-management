import { useEffect, useMemo, useState } from "react";
import InputField from "../../components/ui/Input/InputField.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import CandidateTabs from "../../components/candidate/CandidateTabs.jsx";
import ProfileHeader from "../../components/candidate/ProfileHeader.jsx";
import { fetchCandidateProfile, updateCandidateProfile } from "../../api/candidateProfile.js";

const genderOptions = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
  { value: "OTHER", label: "Outro" },
];

export default function PersonalDetails() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    nationality: "",
    nif: "",
    phone: "",
  });
  const [displayName, setDisplayName] = useState("Nome Sobrenome");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const genderPlaceholder = useMemo(() => "Selecione o género", []);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const data = await fetchCandidateProfile();
        if (!isMounted) return;
        setFormData({
          firstName: data?.firstName ?? "",
          lastName: data?.lastName ?? "",
          birthDate: data?.birthDate ?? "",
          gender: data?.gender ?? "",
          nationality: data?.nationality ?? "",
          nif: data?.nif?.toString() ?? "",
          phone: data?.phone ?? "",
        });
        setDisplayName(formatName(data?.firstName, data?.lastName));
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Não foi possível carregar o perfil.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (feedback) setFeedback("");
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback("");
    setError("");
    try {
      const payload = {
        ...formData,
        nif: formData.nif ? Number(formData.nif) : null,
      };
      const response = await updateCandidateProfile(payload);
      setFeedback("Dados atualizados com sucesso!");
      setDisplayName(formatName(response?.firstName, response?.lastName));
    } catch (err) {
      setError(err.message || "Não foi possível guardar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <ProfileHeader name={displayName} />

      <CandidateTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow">
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nome"
              placeholder="Introduza o nome"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              disabled={loading || saving}
            />
            <InputField
              label="Apelido"
              placeholder="Introduza o apelido"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              disabled={loading || saving}
            />
            <InputField
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate}
              onChange={handleChange("birthDate")}
              disabled={loading || saving}
            />
            <InputField
              label="Género"
              as="select"
              placeholder={genderPlaceholder}
              value={formData.gender}
              onChange={handleChange("gender")}
              disabled={loading || saving}
            >
              <option value="" disabled>
                {genderPlaceholder}
              </option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </InputField>
            <InputField
              label="Nacionalidade"
              placeholder="Ex.: Portuguesa"
              value={formData.nationality}
              onChange={handleChange("nationality")}
              disabled={loading || saving}
            />
            <InputField
              label="NIF"
              placeholder="123456789"
              value={formData.nif}
              onChange={handleChange("nif")}
              disabled={loading || saving}
            />
            <div className="md:col-span-2">
              <InputField
                label="Contacto"
                placeholder="Email ou telefone"
                value={formData.phone}
                onChange={handleChange("phone")}
                disabled={loading || saving}
              />
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col items-center gap-3">
            {error && (
              <div className="alert alert-error w-full max-w-md text-sm" role="alert">
                {error}
              </div>
            )}
            {feedback && (
              <div className="alert alert-success w-full max-w-md text-sm" role="status">
                {feedback}
              </div>
            )}
            <div className="w-56">
              <Button label={saving ? "A guardar..." : "Guardar"} type="submit" disabled={saving || loading} />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function formatName(firstName, lastName) {
  const trimmedFirst = firstName?.trim();
  const trimmedLast = lastName?.trim();
  const full = [trimmedFirst, trimmedLast].filter(Boolean).join(" ").trim();
  return full || "Nome Sobrenome";
}
