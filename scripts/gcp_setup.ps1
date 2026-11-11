<#
.SYNOPSIS
    One-click GCP setup script for Project Northgate.
.DESCRIPTION
    Enables GCP APIs, creates Artifact Registry Docker repo, creates GitHub Actions Service Account,
    and outputs the service account key for GitHub Secrets.
#>

$ErrorActionPreference = "Stop"

$REGION = "asia-south1"
$ARTIFACT_REPO = "northgate-repo"
$SA_NAME = "github-actions-northgate"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting GCP Provisioning for Project Northgate" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Fetch current GCP Project ID
$PROJECT_ID = (gcloud config get-value project 2>$null)
if (-not $PROJECT_ID) {
    Write-Error "No active GCP Project detected. Run: gcloud config set project <PROJECT_ID>"
    exit 1
}
Write-Host "Active GCP Project ID: $PROJECT_ID" -ForegroundColor Green

# 2. Enable APIs
Write-Host "`n-> Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    artifactregistry.googleapis.com `
    iam.googleapis.com `
    cloudbuild.googleapis.com `
    compute.googleapis.com

# 3. Create Artifact Registry
Write-Host "`n-> Creating Artifact Registry repository '$ARTIFACT_REPO'..." -ForegroundColor Yellow
gcloud artifacts repositories create $ARTIFACT_REPO `
    --repository-format=docker `
    --location=$REGION `
    --description="Docker repository for Project Northgate" `
    --quiet 2>$null

# 4. Create Service Account
$SA_EMAIL = "${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
Write-Host "`n-> Setting up GitHub Actions Service Account '$SA_EMAIL'..." -ForegroundColor Yellow
gcloud iam service-accounts create $SA_NAME `
    --display-name="GitHub Actions Northgate Deployer" `
    --quiet 2>$null

# 5. Assign Roles
$ROLES = @(
    "roles/run.admin",
    "roles/artifactregistry.writer",
    "roles/iam.serviceAccountUser"
)

foreach ($ROLE in $ROLES) {
    Write-Host "   Assigning $ROLE..." -ForegroundColor Gray
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:$SA_EMAIL" `
        --role=$ROLE `
        --quiet | Out-Null
}

# 6. Generate Key
$KEY_PATH = "gcp-key.json"
Write-Host "`n-> Generating Service Account Key ($KEY_PATH)..." -ForegroundColor Yellow
gcloud iam service-accounts keys create $KEY_PATH `
    --iam-account=$SA_EMAIL

Write-Host "`n==============================================================================" -ForegroundColor Green
Write-Host " SUCCESS! Google Cloud Platform is ready for Project Northgate." -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "`nNEXT STEPS IN GITHUB:" -ForegroundColor Cyan
Write-Host "1. In your GitHub repository: Settings -> Secrets and variables -> Actions"
Write-Host "2. Click 'New repository secret'"
Write-Host "3. Name: GCP_SA_KEY"
Write-Host "4. Value: Copy and paste the JSON content below:`n"

Get-Content $KEY_PATH -Raw

Remove-Item -Path $KEY_PATH -Force -ErrorAction SilentlyContinue
