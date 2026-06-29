# Sistema de donaciones — guía de instalación

Dos piezas que trabajan juntas:

1. **`GestionDonaciones.gs`** — el Apps Script dentro de tu planilla. Hace las cuentas y además expone una API web.
2. **`index.html`** — la página pública (la subís a un hosting estático como Netlify). Lee la API y muestra todo.

---

## PARTE A — Apps Script (la planilla)

### 1. Pegar el código
1. Abrí tu planilla de respuestas.
2. **Extensiones ▸ Apps Script**.
3. Borrá lo que haya en `Código.gs`, pegá **todo** `GestionDonaciones.gs` y guardá (💾).
4. Volvé a la planilla y recargá. Aparece el menú **💰 Donaciones**.

### 2. Preparar las hojas (una sola vez)
Desde el menú **💰 Donaciones**:
- **1) Crear/Reparar hojas** → crea *Egresos*, *Tasas* y *Resumen*, y pone casillas en la columna VERIFICADA.
- **2) Poner casillas en la columna VERIFICADA** → si agregás filas nuevas, volvé a correrlo para que las nuevas también tengan casilla.
- **3) Sembrar fila de ejemplo en Egresos** → opcional, para ver cómo se cargan los gastos.

### 3. Ajustar tasas
En la hoja **Tasas**, columna *Unidades por 1 USD*: poné el valor del dólar (ej. `1180`). USD/USDT = `1`. El sistema la lee en vivo.

### 4. Marcar verificadas y actualizar
Tildá las casillas de las donaciones confirmadas y corré **Actualizar Resumen ahora**. Solo las tildadas suman.

### 5. Publicar el Apps Script como app web (esto da la URL para la página)
1. En el editor de Apps Script: botón **Implementar ▸ Nueva implementación**.
2. Engranaje ⚙ ▸ tipo **Aplicación web**.
3. Configurá:
   - **Descripción**: `API donaciones`
   - **Ejecutar como**: *Yo* (tu cuenta)
   - **Quién tiene acceso**: **Cualquier persona**  ← importante, sin esto la página no puede leer.
4. **Implementar**. La primera vez te pide autorizar permisos: aceptá con tu cuenta.
5. Copiá la **URL de la aplicación web** (termina en **`/exec`**).

> Probala pegándola en el navegador: deberías ver un texto JSON con los datos. Si lo ves, está OK.

### 6. Cómo actualizar el código más adelante (reimplementar)
Cuando cambies el `.gs`:
1. **Implementar ▸ Administrar implementaciones**.
2. En tu implementación, ✏️ (editar) ▸ en *Versión* elegí **Versión nueva** ▸ **Implementar**.
3. **La URL `/exec` NO cambia** — no tenés que tocar nada en la página. (Si en cambio creás una implementación nueva desde cero, sí cambia la URL.)

---

## PARTE B — La página web (Netlify)

### 1. Pegar la URL en la página
Abrí `index.html` y reemplazá esta línea con tu URL `/exec`:

```js
var WEBAPP_URL = "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT/exec";
```

Por ejemplo:

```js
var WEBAPP_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

### 2. Subir a Netlify (opción fácil, sin cuenta técnica)
1. Entrá a https://app.netlify.com/drop
2. Arrastrá la **carpeta** que contiene `index.html` y `netlify.toml`.
3. Listo: Netlify te da una URL pública (ej. `https://algo-lindo.netlify.app`). Esa es la que compartís.

> Para cambios futuros (ej. nueva URL o ajustes de diseño): volvé a arrastrar la carpeta, o si conectás un repositorio de GitHub, Netlify re-publica solo en cada cambio.

### 3. Dominio propio (opcional)
En Netlify: **Site settings ▸ Domain management ▸ Add a domain**.

---

## Resumen rápido del flujo
- Cargás/recibís donaciones → tildás las verificadas → corrés *Actualizar Resumen*.
- Cargás gastos en la hoja *Egresos*.
- La página web lee todo en vivo desde el Apps Script (no hay que volver a publicarla salvo que cambies diseño o URL).

## Nota de privacidad
La página muestra públicamente nombre, método, fecha y código de operación de cada donación (para que cada quien verifique la suya). Si no querés exponer los códigos de operación, avisá y se puede ocultar esa columna en el Apps Script.
