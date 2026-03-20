from django.urls import path
from . import views

urlpatterns = [
    path("contactos/", views.agregar_contacto, name="contactos"),
    path("eliminar-contacto/<int:contacto_id>/", views.eliminar_contacto, name="eliminar_contacto"),
    path("saldo/", views.saldo, name="saldo"),
    path("transferir/", views.enviar_dinero, name="enviar_dinero"),
    path("logout/", views.logout_view, name="logout"),
    path("", views.login_view, name="login"),
]