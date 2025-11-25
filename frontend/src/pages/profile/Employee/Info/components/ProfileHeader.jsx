import { useEmployeeProfile } from "../../EmployeeProfileContext.jsx";

// Concatena nome/apelido respeitando valores em falta.
const formatName = (first, last) => {
  if (!first && !last) return "";
  return `${first ?? ""} ${last ?? ""}`.trim();
};

export default function ProfileHeader({ name }) {
  const { profile, loadingProfile } = useEmployeeProfile();
  const displayName = name || formatName(profile?.firstName, profile?.lastName);
  const showPlaceholder = loadingProfile && !displayName;

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="w-28 h-28 rounded-full border-4 border-primary text-primary flex items-center justify-center text-5xl">
        <i className="bi bi-person" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-2xl md:text-3xl font-semibold min-h-[1.5rem]">
        {showPlaceholder ? (
          <span className="inline-block w-40 h-4 rounded-full bg-base-300 animate-pulse" aria-hidden="true" />
        ) : (
          displayName || " "
        )}
      </h1>
    </div>
  );
}

