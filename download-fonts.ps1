# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "src/assets/fonts"

# Space Grotesk fonts
$spaceGroteskWeights = @("Light", "Regular", "Medium", "SemiBold", "Bold")
foreach ($weight in $spaceGroteskWeights) {
    $url = "https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXsrPMBTTA.woff2"
    $outputPath = "src/assets/fonts/SpaceGrotesk-$weight.woff2"
    Write-Host "Downloading $outputPath..."
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Orbitron fonts
$orbitronWeights = @("Regular", "Medium", "SemiBold", "Bold", "ExtraBold", "Black")
foreach ($weight in $orbitronWeights) {
    $url = "https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
    $outputPath = "src/assets/fonts/Orbitron-$weight.woff2"
    Write-Host "Downloading $outputPath..."
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

Write-Host "All fonts downloaded successfully!" 