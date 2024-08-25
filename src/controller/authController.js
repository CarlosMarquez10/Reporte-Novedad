export const login = (req, res) => {
  const { username, password } = req.body;

  // Aquí puedes agregar la lógica de autenticación.
  if (username === "CGO" && password === "*Inmel.2024") {
    req.session.user = username; // Establece la sesión del usuario
    res.redirect('/listado'); // Redirige al listado si la autenticación es exitosa
  } else {
    res.redirect('/login'); // Redirige de vuelta al login en caso de fallo
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/login'); // Redirige al login después de cerrar sesión
  });
};
