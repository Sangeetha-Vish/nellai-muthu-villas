# Production Checklist: Nella Muthu Villas

Follow this checklist before every production release to ensure stability, security, and performance.

## 🚀 Deployment Essentials
- [ ] **Environment**: Verify all secrets in `.env` match production values.
- [ ] **Migrations**: Run `npx prisma migrate deploy` to sync the database schema.
- [ ] **Build**: Ensure `npm run build` completes with zero errors.
- [ ] **Health**: Verify `/api/health` returns `200 OK` after deployment.

## 🛡️ Security Audit
- [ ] **Secrets**: Ensure no `.env` or sensitive files are staged in Git.
- [ ] **HTTPS**: Verify all assets load over HTTPS without mixed content.
- [ ] **Headers**: Use `securityheaders.com` (or script) to check CSP and HSTS.
- [ ] **Rate Limiting**: Validate that 429 errors trigger on rapid Auth/Order attempts.

## 📊 Monitoring & Alerts
- [ ] **Sentry**: Check the Sentry dashboard for any new production errors.
- [ ] **LogRocket**: Verify session replay is active and masking PII.
- [ ] **Logs**: Verify production logs are clean of sensitive data (passwords, JWTs).

## 💾 Database & Backups
- [ ] **Backups**: Ensure `scripts/db-backup.sh` is scheduled as a Daily Cron job.
- [ ] **Pooling**: Verify database connection pooling is active (Check lib/prisma.js).

## 📈 Performance
- [ ] **Load**: Run `node scripts/load-test.js` to ensure latency is within limits.
- [ ] **Caching**: Verify static assets have a `Cache-Control` header for CDN efficiency.

## ↩️ Rollback Plan
1. Re-deploy the last successful build artifact from the CI pipeline.
2. If schema change was destructive, restore database from the last night's backup (`backups/`).
3. Notify the team on Sentry/Monitoring alerts.
