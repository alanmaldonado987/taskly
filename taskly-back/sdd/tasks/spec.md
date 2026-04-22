# Tasks Module Specification

## Purpose
API para gestión completa de tareas de proyecto.

## Requirements

### Requirement: Create Task

El sistema DEBE crear una tarea asociada a un proyecto donde el usuario es miembro.

#### Scenario: Create task successfully

- GIVEN usuario autenticado es miembro del proyecto
- WHEN crea tarea con name, startDate, endDate
- THEN retorna tarea creada con id único

#### Scenario: Create task without project access

- GIVEN usuario NO es miembro del proyecto
- WHEN intenta crear tarea
- THEN retorna 403 Forbidden

### Requirement: List Tasks

El sistema DEBE listar todas las tareas de un proyecto donde el usuario es miembro.

#### Scenario: List all project tasks

- GIVEN usuario es miembro del proyecto
- WHEN solicita lista de tareas
- THEN retorna array de tareas con assignees

#### Scenario: Filter by status

- GIVEN usuario es miembro del proyecto
- WHEN filtra por status=IN_PROGRESS
- THEN retorna solo tareas en ese estado

### Requirement: Get Task Detail

El sistema DEBE retornar tarea con todas sus relaciones.

#### Scenario: Get task with dependencies

- GIVEN usuario es miembro del proyecto
- WHEN obtiene tarea por id
- THEN retorna tarea con dependsOn y dependents

### Requirement: Update Task

El sistema DEBE permitir actualizar solo a members con rol ADMIN u OWNER.

#### Scenario: Update task as owner

- GIVEN usuario es OWNER del proyecto
- WHEN actualiza tarea
- THEN retorna tarea actualizada

#### Scenario: Update task as viewer

- GIVEN usuario tiene rol VIEWER
- WHEN intenta actualizar tarea
- THEN retorna 403 Forbidden

### Requirement: Delete Task

El sistema DEBE permitir eliminar solo a ADMIN u OWNER.

#### Scenario: Delete task

- GIVEN usuario es ADMIN del proyecto
- WHEN elimina tarea
- THEN tarea eliminada (soft delete)

### Requirement: Task Dependencies

El sistema DEBE manejar dependencias entre tareas (finish-to-start).

#### Scenario: Add dependency

- GIVEN tarea A existe
- WHEN agrega dependsOn a tarea B
- THEN se crea TaskDependency

#### Scenario: Circular dependency

- GIVEN A depende de B
- WHEN B intenta depender de A
- THEN retorna 400 error (circular)

### Requirement: Assign Members

El sistema DEBE permitir asignar miembros a una tarea.

#### Scenario: Assign member

- GIVEN miembro existe en proyecto
- WHEN lo asigna a tarea
- THEN relación creada en TaskAssignees

### Requirement: Subtasks

El sistema DEBE soportar jerarquía de tareas (parent/child).

#### Scenario: Create subtask

- GIVEN tarea padre existe
- WHEN crea tarea con parentId
- THEN se crea como subtarea