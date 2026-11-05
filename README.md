# Cloud Native Task Manager



A full-stack task manager application deployed with Docker, Kubernetes, GitHub Actions, Terraform, AWS ECR, EC2, MongoDB Atlas, and AWS Systems Manager Parameter Store.



## Live Application



The application is deployed on AWS EC2 and is available through its EC2 public IP address.



> The public IP may change if the EC2 instance is stopped and started.



## Architecture



```text

User Browser

     |

     | HTTP :80

     v

AWS EC2 (Amazon Linux)

     |

     +-- Frontend container (React + Nginx)

     |     |

     |     +-- /api proxy

     |

     +-- Backend container (Node.js + Express)

                 |

                 v

           MongoDB Atlas

```



## Technology Stack



- Frontend: React, Vite, Axios, Nginx

- Backend: Node.js, Express, Mongoose

- Database: MongoDB Atlas

- Containers: Docker and Docker Compose

- Container orchestration: Kubernetes (Docker Desktop)

- CI: GitHub Actions

- Infrastructure as Code: Terraform

- Cloud: AWS EC2, ECR, IAM, and SSM Parameter Store



## Run Locally



1. Create `backend/.env` with your MongoDB Atlas URI and port.

2. Start the application:



```powershell

docker compose -f docker\docker-compose.yml up --build -d

```



3. Open `http://localhost:5173`.



Stop it with:



```powershell

docker compose -f docker\docker-compose.yml down

```



## Kubernetes



Local Kubernetes manifests are in the `kubernetes/` directory.



```powershell

kubectl apply -f kubernetes\

kubectl get deployments,services,pods

```



## Continuous Integration



The workflow in `.github/workflows/ci.yml` runs on every push and pull request to `main`.



It installs dependencies, lints the frontend, builds the frontend, and builds both Docker images.



## AWS Deployment



Terraform provisions the following resources in `ap-south-1`:



- Amazon ECR repositories for frontend and backend images

- Amazon Linux EC2 instance

- Public security group allowing HTTP on port 80

- IAM role and instance profile

- Read-only ECR access

- Secure access to the MongoDB URI in Parameter Store

- Encrypted EBS storage



Terraform commands:



```powershell

terraform -chdir=terraform init

terraform -chdir=terraform validate

terraform -chdir=terraform plan

terraform -chdir=terraform apply

```



## Secrets Management



The MongoDB connection URI is securely stored in AWS Systems Manager Parameter Store:



```text

/cloud-native-task-manager/mongo-uri

```



The URI is not stored in Git or Terraform source code. The EC2 instance reads it securely when it starts.



## Cost Safety



When you no longer need the live AWS deployment, remove the Terraform-managed resources:



```powershell

terraform -chdir=terraform destroy

```



Review the plan carefully before entering `yes`.



## Author



Krushna



