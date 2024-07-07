const isAuthenticated = () => {
    const perfil = JSON.parse(sessionStorage.getItem('user'));
    return perfil.token !== null || perfil.token !== undefined; // Comprueba si el token está presente
  };
  
  const protectRoute = () => {
    if (!isAuthenticated()) {
      window.location.href = '/'; // Redirigir a la página de inicio de sesión si no está autenticado
    }
  };
  
  // Llama a protectRoute en las páginas que quieres proteger
  protectRoute();
  