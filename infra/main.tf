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
  default     = "fit-forge-493917"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "Database password for fitforge user"
  type        = string
  sensitive   = true
}

# ============================================================
# Cloud SQL — PostgreSQL (main database)
# ============================================================
resource "google_sql_database_instance" "fitforge_db" {
  name             = "fitforge-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-f1-micro" # Cheapest tier (~$7/month)
    availability_type = "ZONAL"
    disk_size         = 10 # GB
    disk_type         = "PD_SSD"

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "allow-all" # For dev — restrict in production
        value = "0.0.0.0/0"
      }
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "03:00" # 3 AM backup
    }

    maintenance_window {
      day          = 7 # Sunday
      hour         = 4 # 4 AM
      update_track = "stable"
    }
  }

  deletion_protection = false # Set to true in production
}

resource "google_sql_database" "fitforge" {
  name     = "fitforge"
  instance = google_sql_database_instance.fitforge_db.name
}

resource "google_sql_user" "fitforge_user" {
  name     = "fitforge_app"
  instance = google_sql_database_instance.fitforge_db.name
  password = var.db_password
}

# ============================================================
# Cloud Storage — for exercise GIFs, progress photos
# ============================================================
resource "google_storage_bucket" "fitforge_media" {
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
      age = 365 # Delete files older than 1 year
    }
    action {
      type = "Delete"
    }
  }
}

# Make media bucket publicly readable (for exercise GIFs)
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.fitforge_media.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ============================================================
# Cloud Run — API backend (future)
# ============================================================
resource "google_cloud_run_v2_service" "fitforge_api" {
  name     = "fitforge-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/cloudrun/placeholder" # Replace with actual image

      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.fitforge_db.public_ip_address
      }
      env {
        name  = "DB_NAME"
        value = "fitforge"
      }
      env {
        name  = "DB_USER"
        value = "fitforge_app"
      }
      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id
            version = "latest"
          }
        }
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0 # Scale to zero when idle
      max_instance_count = 5
    }
  }

  depends_on = [google_secret_manager_secret_version.db_password_version]
}

# Allow public access to API
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.fitforge_api.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ============================================================
# Secret Manager — for DB password
# ============================================================
resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "fitforge-db-password"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "db_password_version" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

# IAM for Cloud Run to access secrets
resource "google_secret_manager_secret_iam_member" "cloudrun_access" {
  secret_id = google_secret_manager_secret.db_password.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

data "google_project" "project" {
  project_id = var.project_id
}

# ============================================================
# Outputs
# ============================================================
output "db_connection_name" {
  value       = google_sql_database_instance.fitforge_db.connection_name
  description = "Cloud SQL connection name"
}

output "db_public_ip" {
  value       = google_sql_database_instance.fitforge_db.public_ip_address
  description = "Cloud SQL public IP"
}

output "api_url" {
  value       = google_cloud_run_v2_service.fitforge_api.uri
  description = "Cloud Run API URL"
}

output "media_bucket" {
  value       = google_storage_bucket.fitforge_media.url
  description = "Media storage bucket URL"
}
