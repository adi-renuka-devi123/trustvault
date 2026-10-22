# PROMPTS.md - AI Usage Log

## Entry 1 - 2026-10-22
Prompt: I asked AI to create document download endpoint
AI Produced: app.get('/documents/:id', (req,res)=>{ res.sendFile(file) })
What was wrong: No permission check! Any user can download any file - IDOR vulnerability, fails Requirement 1.
What I did instead: Added middleware checkPermission(userId, docId) that checks DB before streaming file.
Commit: https://github.com/adi-renuka-devi123/trustvault/commit/main

## Entry 2 - 2026-10-22
Prompt: Asked AI for audit log table design
AI Produced: Table with UPDATE and DELETE allowed for app
What was wrong: Audit logs can be edited, no evidence value, fails Requirement 2
What I did instead: Made table append-only, revoked UPDATE/DELETE for app user, added hash chain
Commit: Will link tomorrow

## More entries will be added daily
