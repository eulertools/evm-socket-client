# evm-socket-client

Standalone EVM WebSocket client: subscribe to new heads, format blocks/txs, push to Kinesis/SQS. Archived snapshot, as-is.

This tree is a **new public commit** with no git history. The original private archive is `eulertools/evm-socket-client-archive`.

## What was built (EN)

Node service (`services/`) plus a CDK GitHub → ECR pipeline. Chain id, websocket URL, topics, and Sentry DSN come from the environment. GitHub OAuth for CodePipeline is `SecretValue.secretsManager('githubToken')`. No recorded contract deployments.

A later copy of this service also lives under `websocket-clients`.

## Qué se construyó (ES)

Cliente WebSocket EVM y pipeline CDK. Sin deployments de contratos.

---

## Notice / Aviso

**Euler Tools ha cerrado. Euler Tools is closed.**

La empresa quebró. Este repositorio está archivado y no se mantiene. El software se ofrece tal cual (as is), sin garantía ni soporte. Parte del material puede ser reclamado por acreedores.

The company went bankrupt. This repository is archived and unmaintained. Software is provided as is, with no warranty and no support. Some material may be claimed by creditors.

Site: https://euler.tools  
Org: https://github.com/eulertools  
Enquiries: https://sinequix.com · https://github.com/tebayoso
