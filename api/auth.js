// auth.js
function isAuthenticated() {
  return !!sessionStorage.getItem("userToken");
}

function protectRoute() {
  if (!isAuthenticated()) {
    window.location.href = "/"; // Redirigir a la página de inicio de sesión
  }
}

export {protectRoute}