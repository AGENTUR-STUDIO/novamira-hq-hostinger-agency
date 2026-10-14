# Limitations and next updates

This is a proposed handoff plan, not a commitment by Novamira or an automatically
scheduled maintenance task.

## Delivered on 2026-10-14

- Agency inventory mapping, pagination and exact namespaced lookups.
- Guard against passing Agency IDs into classic hosting operations.
- Dashboard URL-connection routing for Agency environments.
- Capability descriptions that state the classic-only installation limitation.
- Offline regression coverage and an isolated implementation commit/mail patch.
- English support message, integration instructions and macOS signing diagnosis.

## Next: official signed inventory release

Review and integrate the implementation commit; agree on classic-only API-error
handling and confirm Hostinger response mappings. Build with the official release
pipeline. Verify both Agency listing and repeated Keychain access before shipping.
This is the shortest path to keeping the working inventory while removing the
development-build helper prompts in normal use.

## Separate workstream: automatic Agency provisioning

Hostinger's documented Agency upload-URL endpoint is a candidate, not a complete
installer. Before implementation, establish the supported mechanism with
Hostinger and Novamira for:

1. Verifying the exact website UID, HTTPS origin, WordPress installation/root and
   runtime requirements without guessing classic account IDs.
2. Detecting existing Novamira files/version/activation state and preserving them.
3. Downloading and validating the official archive using the existing bounded,
   trusted-download path.
4. Uploading only the required files to a verified destination, with bounded
   transfers and no leakage of temporary upload credentials.
5. Activating the plugin through a supported mechanism. If a temporary installer
   is necessary, define explicit approval, execution, expiration and cleanup.
6. Enabling AI Abilities only with the owner's explicit consent and retaining
   WordPress authentication inside the site CLI integration.
7. Verifying readiness, recovery after partial failure, and absence of leftover
   executable installers or unexpected overwrites.
8. Adding offline contracts and running an explicitly authorized live acceptance
   against a dedicated test site before enabling the feature in production.

Do not substitute the Agency website archive-import endpoint: Hostinger documents
that it overwrites website contents. It is not equivalent to plugin installation.

## Later improvements

- Per-environment capability reporting, so mixed classic/Agency profiles expose
  accurate operation availability consistently in CLI, MCP and dashboard.
- Explicit handling of Builder/non-WordPress platforms, with connection controls
  based on verified applicability rather than presence in a hosting inventory.
- Optional direct Agency detail lookup if the documented API provides a stable
  endpoint; the current implementation resolves exact IDs from the inventory.
- Live compatibility coverage across multiple plan/account configurations.

## Updating this repository

Keep subsequent fixes in separate commits with tests and a dated validation note.
Preserve the immutable baseline and original implementation patch for review.
Do not mix vendor release/signing configuration or customer-specific configuration
into the implementation patch. After upstream integration, link the official
release and document how users can return to the signed distribution.
