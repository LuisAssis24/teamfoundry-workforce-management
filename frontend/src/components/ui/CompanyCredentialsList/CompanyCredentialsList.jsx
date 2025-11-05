import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import CompanyCredentialsCard from "./CompanyCredentialsCard";

const DEFAULT_FIELDS = [
    { key: "companyName", label: "Nome Empresa:" },
    { key: "nif", label: "NIF:" },
    { key: "country", label: "Pais:" },
    { key: "responsibleName", label: "Nome Responsavel:" },
    { key: "responsibleEmail", label: "Email Responsavel:" },
];

export default function CompanyCredentialsList({
                                                   companies,
                                                   onViewMore,
                                                   onAccept,
                                                   onSearch,
                                                   title = "Credenciais",
                                                   fieldConfig,
                                                   viewLabel = "Ver Mais",
                                                   acceptLabel = "Aceitar",
                                                   viewVariant = "primary",
                                                   acceptVariant = "success",
                                                   viewButtonClassName = "",
                                                   acceptButtonClassName = "",
                                                   headerActions,
                                                   searchPlaceholder = "Pesquisar",
                                               }) {
    const [query, setQuery] = useState("");
    const effectiveFields = fieldConfig?.length ? fieldConfig : DEFAULT_FIELDS;

    const filteredCompanies = useMemo(() => {
        if (!query.trim()) return companies;
        const lower = query.toLowerCase();
        return companies.filter((company) =>
            effectiveFields
                .map(({ key, getValue }) => {
                    const value =
                        typeof getValue === "function" ? getValue(company) : company[key];
                    return value ? String(value).toLowerCase() : "";
                })
                .some((value) => value.includes(lower))
        );
    }, [companies, effectiveFields, query]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    const listShouldScroll = filteredCompanies.length > 3;
    const listContainerClass = [
        "space-y-6",
        listShouldScroll &&
        "max-h-96 overflow-y-auto pr-3 company-credentials-scroll",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section className="bg-base-100 border border-base-200 rounded-3xl shadow-xl p-8 space-y-6 md:p-10">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
                    {title}
                </h2>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full md:w-auto md:justify-end">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-72">
                        <input
                            type="search"
                            className="grow"
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={handleSearch}
                        />
                        <span className="btn btn-ghost btn-circle btn-sm pointer-events-none">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7 7 0 1010.3 17a7 7 0 006.35-6.35z"
                />
              </svg>
            </span>
                    </label>

                    {headerActions && (
                        <div className="w-full md:w-auto">{headerActions}</div>
                    )}
                </div>
            </header>

            <div className={listContainerClass}>
                {filteredCompanies.map((company) => (
                    <div key={company.id} className="flex-shrink-0">
                        <CompanyCredentialsCard
                            company={company}
                            fieldConfig={effectiveFields}
                            onViewMore={onViewMore}
                            onAccept={onAccept}
                            viewLabel={viewLabel}
                            acceptLabel={acceptLabel}
                            viewVariant={viewVariant}
                            acceptVariant={acceptVariant}
                            viewButtonClassName={viewButtonClassName}
                            acceptButtonClassName={acceptButtonClassName}
                        />
                    </div>
                ))}

                {filteredCompanies.length === 0 && (
                    <div className="alert alert-info shadow">
                        <span>Nenhuma credencial encontrada.</span>
                    </div>
                )}
            </div>
        </section>
    );
}

CompanyCredentialsList.propTypes = {
    companies: PropTypes.arrayOf(PropTypes.object).isRequired,
    onViewMore: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
    title: PropTypes.string,
    fieldConfig: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.string.isRequired,
            getValue: PropTypes.func,
            className: PropTypes.string,
        })
    ),
    viewLabel: PropTypes.string,
    acceptLabel: PropTypes.string,
    viewVariant: PropTypes.string,
    acceptVariant: PropTypes.string,
    viewButtonClassName: PropTypes.string,
    acceptButtonClassName: PropTypes.string,
    headerActions: PropTypes.node,
    searchPlaceholder: PropTypes.string,
};
