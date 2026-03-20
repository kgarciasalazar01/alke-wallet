#  Proyecto: Alke Web Base

##  Descripción General
Alke Web Base es una aplicación web desarrollada utilizando el framework **Django**, como parte del Módulo 6 del curso 
*Desarrollo Web con Django – Fundamentos*.  
El proyecto tiene como propósito aplicar los conceptos esenciales del framework, incluyendo la estructura base de un proyecto, la creación de aplicaciones, la configuración de rutas, la implementación de vistas, el uso de plantillas y la gestión de archivos estáticos.

La aplicación implementa funcionalidades reales como gestión de usuarios, contactos, transferencias de dinero, visualización de saldos y registro de transacciones, demostrando un entendimiento sólido del flujo petición–respuesta propio de Django.

---

##  Objetivos del Proyecto
- Comprender la estructura fundamental de un proyecto Django.
- Implementar vistas y rutas para responder a solicitudes HTTP.
- Integrar plantillas HTML mediante el sistema de renderizado de Django.
- Configurar y utilizar archivos estáticos (CSS).
- Desarrollar una aplicación funcional que represente un flujo real de interacción entre usuario y servidor.

---

##  Tecnologías Utilizadas
- **Python 3.x**
- **Django**
- **HTML5**
- **CSS3**
- **Visual Studio Code**

---

##  Estructura del Proyecto
El proyecto sigue la estructura estándar recomendada por Django:

/Alkewallet
│── venv/                     # Entorno virtual del proyecto
│
│── alkeweb/                  # Carpeta principal del proyecto
│   │
│   ├── alkeweb/              # Configuración interna del proyecto Django
│   │   ├── settings.py       # Configuración general del proyecto
│   │   ├── urls.py           # Enrutamiento principal
│   │   ├── wsgi.py           # Configuración para despliegue WSGI
│   │   ├── asgi.py           # Configuración para despliegue ASGI
│   │   ├── __init__.py
│   │
│   ├── core/                 # Aplicación principal del proyecto
│   │   ├── __init__.py
│   │   ├── models.py         # Modelos de datos (Usuarios, Contactos, Transacciones, Balance)
│   │   ├── admin.py          # Registro de modelos en el panel de administración
│   │   ├── apps.py           # Configuración de la aplicación
│   │   ├── views.py          # Lógica de vistas
│   │   ├── urls.py           # Enrutamiento interno de la app
│   │   ├── test.py           # Archivo para pruebas (opcional)
│   │   ├── migrations/       # Migraciones de base de datos
│   │   ├── templates/        # Plantillas HTML
│   │       ├── base.html
│   │       ├── contactos.html
│   │       ├── login.html
│   │       ├── saldo.html
│   │       ├── transferir.html
│
│── static/                   # Archivos estáticos globales
│   ├── img/
│       ├── logo.png          # Logo utilizado en la interfaz
│
│── manage.py                 # Script principal de administración de Django
│── db.sqlite3                # Base de datos del proyecto
│── README.md                 # Documentación del proyecto

##  Instalación y Ejecución
### 1. Crear entorno virtual
python -m venv venv

### 2. Activar entorno virtual
venv\Scripts\activate

### 3. Instalar dependencias
pip install django

### 4. Ejecutar el servidor de desarrollo
python manage.py runserver

### 5. Usuarios para pruebas
Usuario: usuario1
Contraseña:Test1234!
Correo: usuario1@test.com

Usuario: usuario2
Contraseña:Test1234!
Correo: usuario2@test.com

Usuario: usuario3
Contraseña:Test1234!
Correo: usuario3@test.com

## Funcionalidades Implementadas

### Gestión de usuarios
- Inicio y cierre de sesión.
- Sistema de bloqueo temporal por intentos fallidos.

### Módulo de saldo
- Visualización del saldo disponible.
- Mensaje de bienvenida con asignación inicial.
- Historial de transacciones.

### Transferencias
- Envío de dinero entre usuarios registrados.
- Validación de saldo suficiente.
- Registro de transacciones enviadas y recibidas.

### Contactos
- Registro de contactos asociados al usuario.
- Eliminación de contactos.
- Validaciones para evitar duplicados.

### Templates y archivos estáticos
- Uso de Django Template Language.
- Integración de estilos mediante CSS.

---

## Flujo de Funcionamiento
1. El usuario accede al sistema mediante login.
2. Visualiza su saldo y transacciones.
3. Puede registrar contactos.
4. Puede realizar transferencias a contactos registrados.
5. El sistema actualiza saldos y registra las operaciones.
6. El usuario puede cerrar sesión.





