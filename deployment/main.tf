# Provider configuration for GCP:
provider "google" {
  project = "kubernetesassignment-417521"
  region = "us-central1"
  credentials = file("./credentials.json")
}

# Resource configuration for GKE:
resource "google_container_cluster" "assignment_cluster" {
  name = "kubernetes-assignment"
  location = "us-central1-a"
  initial_node_count = 1

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    disk_type = "pd-standard"
    image_type = "COS_CONTAINERD"
  }
}

# Resource configuration for Persistent Disk:
resource "google_compute_disk" "persistent_disk" {
  name = "kubernetes-volume"
  type = "pd-standard"
  zone = "us-central1-a" 
  size = 10
}