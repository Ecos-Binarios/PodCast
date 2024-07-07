const isAuthenticated = () => {
    const perfil = sessionStorage.getItem('user');
    return perfil.token !== null; // Comprueba si el token está presente
  };
  
  const protectRoute = () => {
    if (!isAuthenticated()) {
      window.location.href = '/'; // Redirigir a la página de inicio de sesión si no está autenticado
    }
  };
  
  // Llama a protectRoute en las páginas que quieres proteger
  protectRoute();
  