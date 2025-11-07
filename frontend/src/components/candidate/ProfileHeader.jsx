export default function ProfileHeader({ name = "Nome Sobrenome" }) {
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="w-28 h-28 rounded-full border-4 border-primary text-primary flex items-center justify-center text-5xl">
        <i className="bi bi-person" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-2xl md:text-3xl font-semibold">{name}</h1>
    </div>
  );
}

