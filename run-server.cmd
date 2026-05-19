@echo off
echo Mencari proses Node lama pada port 8000-8010...
for /L %%P in (8000,1,8010) do (
  for /f "tokens=5" %%I in ('netstat -ano ^| findstr /R /C:":%%P "') do (
    echo Menghentikan PID %%I pada port %%P...
    taskkill /PID %%I /F >nul 2>&1
  )
)
echo Menjalankan server...
node server.js
pause
