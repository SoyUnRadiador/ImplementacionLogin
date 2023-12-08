const express = require('express');
const router = express.Router();
const User = require('./models/User');

router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('register');
    }
  });

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login', { layout: 'loginLayout', showButtons: false });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca al usuario por su correo electrónico en la base de datos
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            // Si el usuario no existe o la contraseña es incorrecta, muestra un mensaje de error
            console.error('Credenciales incorrectas');
            return res.redirect('/login');
        }

        // Si las credenciales son correctas, establece la sesión del usuario
        req.session.user = {
            email: user.email,
            role: user.role // Si tienes un campo de 'role' en tu modelo de usuario
        };

        res.redirect('/home'); // Redirige a la página principal o a donde desees después del login
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});


// Ruta para el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
  });


  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica si el correo electrónico ya está en uso
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('El correo electrónico ya está en uso');
        }

        // Crea un nuevo usuario si el correo no está en uso
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Aquí podrías establecer la sesión del usuario si lo deseas
        // req.session.user = { email: newUser.email, role: newUser.role };

        // Redirige a la página de inicio de sesión u otra página de tu elección
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar al usuario:', error);
        res.status(500).send('Error al registrar al usuario');
    }
});
  
module.exports = router;
