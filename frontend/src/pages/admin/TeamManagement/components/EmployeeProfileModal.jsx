import PropTypes from "prop-types";
import Modal from "../../../../components/ui/Modal/Modal.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";

const DEFAULT_PROFILE = {
  lastName: "Sampaio de Oliveira",
  birthDate: "02/01/2000",
  nationality: "Indiano",
  phone: "+351 982 761 054",
  nif: "99999999",
  skills: ["competencia01", "competencia02", "competencia03", "competencia04", "competencia05"],
  documents: [
    { label: "Currículo", filename: "fileCV.pdf" },
    { label: "Identificação", filename: "fileIdentificacao.pdf" },
  ],
  experiences: [
    {
      company: "Clebin Ltda",
      role: "Tubista",
      admin: "N/A",
      startDate: "dd/mm/aaaa",
      endDate: "dd/mm/aaaa",
    },
    {
      company: "Clebin Ltda",
      role: "Tubista",
      admin: "N/A",
      startDate: "dd/mm/aaaa",
      endDate: "dd/mm/aaaa",
    },
  ],
};

export default function EmployeeProfileModal({ open, onClose, employee }) {
  const profile = {
    ...DEFAULT_PROFILE,
    name: employee?.name ?? "N/A",
    role: employee?.role ?? "Tubista",
    city: employee?.city ?? "Portugal",
    preference: employee?.preference ?? "Portugal",
    skills: employee?.skills ?? DEFAULT_PROFILE.skills,
    documents: employee?.documents ?? DEFAULT_PROFILE.documents,
    experiences: employee?.experiences ?? DEFAULT_PROFILE.experiences,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-[#F0F0F0] mx-auto"
      actions={
        <>
          <Button label="Fechar" variant="ghost" fullWidth={false} onClick={onClose} />
          <Button label="Escolher" variant="primary" fullWidth={false} />
        </>
      }
    >
      <div className="space-y-6 px-2 lg:px-0">
        <div className="flex items-center justify-center px-4">
          <h2 className="text-center text-3xl font-bold text-[#1F2959] lg:text-4xl">
            Perfil de Funcionário
          </h2>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full bg-[#1F2959] text-white shadow-inner">
            <i className="bi bi-person-fill text-6xl" aria-hidden="true" />
          </div>
          <div className="w-full">
            <SectionCard title="Informações Pessoais">
              <div className="grid gap-3 md:grid-cols-2">
                <InfoRow label="Nome" value={profile.name} />
                <InfoRow label="Apelido" value={profile.lastName} />
                <InfoRow label="Data de Nascimento" value={profile.birthDate} />
                <InfoRow label="Nº de Telemóvel" value={profile.phone} />
                <InfoRow label="Nacionalidade" value={profile.nationality} />
                <InfoRow label="NIF" value={profile.nif} />
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard title="Preferencias de Trabalho">
          <div className="flex flex-col gap-3 md:flex-row md:gap-10">
            <div className="space-y-2">
              <InfoRow label="Função" value={profile.role} />
              <InfoRow label="Área geográfica" value={profile.preference} />
            </div>
            <div className="space-y-2">
              <InfoRow
                label="Competências"
                value={profile.skills.join(", ")}
                accent
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Documentação">
          <div className="space-y-3">
            {profile.documents.map((doc) => (
              <DocumentRow key={doc.label} label={doc.label} filename={doc.filename} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Trabalhos Anteriores">
          <div className="space-y-3">
            {profile.experiences.map((exp, index) => (
              <WorkHistoryCard key={`${exp.company}-${index}`} experience={exp} />
            ))}
          </div>
        </SectionCard>
      </div>
    </Modal>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-[#111827] bg-white shadow-md">
      <header className="border-b border-[#E5E7EB] px-4 py-3">
        <h3 className="text-xl font-semibold text-[#1F2959] lg:text-2xl">{title}</h3>
      </header>
      <div className="p-4 lg:p-6">{children}</div>
    </section>
  );
}

function InfoRow({ label, value, accent = false }) {
  return (
    <p className="text-base leading-relaxed text-[#111827]">
      <span className="font-semibold text-[#1F2959]">{label}: </span>
      <span className={accent ? "text-[#1F2959]" : "text-[#111827]"}>{value}</span>
    </p>
  );
}

function DocumentRow({ label, filename }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-[#111827] bg-[#F5F5F5] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <p className="text-lg text-[#111827]">
        <span className="font-semibold text-[#1F2959]">{label}:</span> {filename}
      </p>
      <Button
        label="Exibir"
        fullWidth={false}
        className="bg-[#60678E] text-white border-none hover:bg-[#4f5576]"
      />
    </div>
  );
}

function WorkHistoryCard({ experience }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#111827] bg-[#F5F5F5] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex-1 space-y-1 text-sm text-[#111827]">
        <p>
          <span className="font-semibold text-[#1F2959]">Nome Empresa:</span> {experience.company}
        </p>
        <p>
          <span className="font-semibold text-[#1F2959]">Função:</span> {experience.role}
        </p>
        <p>
          <span className="font-semibold text-[#1F2959]">Administrador:</span> {experience.admin}
        </p>
        <div className="flex flex-wrap gap-6">
          <p>
            <span className="font-semibold text-[#1F2959]">Data de início:</span> {experience.startDate}
          </p>
          <p>
            <span className="font-semibold text-[#1F2959]">Data de finalização:</span> {experience.endDate}
          </p>
        </div>
      </div>
      <Button
        label="Ver mais"
        fullWidth={false}
        className="bg-[#60678E] text-white border-none hover:bg-[#4f5576] md:w-32"
      />
    </div>
  );
}

EmployeeProfileModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employee: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    city: PropTypes.string,
    preference: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        filename: PropTypes.string,
      })
    ),
    experiences: PropTypes.arrayOf(
      PropTypes.shape({
        company: PropTypes.string,
        role: PropTypes.string,
        admin: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
      })
    ),
  }),
};

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  accent: PropTypes.bool,
};

DocumentRow.propTypes = {
  label: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
};

WorkHistoryCard.propTypes = {
  experience: PropTypes.shape({
    company: PropTypes.string,
    role: PropTypes.string,
    admin: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
};
