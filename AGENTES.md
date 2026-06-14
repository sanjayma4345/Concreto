# Guías del Repositorio

## Estructura del Proyecto

### Directorios Principales

- `skill/` - Fuente principal del skill: SKILL.md, reference/, scripts/, agents/
- `cli/` - Interfaz de línea de comandos y motor de detección
- `cli/engine/rules/` - Implementaciones de reglas de detección
- `cli/engine/engines/` - Motores: browser, static-html, regex
- `cli/engine/ml/` - Sistema de detección con ML (opcional)
- `cli/engine/registry/` - Definiciones de reglas anti-patrones
- `extension/` - Extensión de navegador
- `site/` - Sitio web y documentación
- `tests/` - Suites de pruebas

### Directorios Generados

Los directorios `.agents/`, `.claude/`, `.cursor/`, etc. son artefactos de distribución generados automáticamente.

## Comandos de Desarrollo

```bash
# Desarrollo
bun run dev              # Servidor de desarrollo
bun run build            # Build completo
bun run build:watch      # Build con watch mode

# Testing
bun test                 # Todas las pruebas
bun test tests/cli       # Solo tests CLI
bun run test:coverage    # Con cobertura

# Linting y formato
bun run lint             # Verificar código
bun run lint:fix         # Corregir automáticamente
bun run format           # Formatear código
bun run typecheck        # Verificar tipos

# Detección
bun run detect src/      # Detectar anti-patrones
bun run analyze src/     # Análisis profundo
bun run ml:train         # Entrenar modelos ML
```

## Convenciones de Código

### Estilo

- ESM modules con extensiones `.mjs` o `.js`
- TypeScript para código nuevo
- Dos espacios de indentación
- Semicolons obligatorios
- Archivos nombrados en kebab-case

### Reglas de Detección

El sistema de reglas sigue convenciones específicas:

```
[CATEGORÍA][NÚMERO]-[SEVERIDAD]-[NOMBRE]
```

Categorías:
- A: Accesibilidad (Critical)
- V: Visual Quality
- P: Performance
- I: Interaction/UX
- S: Semantic/SEO

Severidades:
- CRITICAL: Bloqueante
- HIGH: Impacto mayor
- MEDIUM: Problema de calidad
- LOW: Pulido menor
- INFO: Sugerencia

### Al Agregar Nuevas Reglas

1. Crear fixtures en `tests/fixtures/antipatterns/{rule-id}.html`
2. Agregar test en `tests/detect-antipatterns-fixtures.test.mjs`
3. Registrar la regla en `cli/engine/registry/antipatterns.mjs`
4. Implementar en `cli/engine/rules/checks.mjs`
5. Actualizar contadores en `build`

## Testing

### Estructura de Tests

```
tests/
├── fixtures/           # Archivos HTML de prueba
├── cli/               # Tests del CLI
├── engine/            # Tests del motor
└── e2e/               # Tests end-to-end
```

### Fixtures

Los fixtures de anti-patrones deben tener:
- Sección SHOULD_FLAG con casos que deben detectarse
- Sección SHOULD_PASS con casos válidos
- Encabezados con entrecomillado para identificación

## Proceso de Release

```bash
# Preparar release
bun run lint && bun test
bun run build

# Crear tag
git tag -a vX.Y.Z -m "Release X.Y.Z"
git push origin vX.Y.Z

# Publicar
npm publish
```

## Notas para Agentes

### Errores Comunes a Evitar

1. No editar archivos generados directamente
2. Siempre actualizar contadores después de cambios en reglas
3. Probar con `--ml` cuando se usan funciones ML
4. Verificar contraste con `verify-contrast` no con estimaciones

### Patrones de Detección

El motor usa tres capas:
1. Regex (rápido, sin DOM)
2. Static HTML (DOM simulado)
3. Browser (cómputo real de estilos)

Cada capa tiene adapters específicos.
