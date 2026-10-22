# TrustVault - Snovasys Hiring Challenge 2026

**Live URL:** To be deployed today - https://trustvault-adi.onrender.com
**Demo Video:** To be added (YouTube 5 min)

## The Problem
Companies share salary slips, contracts. Two failures: 1) Wrong person reads file due to folder access 2) No proof who accessed file when leak happens.

## The Solution
- Per-document ACL (read/edit) - no folder inheritance
- Files stored in private storage, never served directly. API streams file only after live DB permission check.
- JWT only for identity, expiry 5 min. Revocation is immediate.
- Audit logs are append-only and tamper-proof.

## Test Accounts (Seed Data)
- Admin: admin@trustvault.com / Admin@123 - Can view audit logs, manage users
- Owner: owner@trustvault.com / Owner@123 - Can upload, grant, revoke
- Viewer: viewer@trustvault.com / Viewer@123 - Can only read if granted

## How to Run
Backend: cd backend && npm install && npm run dev
Frontend: cd frontend && npm install && npm start
DB: PostgreSQL - connection in .env
Seed: npm run seed

## Security Notes
See THREATS.md for 12 threats and PROMPTS.md for AI usage log.
