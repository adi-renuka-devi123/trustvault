# TrustVault - What I Fixed

I checked the given codebase and found some security issues.

### 1. Direct URL problem (T1 & T3)
Before, private_storage folder was public with express.static. Anyone could guess url like /private_storage/doc.pdf and download.
What I did: I removed that static line in index.js. Now all docs need token via /api/documents/:id/preview.

### 2. No watermark (T2)
If someone takes screenshot, we dont know who leaked.
What I did: Added watermark with user email + date in preview API. So if leaked we can trace.

### 3. No logging (T4)
No record who saw which doc.
What I did: Added console.log with user email, doc id and time. In real project this will go to DB.

### 4. Share link never expires (T5)
Old link was working forever, anyone can forward.
What I did: Created one-time token link which expires in 1 hour and after first view it becomes invalid. Used crypto.randomBytes for token.

I tested with postman - without token it gives 401 error.

- Adi
