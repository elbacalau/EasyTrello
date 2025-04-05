-- Script para actualizar valores de BoardColumnId en tareas existentes

-- Paso 1: Crear tabla temporal con la primera columna de cada tablero
CREATE TEMPORARY TABLE IF NOT EXISTS TempBoardColumns 
SELECT BoardId, MIN(Id) AS FirstColumnId 
FROM BoardColumns 
GROUP BY BoardId;

-- Paso 2: Actualizar las tareas con la primera columna de su tablero
UPDATE Tasks t
JOIN TempBoardColumns tc ON t.BoardId = tc.BoardId
SET t.BoardColumnId = tc.FirstColumnId
WHERE t.BoardColumnId = 0 OR t.BoardColumnId IS NULL;

-- Paso 3: Eliminar la tabla temporal
DROP TEMPORARY TABLE IF EXISTS TempBoardColumns;

-- Paso 4: Verificar cuántas tareas siguen sin tener un BoardColumnId válido
SELECT COUNT(*) AS TasksWithoutValidColumn 
FROM Tasks 
WHERE BoardColumnId = 0 OR BoardColumnId IS NULL;

-- Paso 5: Agregar clave foránea si no existe
ALTER TABLE Tasks 
ADD CONSTRAINT FK_Tasks_BoardColumns 
FOREIGN KEY (BoardColumnId) REFERENCES BoardColumns(Id)
ON DELETE CASCADE;

-- Paso 6: Verificar que todas las tareas tienen una columna asociada
SELECT t.Id, t.Name, t.BoardId, t.BoardColumnId, bc.ColumnName
FROM Tasks t
LEFT JOIN BoardColumns bc ON t.BoardColumnId = bc.Id
WHERE bc.Id IS NULL; 