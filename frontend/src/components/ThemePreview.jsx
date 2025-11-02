const ThemePreview = () => {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="card lg:col-span-2 border border-base-200 bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-secondary badge-lg uppercase tracking-wide">
              Operações
            </span>
            <span className="badge badge-outline">Turno manhã</span>
            <span className="badge badge-accent badge-outline">Equipe A</span>
          </div>

          <h2 className="card-title text-3xl font-semibold text-base-content">
            Painel de produtividade
          </h2>
          <p className="max-w-2xl text-base-content/80">
            Visualize indicadores críticos e distribua tarefas com um visual alinhado à
            identidade da TeamFoundry.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">Alocar equipe</button>
            <button className="btn btn-secondary">Gerar relatório</button>
            <button className="btn btn-outline">Ver logs</button>
          </div>

          <div className="stats stats-vertical gap-4 rounded-box bg-base-200 shadow md:stats-horizontal">
            <div className="stat">
              <div className="stat-title">SLA atendido</div>
              <div className="stat-value text-primary">96%</div>
              <div className="stat-desc text-success">+4% esta semana</div>
            </div>

            <div className="stat">
              <div className="stat-title">Escalas abertas</div>
              <div className="stat-value text-secondary">18</div>
              <div className="stat-desc">5 aguardando aprovação</div>
            </div>

            <div className="stat">
              <div className="stat-title">Feedbacks positivos</div>
              <div className="stat-value text-accent">42</div>
              <div className="stat-desc text-info">+12 no último turno</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-box border border-base-200 bg-base-100 p-4">
              <h3 className="text-lg font-semibold text-base-content">Treinamentos</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-base-content/80">
                  <span>Capacitação</span>
                  <span>72%</span>
                </div>
                <progress className="progress progress-primary" value="72" max="100" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-base-content/80">
                  <span>Integração</span>
                  <span>54%</span>
                </div>
                <progress className="progress progress-secondary" value="54" max="100" />
              </div>
            </div>

            <div className="space-y-3 rounded-box border border-base-200 bg-base-100 p-4">
              <h3 className="text-lg font-semibold text-base-content">Resumos rápidos</h3>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary badge-outline">Horas extras</span>
                <span className="badge badge-secondary">Cobertura</span>
                <span className="badge badge-accent badge-outline">Qualidade</span>
              </div>
              <div className="divider my-2" />
              <p className="text-sm text-base-content/80">
                Use as classes utilitárias do Tailwind combinadas com componentes DaisyUI
                para acelerar a construção de dashboards operacionais.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border border-base-200 bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h3 className="card-title text-2xl font-semibold text-base-content">Alertas</h3>

          <div role="alert" className="alert alert-info">
            <span>Nova solicitação de férias pendente.</span>
            <button className="btn btn-sm btn-ghost">Revisar</button>
          </div>

          <div role="alert" className="alert alert-warning">
            <span>Equipe B atingiu 80% da capacidade.</span>
            <button className="btn btn-sm btn-outline btn-warning">Rebalancear</button>
          </div>

          <div role="alert" className="alert alert-success">
            <span>Meta semanal de produtividade alcançada!</span>
          </div>

          <div className="rounded-box border border-dashed border-base-200 bg-base-100 p-4">
            <h4 className="text-base font-semibold text-base-content">Próximos passos</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-base-content/80">
              <li>Adicionar formulários com classes `input` e `textarea`.</li>
              <li>Construir dashboards com `tabs` e `table` do DaisyUI.</li>
              <li>Configurar modo escuro com variações de tema.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThemePreview

