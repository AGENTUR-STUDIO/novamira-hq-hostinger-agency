# Validation record

Date: 2026-10-14 (Europe/Vienna).

## Current implementation

For implementation commit `ebaaaca68fe2429ea2d2ab19b1194944556389fa`:

- `bun install --frozen-lockfile --ignore-scripts`: passed.
- `bun run check`: passed (ESLint, Prettier, TypeScript build, full contract suite).
- Tests: **1,600 total; 1,597 passed; 3 skipped; 0 failed** on the development Mac.
- `git diff --check`: passed before the implementation commit.
- Exported mail patch: `git am` on a clean baseline recreates the exact implementation tree.
- Publication scan of contributed files: no customer identifiers, local user paths or common credential markers detected. This is a focused scan, not a guarantee that arbitrary future additions are safe.

Focused coverage includes:

- Agency-only and mixed inventories, with classic/Agency identity separation.
- Agency pagination, duplicate pages/IDs and malformed metadata.
- Preview domains, Builder platform metadata and blocked site state.
- Exact Agency site lookup and synthetic environment lookup.
- Explicit failure when the Agency API rejects access.
- No classic read/action request for an Agency target.
- Agency Connect routes by URL without setup context; classic setup remains.

The source tests use controlled mocks/local loopback fixtures and do not contact
Hostinger or a customer site. Skipped tests are reported by the suite, not silently
counted as passes; source-only runs may skip the native helper probe when a
compiled helper is absent.

## Prior live observations (not CI)

The earlier inventory-only local build listed **23 websites** for one Agency
account, in both the desktop dashboard and a fresh MCP process. That earlier
desktop artifact passed its local artifact acceptance. Those results validate
that earlier artifact, not a new signed release of this contribution.

The official Novamira **1.12.9** ZIP was manually uploaded through WordPress admin
on one affected site and successfully installed and activated. The plugin's
configuration screen then showed AI Abilities disabled. Approval and the site's
HQ authorization were still outstanding. No completed live MCP connection is
claimed for that site.

Customer hostnames, website UIDs, account identifiers, screenshots of customer
admin pages and live provider payloads are intentionally omitted.

## Not established by these results

- Full Agency API plugin installation, activation or cleanup.
- Live pagination across more than 50 Agency websites.
- Every Hostinger product/account entitlement or future response schema.
- WordPress compatibility for every site returned by Agency inventory.
- Cross-platform signed packaging of this contribution.
- Removal of prompts in an official build carrying this patch; vendor signing and
  the acceptance scenario in CREDENTIALS.md remain necessary.

The independent Linux/Node 24 review check completed successfully for handoff
commit `785f048b12835cd8dfcd092a886d657bcb8139fa`:
[GitHub Actions run 38579324630](https://github.com/AGENTUR-STUDIO/novamira-hq-hostinger-agency/actions/runs/38579324630).
That commit contains the exact implementation above plus the initial handoff
documents and CI configuration. Later documentation-only updates do not change
the implementation commit. See the Actions tab for checks of subsequent heads.
