# Integration guide

## Scope ready for review

Baseline: `68741369c9d75283c9b46d5ea6387159b84d5b00` (`v1.0.0-beta6`).

Implementation commit: `ebaaaca68fe2429ea2d2ab19b1194944556389fa`.

The commit includes only provider inventory/guards, capability descriptions,
Agency URL-connection routing, associated contracts and a short upstream README
section. Delivery documentation, patch export and review CI are separate commits
and do not need to be imported into upstream. No new runtime dependency, token
storage, helper protocol or signing policy is introduced.

From an upstream checkout on the branch you intend to change:

```sh
git fetch https://github.com/AGENTUR-STUDIO/novamira-hq-hostinger-agency.git main
git cherry-pick ebaaaca68fe2429ea2d2ab19b1194944556389fa
bun install --frozen-lockfile --ignore-scripts
bun run check
```

Alternatively, apply the exported mail patch from this repository:

```sh
git am /path/to/0001-hostinger-agency-inventory.patch
```

Use either cherry-pick or `git am`, not both. The patch was prepared against the
baseline above; later upstream changes may require conflict resolution and a new
test run. Importing the repository's whole `main` branch also imports handoff
documentation and CI, so cherry-picking the implementation is preferable.

## Changed behavior

- Unscoped Hostinger listing concatenates classic and Agency inventories.
- Explicit classic username scope is retained and does not request Agency data.
- Agency IDs are namespaced to avoid collision with classic domain IDs.
- Agency metadata exposes a single synthetic live environment; non-active state
  maps to blocked. It does not assert WordPress or plugin readiness.
- Agency API errors and malformed/paginated responses are surfaced explicitly.
- Agency site and environment lookup use exact namespaced identity.
- Generic Agency reads/actions fail with `provider_unsupported` before classic
  endpoints are called.
- Agency Connect omits the hosting setup context, retaining normal site-CLI
  authorization by URL. Classic Connect retains setup context.

## Review gates before shipping

1. Agree on the classic-only account policy if the separate Agency endpoint
   returns a permission or product-availability error. The current implementation
   deliberately fails the refresh rather than hiding missing inventory.
2. Validate the platform/domain mapping against Hostinger's supported schema,
   including custom domains, preview-only entries, aliases and non-WordPress sites.
3. Verify a mixed account, an Agency-only account, explicit classic scope and an
   account with more than 50 Agency websites using a sanctioned live test. No
   customer credential belongs in CI or fixtures.
4. Exercise the dashboard URL connection on an already-installed Novamira site.
   A UI regression test verifies routing; it is not a live OAuth completion test.
5. Build/package through your existing desktop release pipeline and run the
   platform artifact acceptance. Use the repository-pinned toolchain (Deno 2.9.6
   for the beta6 desktop build), not an older system Deno.
6. Sign and notarize the macOS app and credential helper through the official
   matching-team pipeline; verify the credential UX described in CREDENTIALS.md.

## Why this is not the complete automatic-installer fix

The Agency upload endpoint is documented, but a plugin installation API has not
been established by this investigation. Replacing `/hosting/` with
`/agency-hosting/` is insufficient: identifiers, verification, plugin detection
and activation are different. The existing classic installer checks those
conditions before modifying the site. Those checks must not be dropped merely
to make an Agency request succeed. See UPDATES.md for the separate implementation
workstream.
