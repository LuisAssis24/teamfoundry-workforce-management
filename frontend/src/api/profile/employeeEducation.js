import { httpDelete, httpGet, httpPost, httpPut } from "../http.js";

const BASE_PATH = "/api/employee/education";

export const listEmployeeEducation = () => httpGet(BASE_PATH);

export const createEmployeeEducation = (payload) => httpPost(BASE_PATH, payload);

export const updateEmployeeEducation = (id, payload) => httpPut(`${BASE_PATH}/${id}`, payload);

export const deleteEmployeeEducation = (id) => httpDelete(`${BASE_PATH}/${id}`);
