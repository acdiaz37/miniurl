# MiniURL

## Documentos del proyecto

- [PRODUCT.md](./PRODUCT.md): definicion del producto, problema, usuarios y alcance.
- [MVP.md](./MVP.md): primera version construible y criterios de aceptacion.
- [ARCHITECTURE.md](./ARCHITECTURE.md): arquitectura tecnica de alto nivel.
- [DATA_MODEL.md](./DATA_MODEL.md): entidades, relaciones y reglas de datos.
- [SECURITY.md](./SECURITY.md): seguridad, abuso, privacidad y aislamiento entre empresas.
- [UX_FLOWS.md](./UX_FLOWS.md): flujos principales del panel.
- [API.md](./API.md): endpoints iniciales del backend.
- [TECH_STACK.md](./TECH_STACK.md): stack tecnico recomendado.
- [ANALYTICS.md](./ANALYTICS.md): metricas v1 y evolucion futura.
- [ROADMAP.md](./ROADMAP.md): fases del producto.
- [OPERATIONS.md](./OPERATIONS.md): despliegue, dominios, monitoreo y mantenimiento.

## Idea

Crear una plataforma de acortamiento de URLs pensada para empresas, donde cada cliente tenga su propio subdominio bajo un dominio corto común.

Ejemplo:

```text
cocacola.y.yy/asfdsd5234
```

La parte `cocacola` identifica a la empresa, y `asfdsd5234` identifica el enlace corto dentro de esa empresa.

## Respuesta corta

Sí, este modelo es posible.

No se trata de modificar una URL ajena ni de cambiar un `www` existente. La solución es controlar un dominio base propio y usar subdominios personalizados por empresa.

## Arquitectura mínima

### 1. Dominio base

- Comprar y controlar un dominio corto, por ejemplo `y.yy`.
- Ese dominio apunta a la infraestructura del acortador.

### 2. Subdominios por empresa

- Cada empresa usa un subdominio:
  - `cocacola.y.yy`
  - `nike.y.yy`
  - `acme.y.yy`
- El subdominio identifica al tenant o cliente.

### 3. URL corta

- La ruta final contiene el slug del enlace:
  - `cocacola.y.yy/asfdsd5234`
- El backend recibe:
  - host = `cocacola.y.yy`
  - slug = `asfdsd5234`

### 4. Base de datos

Necesitamos guardar, como mínimo:

- empresa
- subdominio
- slug
- URL destino
- estado del enlace
- fecha de creación
- contador de clics, si queremos analítica básica

### 5. Servidor de redirección

Cuando entra una solicitud:

1. Se lee el `Host`.
2. Se extrae el subdominio.
3. Se busca la empresa.
4. Se busca el slug.
5. Se redirige a la URL final con `301` o `302`.

### 6. HTTPS

- Necesitamos certificados válidos para el dominio base y sus subdominios.
- Lo normal es usar un wildcard como `*.y.yy` o automatizar certificados por subdominio.

### 7. Panel de administración

Cada empresa debería poder:

- crear enlaces
- editar destinos
- pausar enlaces
- ver estadísticas
- personalizar branding, si aplica

## Flujo técnico

```text
usuario -> cocacola.y.yy/asfdsd5234
         -> DNS
         -> app
         -> identifica tenant "cocacola"
         -> busca slug "asfdsd5234"
         -> redirige al destino
```

## Lo que no hace falta

- No hace falta cambiar un `www` de una URL ajena.
- No hace falta que cada empresa tenga un dominio completo propio al inicio.
- No hace falta resolver lógica distinta por cada URL si el patrón de subdominio + slug está bien definido.

## Riesgos y límites

- Si la empresa quiere su propio dominio real, hace falta soporte adicional de DNS y certificados.
- Si varias empresas comparten el mismo dominio base, hay que aislar bien los tenants.
- El sistema debe validar que un subdominio no colisione con otro ya registrado.

## Preguntas abiertas

1. ¿Las empresas usarán subdominios fijos o podrán elegirlos?
2. ¿El acortador tendrá analíticas desde el inicio?
3. ¿Habrá panel de usuario para crear enlaces?
4. ¿Se aceptarán dominios personalizados por empresa en una segunda fase?
5. ¿Los enlaces serán públicos o también internos?

## Próximo paso

Definir el alcance mínimo del producto:

- solo redirección
- redirección + panel
- redirección + panel + analíticas

## Alcance propuesto v1

La primera versión del producto debe centrarse en la opción 2:

- redirección
- panel de administración
- gestión por empresa

### Qué incluye esta fase

- Crear empresas o tenants.
- Asignar a cada empresa un subdominio propio.
- Crear, editar y desactivar enlaces.
- Redirigir correctamente según subdominio y slug.
- Ver métricas básicas de clics por enlace.

### Qué no incluye todavía

- analíticas avanzadas
- geolocalización
- dispositivo o navegador
- referrer detallado
- exportación de datos
- segmentación avanzada por campaña

### Nota de evolución

Esta v1 está pensada para dejar lista la base del producto. La siguiente evolución natural será la opción 3, añadiendo analíticas más ricas y capacidades de medición empresarial.
