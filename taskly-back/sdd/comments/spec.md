# Comments Module Specification

## Purpose
API para gestión de comentarios en tareas.

## Requirements

### Requirement: Create Comment

El sistema DEBE permitir crear comentarios en tareas.

#### Scenario: Add comment to task

- GIVEN usuario es miembro del proyecto
- WHEN crea comentario en tarea
- THEN Comment creado

#### Scenario: Comment on archived task

- GIVEN tarea está archivada
- WHEN intenta comentar
- THEN retorna 400 error

### Requirement: List Comments

El sistema DEBE listar comentarios de una tarea.

#### Scenario: Get task comments

- GIVEN usuario es miembro del proyecto
- WHEN solicita comentarios de tarea
- THEN retorna array de Comment con autor

### Requirement: Update Comment

El sistema DEBE permitir editar comentarios propios.

#### Scenario: Edit own comment

- GIVEN usuario es autor del comentario
- WHEN edita contenido
- THEN isEdited=true, contenido actualizado

#### Scenario: Edit another user comment

- GIVEN usuario NO es autor
- WHEN intenta editar
- THEN retorna 403 Forbidden

### Requirement: Delete Comment

El sistema DEBE permitir eliminar comentarios propios.

#### Scenario: Delete own comment

- GIVEN usuario es autor
- WHEN elimina comentario
- THEN comentario eliminado

### Requirement: Reactions

El sistema DEBE permitir reacciones a comentarios.

#### Scenario: Add reaction

- GIVEN miembro puede reaccionar
- WHEN agrega reacción
- THEN reacción registrada