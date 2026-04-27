---
section: overview
topic: vision
---

# Auth — Product Vision

## Problem

Employees and administrators need a secure, frictionless way to access the HRIS platform. Without a robust auth system, the platform cannot enforce data scoping, RBAC, or compliance requirements. Password resets and session management, if handled incorrectly, become a significant HR IT support burden.

## Vision

A multi-mode authentication system that lets employees sign in the way that suits them — password or OTP — with strong session guarantees, automatic token refresh, and a streamlined recovery flow. The auth experience should be invisible when working correctly and clear when something goes wrong.

## Success Metrics

- Login (password) completes in < 2s from submit to dashboard.
- OTP delivery rate > 99% within 30 seconds.
- Session silent refresh succeeds > 99.5% of the time without user interruption.
- Zero auth-related support tickets due to confusing error messages.
- Password reset flow completed in < 2 minutes end-to-end.
