import ThemePreview from './components/ThemePreview.jsx'

function App() {
  return (
    <div data-theme="foundry" className="min-h-screen bg-base-200 text-base-content">
      <header className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1 px-4">
          <span className="text-xl font-semibold tracking-wide">
            TeamFoundry Workforce
          </span>
        </div>
        <div className="flex-none gap-2 px-4">
          <button className="btn btn-secondary btn-sm font-medium">Consultar</button>
          <button className="btn btn-accent btn-sm font-medium">Nova ação</button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12">
        <section className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Biblioteca de Estilos TeamFoundry</h1>
          <p className="max-w-3xl text-base-content/80">
            Aplique Tailwind CSS 4 e DaisyUI com a paleta personalizada da TeamFoundry. Os
            componentes abaixo utilizam tokens do tema para demonstrar botões, cartões,
            alertas e indicadores com as cores institucionais.
          </p>
        </section>

        <ThemePreview />
      </main>
    </div>
  )
}

export default App
