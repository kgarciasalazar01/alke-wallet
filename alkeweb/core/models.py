from django.db import models
from django.contrib.auth.models import User


class Contacto(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contactos")
    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=12, default="Sin RUT")
    cuenta = models.CharField(max_length=50)
    tipo_cuenta = models.CharField(max_length=50, default="No especificado")
    banco = models.CharField(max_length=100, default="No especificado")
    email = models.EmailField(default="sin-correo@correo.com")

    class Meta:
        unique_together = ("usuario", "cuenta")

    def __str__(self):
        return f"{self.nombre} ({self.cuenta})"


class Transaccion(models.Model):
    TIPOS = [
        ("deposito", "Depósito"),
        ("transferencia", "Transferencia"),
        ("retiro", "Retiro"),
    ]

    tipo = models.CharField(max_length=20, choices=TIPOS)
    monto = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    fecha = models.DateTimeField(auto_now_add=True)

    emisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transacciones_enviadas"
    )
    receptor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transacciones_recibidas"
    )

    def __str__(self):
        return f"{self.tipo} - {self.monto}"


class Balance(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="balance")
    monto = models.DecimalField(max_digits=10, decimal_places=2, default=100000)

    def __str__(self):
        return f"Saldo de {self.usuario.username}: {self.monto}"

