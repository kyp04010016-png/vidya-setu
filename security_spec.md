# Security Specification (Phase 0: Payload-First Security TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: Every path not explicitly matched is denied for read and write.
2. **PII Split Collection Isolation**: `/users/{userId}` stores only public metadata (`name`, `role`, `isActive`, `emailVerified`, `phoneVerified`, `createdAt`). Sensitive PII (`email`, `mobile`) is strictly isolated in `/users/{userId}/private/{docId}` and readable ONLY by the document owner (`request.auth.uid == userId`) or a verified Admin (`isAdmin()`).
3. **Self-Assigned Privilege Prevention**: Users creating their own `/users/{userId}` document can only select `"STUDENT"` or `"TUTOR"` as their initial `role` (unless `isAdmin()` is true), and cannot change `role` during non-admin updates.
4. **Strict Server Timestamps**: Every `createdAt` field on creation MUST equal `request.time`. Every `createdAt` and owner ID (`uid` / `userId`) is immutable on update.
5. **Query Enforcer on Lists**: No blanket `allow list: if isSignedIn();` on private collections (`/inquiries`, `/backups`). Every `allow list` checks `resource.data` against `request.auth.uid` or `isAdmin()`.
6. **Terminal State Locking**: Once an `Inquiry` or `TuitionRequirement` reaches `status == 'CLOSED'`, non-admin users cannot mutate it further.
7. **Bounded Arrays & String Lengths**: Every string field enforces `.size() >= min && .size() <= max` matching `firebase-blueprint.json`. Arrays (`courses`, `subjects`) enforce `.size() >= 1 && .size() <= 10` and validate element type.

## 2. The "Dirty Dozen" Payloads (Designed to Break Identity, Integrity, and State)
1. **Payload 1 (Privilege Escalation)**: User creates `/users/user_1` with `role: "ADMIN"`. -> `PERMISSION_DENIED`
2. **Payload 2 (Shadow Field Injection)**: User creates `/tutors/tutor_1` with extra ghost field `isSuperVerified: true`. -> `PERMISSION_DENIED`
3. **Payload 3 (Unverified Email Spoof)**: User with `email: "kyp04010016@gmail.com"` but `email_verified: false` attempts admin write on `/backups/b1`. -> `PERMISSION_DENIED`
4. **Payload 4 (PII Cross-Read Leak)**: Authenticated user `user_2` attempts `get` on `/users/user_1/private/info`. -> `PERMISSION_DENIED`
5. **Payload 5 (Identity Spoofing on Inquiry)**: Authenticated user `user_1` creates `/inquiries/inq_1` with `userId: "user_999"`. -> `PERMISSION_DENIED`
6. **Payload 6 (Client Timestamp Forgery)**: User creates `/reviews/rev_1` with `createdAt: timestamp.value(0)` instead of `request.time`. -> `PERMISSION_DENIED`
7. **Payload 7 (ID Poisoning Attack)**: Attacker creates `/tutors/invalid$id!@#` or 500-char ID. -> `PERMISSION_DENIED`
8. **Payload 8 (Denial-of-Wallet Unbounded Array)**: Tutor creates `/tutors/tutor_1` with 50 items in `subjects`. -> `PERMISSION_DENIED`
9. **Payload 9 (Terminal State Unlocking)**: User updates `/requirements/req_1` when `existing().status == "CLOSED"`. -> `PERMISSION_DENIED`
10. **Payload 10 (Immutable Owner Mutation)**: Tutor updates `/tutors/tutor_1` changing `userId` to another UID. -> `PERMISSION_DENIED`
11. **Payload 11 (Value Poisoning on Update)**: Tutor updates allowed key `hourlyRate` with a string `"free"` instead of `int`. -> `PERMISSION_DENIED`
12. **Payload 12 (Unauthorized Inquiry Scraping)**: User `user_3` runs an unfiltered `list` query on `/inquiries` not belonging to them. -> `PERMISSION_DENIED`
