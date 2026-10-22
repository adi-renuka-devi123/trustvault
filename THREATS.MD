# THREATS.md - Security Threat Model

## T1 - IDOR - Insecure Direct Object Reference
Threat: User changes /documents/123/download to /124 and downloads other's file.
Mitigation: Every download/preview API checks HasAccess(userId, docId) from DB. No direct file path.
Test: Login as Viewer, try to guess Admin doc ID, should get 403 Forbidden.
Status: Fixed in code.

## T2 - Revoked Token Still Works
Threat: After owner revokes viewer, viewer still uses old JWT to download.
Mitigation: JWT contains only userId, no permissions. Permission checked live from DB on every request. JWT expiry 5 minutes.
Test: Grant -> Viewer downloads success -> Revoke -> Viewer downloads again -> 403.
Status: Fixed.

## T3 - Direct URL Bypass
Threat: User tries /private_storage/file.pdf directly bypassing API.
Mitigation: Files stored outside webroot, not served by static server. Only API stream can access.
Status: Fixed.

## T4 - Audit Log Tampering
Threat: Admin edits audit logs to hide leak.
Mitigation: Audit table is append-only. App DB user has no UPDATE/DELETE privilege. Hash chain links each log.
Status: Fixed.

## T5 - Admin Cannot Be Tracked
Threat: Admin downloads without log.
Mitigation: All actions including Admin's logged with userId, docId, action, timestamp, IP.
Status: Implemented.

## T6 - Brute Force Login
Threat: Attacker tries many passwords.
Mitigation: Rate limiting on login, account lock after 5 fails.
Status: To be implemented.

## T7-T12 - Will be added daily - Injection, XSS, CSRF, etc.
