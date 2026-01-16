// MENÚ
//Función para redirigir a otra pantalla mostrando un mensaje antes
function redirigir(pantalla, url) {
  // Obtiene el elemento donde se mostrará el mensaje dinámico
  const mensaje = document.getElementById("menuMessage");

  // Cambia el texto para avisar al usuario a qué pantalla se va a dirigir
  mensaje.textContent = `Redirigiendo a ${pantalla}...`;

  // Espera 1.5 segundos y luego cambia la página a la URL indicada
  setTimeout(() => {
    window.location.href = url;
  }, 1500); // 1500 milisegundos = 1.5 segundos
}

// Cuando el documento HTML está completamente cargado, se ejecuta este bloque
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene las referencias a los botones por su ID
  const depositoBtn = document.getElementById("depositoBtn");       // Botón para ir a la página de depósito
  const enviarBtn = document.getElementById("enviarBtn");           // Botón para ir a la página de enviar dinero
  const transacionBtn = document.getElementById("transacionBtn");   // Botón para ir a la página de últimos movimientos
  const cerrarSesionBtn = document.getElementById("cerrarSesionBtn"); // Botón para cerrar sesión

  // Si existe el botón de cerrar sesión, agrega un "listener" (escuchador de eventos)
  // que redirige a la página de login cuando se hace clic
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => redirigir("Cerrar Sesión", "login.html"));
  }

  // Si existe el botón de depósito, redirige a la página de depósito con un clic
  if (depositoBtn) {
    depositoBtn.addEventListener("click", () => redirigir("Depósito", "deposit.html"));
  }

  // Si existe el botón de enviar dinero, redirige a la página de enviar dinero con un clic
  if (enviarBtn) {
    enviarBtn.addEventListener("click", () => redirigir("Enviar Dinero", "sendmoney.html"));
  }

  // Si existe el botón de transacciones, redirige a la página de últimos movimientos con un clic
  if (transacionBtn) {
    transacionBtn.addEventListener("click", () => redirigir("Últimos Movimientos", "transactions.html"));
  }

  // Mostrar saldo en el menú
  const saldoElement = document.getElementById("saldo"); // Elemento HTML donde se muestra el saldo
  // Obtiene el saldo guardado en LocalStorage. Si no existe, usa 0 por defecto.
  let saldo = parseFloat(localStorage.getItem("saldo")) || 0;
  // Inserta el saldo en el elemento HTML con formato de dinero
  saldoElement.innerText = `$${saldo}`;
});