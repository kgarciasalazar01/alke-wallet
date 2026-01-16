// SENDMONEY --> ENVIAR DINERO

// Primero obtenemos referencias a los elementos del HTML usando su "id".
// Esto nos permite manipularlos desde JavaScript.
const openModalBtn = document.getElementById("openModalBtn");       // Botón que abre el modal para agregar un nuevo contacto
const contactoModal = document.getElementById("contactoModal");     // Ventana modal de Bootstrap donde se ingresan datos del contacto
const modalForm = document.getElementById("modalForm");             // Formulario dentro del modal
const contactoLista = document.getElementById("contactoLista");     // Lista donde se mostrarán los contactos guardados
const montoSection = document.getElementById("montoSection");       // Bloque oculto que aparece cuando seleccionas un contacto para enviar dinero
const enviarDineroBtn = document.getElementById("enviarDineroBtn"); // Botón para confirmar el envío de dinero
const montoInput = document.getElementById("monto");                // Campo donde se escribe el monto a enviar
const confirmationMessage = document.getElementById("confirmationMessage"); // Mensaje que confirma el envío
const buscarFormulario = document.getElementById("buscarFormulario");       // Formulario para buscar contactos
const buscarInput = document.getElementById("buscarInput");         // Campo de texto para escribir lo que quieres buscar
const contactoDetalles = document.getElementById("contactoDetalles"); // Contenedor que muestra los datos completos del contacto seleccionado

// Función para mostrar (renderizar) los contactos guardados en LocalStorage
// "LocalStorage" es como una pequeña base de datos en el navegador que guarda información aunque cierres la página.
function renderContactos(filter = "") {
  contactoLista.innerHTML = ""; // Limpia la lista antes de mostrarla
  const contactos = JSON.parse(localStorage.getItem("contactos")) || []; // Obtiene contactos guardados o un array vacío si no hay ninguno

  // Filtra contactos según lo que se haya escrito en la búsqueda (nombre o alias)
  contactos
    .filter(c =>
      c.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      c.alias.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(contacto => {
      // Crea un elemento <li> para cada contacto
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <input type="radio" name="selectedContact" value="${contacto.alias}">
        <span><strong>Alias:</strong> ${contacto.alias}</span>
      `;
      // Guarda datos completos en "dataset" para poder usarlos después
      li.dataset.nombre = contacto.nombre;
      li.dataset.cbu = contacto.cbu;
      li.dataset.banco = contacto.banco;
      li.dataset.alias = contacto.alias;
      contactoLista.appendChild(li);
    });

  // Oculta la sección de monto hasta que se seleccione un contacto
  montoSection.style.display = "none";
}

// Abrir modal con Bootstrap al hacer clic en "Agregar nuevo contacto"
openModalBtn.addEventListener("click", () => {
  const modal = new bootstrap.Modal(contactoModal);
  modal.show(); // Muestra la ventana modal
});

// Guardar nuevo contacto en LocalStorage
modalForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario recargue la página

  // Obtiene valores del formulario
  const nombre = document.getElementById("modalNombre").value.trim();
  const cbu = document.getElementById("modalCBU").value.trim();
  const alias = document.getElementById("modalAlias").value.trim();
  const banco = document.getElementById("modalBanco").value.trim();

  // Validación: todos los campos son obligatorios
  if (!nombre || !cbu || !alias || !banco) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Guarda el nuevo contacto en LocalStorage
  const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  contactos.push({ nombre, cbu, alias, banco });
  localStorage.setItem("contactos", JSON.stringify(contactos));

  // Vuelve a mostrar la lista de contactos actualizada
  renderContactos();

  // Cierra el modal y limpia el formulario
  const modalInstance = bootstrap.Modal.getInstance(contactoModal);
  modalInstance.hide();
  modalForm.reset();
});

// Buscar contactos por nombre o alias
buscarFormulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const term = buscarInput.value.trim();
  renderContactos(term); // Muestra solo los contactos que coinciden con la búsqueda

  const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
  const found = contactos.some(c =>
    c.nombre.toLowerCase().includes(term.toLowerCase()) ||
    c.alias.toLowerCase().includes(term.toLowerCase())
  );

  // Elimina alerta previa si existe
  const existingAlert = document.getElementById("noContactAlert");
  if (existingAlert) existingAlert.remove();

  // Si no se encuentra el contacto, muestra alerta
  if (!found && term !== "") {
    const alert = document.createElement("div");
    alert.id = "noContactAlert";
    alert.className = "alert alert-warning mt-3";
    alert.innerHTML = `
      Contacto no agregado. Usa el botón <strong>"Agregar nuevo contacto"</strong> si deseas agregarlo.
    `;
    buscarFormulario.appendChild(alert);
  }
});

// Mostrar detalles del contacto seleccionado y habilitar sección de envío
contactoLista.addEventListener("change", (event) => {
  const selectedLi = event.target.closest("li");
  if (!selectedLi) return;

  const alias = selectedLi.dataset.alias;
  const nombre = selectedLi.dataset.nombre;
  const cbu = selectedLi.dataset.cbu;
  const banco = selectedLi.dataset.banco;

  // Muestra detalles del contacto seleccionado
  contactoDetalles.innerHTML = `
    <strong>Alias:</strong> ${alias}<br>
    <strong>Nombre:</strong> ${nombre}<br>
    <strong>CBU:</strong> ${cbu}<br>
    <strong>Banco:</strong> ${banco}
  `;

  // Muestra la sección de monto y botón de enviar
  montoSection.style.display = "block";
});

// Enviar dinero
enviarDineroBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="selectedContact"]:checked'); // Contacto seleccionado
  const monto = parseFloat(montoInput.value); // Monto ingresado

  // Validaciones
  if (!selected) {
    alert("Por favor selecciona un contacto.");
    return;
  }
  if (!monto || monto <= 0) {
    alert("Por favor ingresa un monto válido.");
    return;
  }

  const alias = selected.value;
  let saldo = parseFloat(localStorage.getItem("saldo")) || 1000; // saldo inicial por defecto
  saldo = saldo - monto; // Descontamos el monto enviado
  localStorage.setItem("saldo", saldo);

  // Guardar transacción en LocalStorage
  let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
  const nuevaTransaccion = {
    tipo: "transferencia",   // tipo de movimiento
    monto: monto,
    alias: alias,
    fecha: new Date().toLocaleString()
  };
  transacciones.push(nuevaTransaccion);
  localStorage.setItem("transacciones", JSON.stringify(transacciones));

  // Mensaje de confirmación
  confirmationMessage.textContent = `Has enviado $${monto} al alias ${alias}. Saldo actualizado: $${saldo}`;
  confirmationMessage.style.display = "block";

  // Limpia campo y oculta sección
  montoInput.value = "";
  montoSection.style.display = "none";
});

// actualiza (Renderizar) contactos al cargar la página
document.addEventListener("DOMContentLoaded", () => renderContactos());