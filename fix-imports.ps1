# Script para corrigir imports src/ para @/
$files = Get-ChildItem -Path src -Recurse -Filter "*.ts" | Where-Object { 
    (Get-Content $_.FullName -Raw) -match 'from "src/' 
}

foreach ($file in $files) {
    Write-Host "Corrigindo: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Substituir imports src/ por @/
    $content = $content -replace 'from "src/', 'from "@/'
    $content = $content -replace "from 'src/", "from '@/"
    
    # Salvar o arquivo
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Correção concluída!"
