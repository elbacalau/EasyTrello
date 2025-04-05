-- Script para actualizar tareas existentes con BoardColumnId
-- Se asignará a cada tarea la primera columna de su tablero correspondiente

-- Paso 1: Agregar la columna BoardColumnId si no existe
ALTER TABLE Tasks ADD COLUMN IF NOT EXISTS BoardColumnId INT NULL;

-- Paso 2: Crear una tabla temporal para almacenar los IDs de tableros y sus primeras columnas
CREATE TEMPORARY TABLE IF NOT EXISTS TempBoardColumns AS
SELECT BoardId, MIN(Id) AS FirstColumnId FROM BoardColumns GROUP BY BoardId;

-- Paso 3: Actualizar las tareas con la primera columna de su tablero
UPDATE Tasks t
JOIN TempBoardColumns bc ON t.BoardId = bc.BoardId
SET t.BoardColumnId = bc.FirstColumnId
WHERE t.BoardColumnId IS NULL OR t.BoardColumnId = 0;

-- Paso 4: Eliminar la tabla temporal
DROP TEMPORARY TABLE IF EXISTS TempBoardColumns;

-- Paso 5: Asegurarse de que todas las tareas tengan un BoardColumnId válido
SELECT COUNT(*) AS TasksWithoutColumn FROM Tasks WHERE BoardColumnId IS NULL OR BoardColumnId = 0;

-- Si hay tareas sin una columna válida, se deben revisar manualmente
-- o se pueden eliminar con:
-- DELETE FROM Tasks WHERE BoardColumnId IS NULL OR BoardColumnId = 0; 