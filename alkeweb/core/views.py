from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Transaccion, Contacto, Balance
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from decimal import Decimal


# ---------------- LOGIN / LOGOUT ----------------

def login_view(request):
    attempts = request.session.get("login_attempts", 0)
    lock_time = request.session.get("lock_time")

    if lock_time:
        lock_time = timezone.datetime.fromisoformat(lock_time)
        if timezone.now() < lock_time:
            remaining = (lock_time - timezone.now()).seconds // 60
            messages.error(request, f"Has superado el límite de intentos. Espera {remaining} minutos.")
            return render(request, "login.html")

        request.session["login_attempts"] = 0
        request.session["lock_time"] = None
        attempts = 0

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            request.session["login_attempts"] = 0
            request.session["lock_time"] = None
            login(request, user)
            return redirect("saldo")

        attempts += 1
        request.session["login_attempts"] = attempts

        remaining = 3 - attempts

        if remaining > 0:
            messages.error(request, f"Usuario o contraseña incorrectos. Te quedan {remaining} intento(s).")
        else:
            lock_until = timezone.now() + timedelta(minutes=30)
            request.session["lock_time"] = lock_until.isoformat()
            messages.error(request, "Has superado el límite de intentos. Debes esperar 30 minutos.")

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("login")


# ---------------- SALDO ----------------

@login_required
def saldo(request):
    usuario = request.user
    balance, created = Balance.objects.get_or_create(usuario=usuario)

    if created:
        messages.success(request, "🎉 ¡Bienvenido! Te regalamos $100.000 para comenzar.")

    transacciones = Transaccion.objects.filter(
        Q(emisor=usuario) | Q(receptor=usuario)
    ).order_by("-fecha")

    contactos = usuario.contactos.all()

    return render(request, "saldo.html", {
        "saldo": balance.monto,
        "transacciones": transacciones,
        "contactos": contactos
    })


# ---------------- CONTACTOS ----------------

@login_required
def agregar_contacto(request):
    if request.method == "POST":
        nombre = request.POST.get("nombre")
        documento = request.POST.get("documento")
        cuenta = request.POST.get("cuenta")
        tipo_cuenta = request.POST.get("tipo_cuenta")
        banco = request.POST.get("banco")
        email = request.POST.get("email")

        if Contacto.objects.filter(usuario=request.user, email=email).exists():
            messages.error(request, "Ya tienes un contacto con este correo.")
            return redirect("contactos")

        if Contacto.objects.filter(usuario=request.user, documento=documento).exists():
            messages.error(request, "Ya tienes un contacto con este RUT.")
            return redirect("contactos")

        if Contacto.objects.filter(usuario=request.user, cuenta=cuenta).exists():
            messages.error(request, "Ya tienes un contacto con este número de cuenta.")
            return redirect("contactos")

        Contacto.objects.create(
            usuario=request.user,
            nombre=nombre,
            documento=documento,
            cuenta=cuenta,
            tipo_cuenta=tipo_cuenta,
            banco=banco,
            email=email
        )

        messages.success(request, "Contacto agregado correctamente.")
        return redirect(request.GET.get("next", "contactos"))

    contactos = Contacto.objects.filter(usuario=request.user)
    return render(request, "contactos.html", {"contactos": contactos})


@login_required
def eliminar_contacto(request, contacto_id):
    contacto = Contacto.objects.get(id=contacto_id, usuario=request.user)
    contacto.delete()
    return redirect("saldo")


# ---------------- TRANSFERENCIAS ----------------

@login_required
def enviar_dinero(request):
    query = request.GET.get("buscar")

    if query:
        contactos = Contacto.objects.filter(
            usuario=request.user,
            nombre__icontains=query
        )
    else:
        contactos = Contacto.objects.filter(usuario=request.user)

    if request.method == "POST":
        print("Monto recibido:", repr(request.POST.get("monto")))
        monto = Decimal(request.POST.get("monto"))
        contacto_id = request.POST.get("destinatario")

        if monto <= 0:
            messages.error(request, "El monto debe ser mayor a 0.")
            return redirect("enviar_dinero")

        saldo_actual = request.user.balance.monto

        if monto > saldo_actual:
            messages.error(request, "Saldo insuficiente.")
            return redirect("enviar_dinero")

        try:
            contacto = Contacto.objects.get(id=contacto_id)
            destinatario_user = User.objects.get(email=contacto.email)

            if destinatario_user == request.user:
                messages.error(request, "No puedes enviarte dinero a ti mismo/a.")
                return redirect("enviar_dinero")

            request.user.balance.monto -= monto
            request.user.balance.save()

            destinatario_user.balance.monto += monto
            destinatario_user.balance.save()

            # transferencia: emisor -> receptor
            Transaccion.objects.create(
                tipo="transferencia",
                monto=monto,
                emisor=request.user,
                receptor=destinatario_user
            )

            messages.success(request, "Transferencia realizada con éxito.")
            return redirect("saldo")

        except Contacto.DoesNotExist:
            messages.error(request, "El contacto seleccionado no existe.")
            return redirect("enviar_dinero")

        except User.DoesNotExist:
            messages.error(request, "El destinatario no está registrado en el sistema.")
            return redirect("enviar_dinero")

    return render(request, "transferir.html", {
        "contactos": contactos,
        "query": query
    })