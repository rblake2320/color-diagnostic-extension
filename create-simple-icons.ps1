# Simple PowerShell script to generate solid color icons for Chrome extension
Add-Type -AssemblyName System.Drawing

$extensionDir = "C:\Users\me\OneDrive\Desktop\color-diagnostic-extension"

# Create icon16.png
$bitmap16 = New-Object System.Drawing.Bitmap 16, 16
$graphics16 = [System.Drawing.Graphics]::FromImage($bitmap16)
$graphics16.Clear([System.Drawing.Color]::FromArgb(102, 126, 234))
$bitmap16.Save("$extensionDir\icon16.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics16.Dispose()
$bitmap16.Dispose()
Write-Host "Created icon16.png" -ForegroundColor Green

# Create icon48.png
$bitmap48 = New-Object System.Drawing.Bitmap 48, 48
$graphics48 = [System.Drawing.Graphics]::FromImage($bitmap48)
$graphics48.Clear([System.Drawing.Color]::FromArgb(118, 75, 162))
$bitmap48.Save("$extensionDir\icon48.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics48.Dispose()
$bitmap48.Dispose()
Write-Host "Created icon48.png" -ForegroundColor Green

# Create icon128.png
$bitmap128 = New-Object System.Drawing.Bitmap 128, 128
$graphics128 = [System.Drawing.Graphics]::FromImage($bitmap128)
$graphics128.Clear([System.Drawing.Color]::FromArgb(245, 0, 87))
$bitmap128.Save("$extensionDir\icon128.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics128.Dispose()
$bitmap128.Dispose()
Write-Host "Created icon128.png" -ForegroundColor Green

Write-Host "`n✅ All icons created successfully!" -ForegroundColor Green
Write-Host "`n📦 To install your Chrome extension:" -ForegroundColor Cyan
Write-Host "1. Open Chrome and go to: chrome://extensions/" -ForegroundColor Yellow
Write-Host "2. Enable 'Developer mode' (toggle in top right)" -ForegroundColor Yellow
Write-Host "3. Click 'Load unpacked'" -ForegroundColor Yellow
Write-Host "4. Select: $extensionDir" -ForegroundColor Yellow
Write-Host "5. The extension will appear in your toolbar!" -ForegroundColor Yellow
