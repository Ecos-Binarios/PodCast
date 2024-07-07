import {API_BASE_URL, HEADERS} from "./config.js";

export const getLogin = async (user) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
};

export const getRegistro = async (user) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: HEADERS,
        credentials: "include",
        body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
};


