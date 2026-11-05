data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

data "aws_ssm_parameter" "amazon_linux_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_security_group" "task_manager" {
  name        = "cloud-native-task-manager-web"
  description = "Allow public HTTP access to Cloud Native Task Manager"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "cloud-native-task-manager-web"
    Project   = "cloud-native-task-manager"
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role" "task_manager_ec2" {
  name = "cloud-native-task-manager-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.task_manager_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  role       = aws_iam_role.task_manager_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy" "read_mongo_uri" {
  name = "read-cloud-native-task-manager-mongo-uri"
  role = aws_iam_role.task_manager_ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ssm:GetParameter"]
        Resource = "arn:aws:ssm:ap-south-1:${data.aws_caller_identity.current.account_id}:parameter/cloud-native-task-manager/mongo-uri"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "task_manager_ec2" {
  name = "cloud-native-task-manager-ec2-profile"
  role = aws_iam_role.task_manager_ec2.name
}

resource "aws_instance" "task_manager" {
  ami                         = data.aws_ssm_parameter.amazon_linux_ami.value
  instance_type               = "t3.micro"
  subnet_id                   = tolist(data.aws_subnets.default.ids)[0]
  vpc_security_group_ids      = [aws_security_group.task_manager.id]
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.task_manager_ec2.name

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    account_id           = data.aws_caller_identity.current.account_id
    region               = "ap-south-1"
    mongo_parameter_name = "/cloud-native-task-manager/mongo-uri"
  })

  user_data_replace_on_change = true

  depends_on = [
    aws_iam_role_policy_attachment.ecr_read_only,
    aws_iam_role_policy.read_mongo_uri
  ]

  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    encrypted   = true
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name      = "cloud-native-task-manager"
    Project   = "cloud-native-task-manager"
    ManagedBy = "terraform"
  }
}

output "ec2_public_ip" {
  description = "Public IP address of the Task Manager server"
  value       = aws_instance.task_manager.public_ip
}