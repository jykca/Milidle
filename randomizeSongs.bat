@echo off
powershell -NoProfile -Command "$file = 'songList.txt'; $lines = Get-Content $file; $lines | Sort-Object { Get-Random } | Set-Content $file"
echo randomize complete
pause