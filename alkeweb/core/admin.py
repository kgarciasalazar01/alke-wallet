from django.contrib import admin

from django.contrib import admin
from .models import Balance, Transaccion, Contacto

admin.site.register(Balance)
admin.site.register(Transaccion)
admin.site.register(Contacto)
