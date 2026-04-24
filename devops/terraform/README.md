# Terraform

_Infrastructure-as-code for all cloud resources._

## What Goes Here

- `modules/` — reusable Terraform modules (database, cache, cdn, secrets)
- `environments/` — per-environment root modules (`dev/`, `staging/`, `prod/`)
- `variables.tf`, `outputs.tf`, `versions.tf` at each environment root

## Conventions

- Remote state in S3/GCS with state locking via DynamoDB/GCS lock
- Sensitive variables injected via CI secrets — never committed
- `terraform plan` output reviewed in PR before `apply`

## Getting Started

```bash
cd environments/dev
terraform init
terraform plan
```
