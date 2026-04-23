terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ============================================================
# Variables
# ============================================================
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "bodysync-494202"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

# ============================================================
# Cloud Storage — exercise GIFs & progress photos
# Cost: ~$0.02/month for small usage (5GB free tier)
# ============================================================
resource "google_storage_bucket" "bodysync_media" {
  name          = "${var.project_id}-media"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }
}

# Public read access for exercise GIFs
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.bodysync_media.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ============================================================
# Outputs
# ============================================================
output "media_bucket_url" {
  value       = google_storage_bucket.bodysync_media.url
  description = "Media storage bucket URL"
}

output "media_bucket_name" {
  value       = google_storage_bucket.bodysync_media.name
  description = "Media storage bucket name"
}
