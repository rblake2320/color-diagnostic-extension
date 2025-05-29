# PowerShell script to generate Chrome extension icons
Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Create gradient brush
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, 
        [System.Drawing.Color]::FromArgb(102, 126, 234),  # #667eea
        [System.Drawing.Color]::FromArgb(245, 0, 87),     # #f50057
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
    
    # Draw filled rounded rectangle
    $radius = [int]($Size * 0.2)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $radius*2, $radius*2, 180, 90)
    $path.AddArc($Size - $radius*2, 0, $radius*2, $radius*2, 270, 90)
    $path.AddArc($Size - $radius*2, $Size - $radius*2, $radius*2, $radius*2, 0, 90)
    $path.AddArc(0, $Size - $radius*2, $radius*2, $radius*2, 90, 90)
    $path.CloseAllFigures()
    
    $graphics.FillPath($brush, $path)
    
    # Add text (using emoji might not work, so let's use a letter)
    $font = New-Object System.Drawing.Font("Arial", ($Size * 0.4), [System.Drawing.FontStyle]::Bold)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $graphics.DrawString("C", $font, [System.Drawing.Brushes]::White, 
        ($Size/2), ($Size/2), $stringFormat)
    
    # Save the image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $font.Dispose()
    
    Write-Host "✓ Created $OutputPath" -ForegroundColor Green
}

# Get the script directory
$extensionDir = "C:\Users\me\OneDrive\Desktop\color-diagnostic-extension"

# Generate all three icon sizes
Create-Icon -Size 16 -OutputPath "$extensionDir\icon16.png"
Create-Icon -Size 48 -OutputPath "$extensionDir\icon48.png"
Create-Icon -Size 128 -OutputPath "$extensionDir\icon128.png"

Write-Host "`n✅ All icons generated successfully!" -ForegroundColor Green
Write-Host "`n📦 Your extension is now ready to be loaded in Chrome!" -ForegroundColor Cyan
Write-Host "1. Open Chrome and go to: chrome://extensions/" -ForegroundColor Yellow
Write-Host "2. Enable 'Developer mode' (top right)" -ForegroundColor Yellow
Write-Host "3. Click 'Load unpacked'" -ForegroundColor Yellow
Write-Host "4. Select the folder: $extensionDir" -ForegroundColor Yellow
