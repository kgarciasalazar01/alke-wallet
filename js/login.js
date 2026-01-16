// Login

// Espera a que todo el contenido del documento (HTML) esté cargado antes de ejecutar el código.
// Esto asegura que los elementos del DOM ya existen y se pueden manipular.
document.addEventListener("DOMContentLoaded", () => {
  
  // Obtiene el formulario de login por su ID.
  // Este formulario es donde el usuario ingresa correo y contraseña.
  const loginFormulario = document.getElementById("loginFormulario");
  
  // Contenedor donde se mostrarán mensajes (ejemplo: error de login).
  const msg = document.getElementById("loginMessage");

  // Verifica que el formulario exista en la página antes de trabajar con él.
  if (loginFormulario) {
    
    // Agrega un "listener" al evento de enviar el formulario.
    // Esto significa que cuando el usuario haga clic en "Ingresar", se ejecutará esta función.
    loginFormulario.addEventListener("submit", (e) => {
      e.preventDefault();  // Evita que el formulario recargue la página por defecto.

      // Obtiene los valores ingresados por el usuario y elimina espacios en blanco.
      const user = document.getElementById("Correo").value.trim();
      const pass = document.getElementById("contraseña").value.trim();

      // Credenciales de prueba (usuario y contraseña válidos).
      // En un sistema real, estas credenciales se verificarían en un servidor o base de datos.
      const validUser = "admin@alkewallet.com";
      const validPass = "1234";

      // Verifica si las credenciales ingresadas coinciden con las válidas.
      if (user === validUser && pass === validPass) {
        // Obtiene el elemento del toast (mensaje emergente de Bootstrap).
        const toastEl = document.getElementById("loginToast");
        
        // Crea una instancia del toast usando Bootstrap.
        const toast = new bootstrap.Toast(toastEl);
        
        // Muestra el toast en pantalla (inicio de sesión exitoso).
        toast.show();

        // Después de 1.5 segundos redirige al menú principal.
        setTimeout(() => {
          window.location.href = "menu.html";
        }, 1500); // 1.5 segundos
      } else {
        // Si las credenciales no son correctas, muestra un mensaje de error en pantalla.
        msg.innerHTML = "<div class='alert alert-danger'>Usuario o contraseña incorrectas</div>";
      }
    });
  }
});