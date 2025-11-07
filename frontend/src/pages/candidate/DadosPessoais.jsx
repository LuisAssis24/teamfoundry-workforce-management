import InputField from "../../components/ui/Input/InputField.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import CandidateTabs from "../../components/candidate/CandidateTabs.jsx";
import ProfileHeader from "../../components/candidate/ProfileHeader.jsx";

export default function DadosPessoais() {
  return (
    <section>
      <ProfileHeader />

      <CandidateTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nome" placeholder="Introduza o nome" />
          <InputField label="Apelido" placeholder="Introduza o apelido" />
          <InputField label="Data de Nascimento" type="date" />
          <InputField label="Género" placeholder="Masculino/Feminino/Outro" />
          <InputField label="Nacionalidade" placeholder="Ex.: Portuguesa" />
          <InputField label="NIF" placeholder="123456789" />
          <div className="md:col-span-2">
            <InputField label="Contacto" placeholder="Email ou telefone" />
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-center">
          <div className="w-56">
            <Button label="Guardar" />
          </div>
        </div>
      </div>
    </section>
  );
}
