import { useAuthContext } from "../../auth/AuthContext.jsx";
import { HomeNoLogin } from "./HomeNoLogin.jsx";
import HomeAuthenticated from "./HomeAuthenticated.jsx";

/**
 * Carrega a home correta de acordo com o estado de autenticação.
 * Aproveita o AuthContext (tokens em cache) para decidir, sem duplicar rotas.
 */
export default function HomeLayout() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <HomeAuthenticated /> : <HomeNoLogin />;
}
