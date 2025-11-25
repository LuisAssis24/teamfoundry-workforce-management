import { httpGet } from "../http.js";

const BASE_PATH = "/api/employee/jobs";

// Devolve histórico de jobs do colaborador autenticado.
export const listEmployeeJobs = () => httpGet(BASE_PATH);
