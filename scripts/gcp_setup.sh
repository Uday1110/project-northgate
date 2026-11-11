#!/usr/bin/env bash
# ==============================================================================
# Project Northgate — One-Click Google Cloud Platform Provisioning Script
# Run this directly in Google Cloud Shell (https://shell.cloud.google.com)
# ==============================================================================

set -euo pipefail

# Configuration
REGION="us-central1"
ARTIFACT_REPO="northgate-repo"
SA_NAME="github-actions-northgate"

echo "=================================================="
echo " Starting GCP Provisioning for Project Northgate"
echo "=================================================="

# 1. Fetch current GCP Project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
if [ -z "$PROJECT_ID" ]; then
  echo "Error: No GCP Project is currently active."
  echo "Please set your project: gcloud config set project <YOUR_PROJECT_ID>"
  exit 1
fi
echo "Active GCP Project ID: $PROJECT_ID"

# 2. Enable Required Google Cloud APIs
echo ""
echo "-> Enabling required GCP services (Cloud Run, Artifact Registry, IAM)..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  cloudbuild.googleapis.com \
  compute.googleapis.com

# 3. Create Artifact Registry Docker Repository
echo ""
echo "-> Checking Artifact Registry repository '$ARTIFACT_REPO'..."
if ! gcloud artifacts repositories describe "$ARTIFACT_REPO" --location="$REGION" &>/dev/null; then
  echo "Creating Artifact Registry repository '$ARTIFACT_REPO' in $REGION..."
  gcloud artifacts repositories create "$ARTIFACT_REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker repository for Project Northgate services"
else
  echo "Artifact Registry repository '$ARTIFACT_REPO' already exists."
fi

# 4. Create Service Account for GitHub Actions CI/CD
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
echo ""
echo "-> Checking GitHub Actions Service Account '$SA_EMAIL'..."
if ! gcloud iam service-accounts describe "$SA_EMAIL" &>/dev/null; then
  echo "Creating Service Account '$SA_NAME'..."
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name="GitHub Actions Northgate Deployer"
else
  echo "Service account '$SA_NAME' already exists."
fi

# 5. Grant Roles to Service Account
echo ""
echo "-> Assigning IAM roles for Cloud Run deployment and Artifact Registry push..."
ROLES=(
  "roles/run.admin"
  "roles/artifactregistry.writer"
  "roles/iam.serviceAccountUser"
)

for ROLE in "${ROLES[@]}"; do
  echo "   Assigning $ROLE..."
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$ROLE" \
    --condition=None --quiet >/dev/null
done

# 6. Generate Service Account Key for GitHub Secret
KEY_FILE="gcp-key.json"
echo ""
echo "-> Generating Service Account Key ($KEY_FILE)..."
gcloud iam service-accounts keys create "$KEY_FILE" \
  --iam-account="$SA_EMAIL"

echo ""
echo "=============================================================================="
echo " SUCCESS! Google Cloud Platform is configured for Project Northgate."
echo "=============================================================================="
echo ""
echo "NEXT STEPS FOR GITHUB ACTIONS:"
echo "1. Go to your GitHub repository -> Settings -> Secrets and variables -> Actions"
echo "2. Click 'New repository secret'"
echo "3. Name: GCP_SA_KEY"
echo "4. Secret value: Copy and paste the entire JSON content below:"
echo "------------------------------------------------------------------------------"
cat "$KEY_FILE"
echo ""
echo "------------------------------------------------------------------------------"
echo "5. Push your code to the 'main' branch of GitHub!"
echo "   GitHub Actions will automatically run tests, build Docker containers,"
echo "   and deploy Northgate Frontend & Backend to Cloud Run."
echo "=============================================================================="

# Security cleanup note
rm -f "$KEY_FILE"
