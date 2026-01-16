// Deposito
document.addEventListener("DOMContentLoaded", () => {
  const depositForm = document.getElementById("depositForm");
  const depositMessage = document.getElementById("depositMessage");

  depositForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const monto = parseFloat(document.getElementById("depositAmount").value);

    if (monto > 0) {
      // Obtener saldo actual
      let saldo = parseFloat(localStorage.getItem("saldo")) || 0;

      // Actualizar saldo
      saldo += monto;
      localStorage.setItem("saldo", saldo);

      // ✅ Guardar depósito como transacción en LocalStorage
      let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];
      const nuevaTransaccion = {
        tipo: "deposito",
        monto: monto,
        detalle: "Depósito en cuenta",
        fecha: new Date().toLocaleString()
      };
      transacciones.push(nuevaTransaccion);
      localStorage.setItem("transacciones", JSON.stringify(transacciones));

      // Mostrar mensaje de éxito
      depositMessage.innerHTML = `
        <div class="alert alert-success text-center fw-bold">
          Depósito realizado. Monto depositado: $${monto.toFixed(2)}<br>
          Saldo actualizado: $${saldo.toFixed(2)}
        </div>
      `;

      // Redirigir al menú
      setTimeout(() => window.location.href = "menu.html", 2000);
    } else {
      depositMessage.innerHTML = `
        <div class="alert alert-danger text-center fw-bold">
          Ingrese un monto válido
        </div>
      `;
    }
  });
});