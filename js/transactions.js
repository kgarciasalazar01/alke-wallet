// Función para obtener un nombre legible del tipo de transacción
// Recibe un "tipo" (ej: "compra", "deposito", "transferencia") y devuelve un texto amigable.
function getTipoTransaccion(tipo) {
  switch (tipo) {
    case "compra": return "Compra";
    case "deposito": return "Depósito";
    case "transferencia": return "Transferencia";
    default: return "Desconocido"; // Si el tipo no coincide con ninguno, devuelve "Desconocido"
  }
}

// Función para mostrar los movimientos filtrados en pantalla
function mostrarUltimosMovimientos(filtro) {
  const lista = document.getElementById("lista-movimientos"); // Contenedor donde se mostrarán las tarjetas de movimientos
  lista.innerHTML = ""; // Limpia la lista antes de de actualizar (renderizar)

  // Leer transacciones guardadas en LocalStorage
  // LocalStorage es como una pequeña base de datos en el navegador que guarda información aunque cierres la página.
  const movimientos = JSON.parse(localStorage.getItem("transacciones")) || [];

  // Si el filtro es "todos", muestra todos los movimientos.
  // Si no, filtra por el tipo seleccionado (ej: solo "compra").
  const filtrados = filtro === "todos" ? movimientos : movimientos.filter(m => m.tipo === filtro);

  // Si no hay movimientos para el filtro, muestra un mensaje en pantalla
  if (filtrados.length === 0) {
    lista.innerHTML = `<div class="col-12 text-center text-muted">No hay movimientos para este filtro.</div>`;
    return;
  }

  // Recorre cada movimiento filtrado y crea una tarjeta (card) con sus datos
  filtrados.forEach(m => {
    const card = `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- Título con el tipo de transacción -->
            <h5 class="card-title">${getTipoTransaccion(m.tipo)}</h5>
            
            <!-- Si existe un detalle, lo muestra -->
            ${m.detalle ? `<p class="card-text">${m.detalle}</p>` : ""}
            
            <!-- Si existe un alias destino, lo muestra -->
            ${m.alias ? `<p class="card-text">Alias destino: ${m.alias}</p>` : ""}
            
            <!-- Fecha del movimiento -->
            <p class="text-muted mb-1"><small>${m.fecha}</small></p>
            
            <!-- Monto del movimiento -->
            <p class="fw-bold">$${m.monto}</p>
          </div>
        </div>
      </div>
    `;
    // Agrega la tarjeta al contenedor de movimientos
    lista.innerHTML += card;
  });
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Muestra todos los movimientos al inicio
  mostrarUltimosMovimientos("todos");

  // Obtiene referencias al select de filtro y al botón de buscar
  const filtroSelect = document.getElementById("filtro");
  const btnBuscar = document.getElementById("btnBuscar");

  // Evento del botón Buscar
  // Cuando se hace clic, se muestran los movimientos según el filtro seleccionado
  btnBuscar.addEventListener("click", () => {
    mostrarUltimosMovimientos(filtroSelect.value);
  });
});