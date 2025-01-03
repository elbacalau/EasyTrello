# Cambiar directorio al backend y ejecutar
Start-Process -NoNewWindow -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "./backend"

# Cambiar directorio al frontend y ejecutar
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "./frontend"

Write-Host "Backend y Frontend ejecutándose..."
