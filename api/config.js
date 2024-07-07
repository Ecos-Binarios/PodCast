const API_BASE_URL = 'https://ecos-podcast.onrender.com/api';

const perfil = JSON.parse(sessionStorage.getItem("user"));

const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MiAplicacion/1.0',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    ...(perfil && { 'Authorization': `Bearer ${perfil.token}` }) // Si estás utilizando autenticación basada en tokens
  };

export {API_BASE_URL, HEADERS};