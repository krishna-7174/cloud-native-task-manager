resource "aws_ecr_repository" "backend" {
  name                 = "cloud-native-task-manager/backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project   = "cloud-native-task-manager"
    Component = "backend"
    ManagedBy = "terraform"
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "cloud-native-task-manager/frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project   = "cloud-native-task-manager"
    Component = "frontend"
    ManagedBy = "terraform"
  }
}

output "backend_repository_url" {
  description = "ECR URL for the backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_repository_url" {
  description = "ECR URL for the frontend image"
  value       = aws_ecr_repository.frontend.repository_url
}