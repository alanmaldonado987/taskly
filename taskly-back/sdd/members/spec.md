# Members Module Specification

## Purpose
API para gestión de miembros de un proyecto.

## Requirements

### Requirement: Add Member

El sistema DEBE permitir agregar miembros a un proyecto.

#### Scenario: Add member by email

- GIVEN usuario es OWNER del proyecto
- WHEN agrega miembro con email y role
- THEN ProjectMember creado con color asignada

#### Scenario: Add duplicate member

- GIVEN miembro con mismo email ya existe
- WHEN intenta agregar
- THEN retorna 409 Conflict

### Requirement: List Members

El sistema DEBE listar todos los miembros de un proyecto.

#### Scenario: List all members

- GIVEN usuario es miembro del proyecto
- WHEN solicita lista
- THEN retorna array de ProjectMember

### Requirement: Update Member Role

El sistema DEBE permitir cambiar roles de miembros.

#### Scenario: Promote to admin

- GIVEN usuario es OWNER
- WHEN cambia rol a ADMIN
- THEN rol actualizado

#### Scenario: Owner cannot be demoted

- GIVEN usuario es OWNER
- WHEN intenta cambiar su propio rol
- THEN retorna 400 error

### Requirement: Remove Member

El sistema DEBE permitir remover miembros (no OWNER).

#### Scenario: Remove member

- GIVEN usuario es ADMIN
- WHEN remueve miembro
- THEN miembro eliminado

#### Scenario: Cannot remove owner

- GIVEN intenta remover al OWNER
- WHEN ejecuta acción
- THEN retorna 403 Forbidden

### Requirement: Update Member Profile

El sistema DEBE permitir editar perfil del miembro.

#### Scenario: Update name and color

- GIVEN miembro autenticado
- WHEN actualiza name o color
- THEN datos actualizados