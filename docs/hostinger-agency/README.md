# Hostinger Agency support handoff

Prepared for Novamira by AGENTUR.STUDIO, 2026-10-14.

This public repository is an **unofficial source contribution**, not an official
Novamira release or a fully implemented Agency provider. It contains the original
upstream source, one isolated implementation commit, offline tests, an applyable
mail patch, and this review package. No customer domains, provider responses,
credentials, local application bundles, or private configuration are included.

## Start here

- [English support message](SUPPORT-MESSAGE.md)
- [Integration instructions and exact commit](INTEGRATION.md)
- [macOS credential prompts and the signed-release solution](CREDENTIALS.md)
- [Validation and evidence boundaries](VALIDATION.md)
- [Limitations and proposed next updates](UPDATES.md)
- [Applyable implementation patch](../../patches/0001-hostinger-agency-inventory.patch)

## Reproduced problem

On Hostinger Agency Startup Web Hosting, a valid API token and 23 websites visible
in hPanel produced an empty HQ inventory. Upstream beta6 queried the classic
`/api/hosting/v1/websites` inventory. Adding the separate
`/api/agency-hosting/v1/websites` inventory made all 23 websites visible in the
local build. This observation does not establish a plan-wide guarantee or a
problem with token validity.

## Current support matrix

| Capability | Status | Evidence / boundary |
| --- | --- | --- |
| Classic website listing | Preserved | Existing contracts retained; explicit username remains classic-only |
| Agency website listing | Implemented | Pagination, validation, synthetic live environment, `agency:` identity |
| Mixed classic/Agency inventory | Implemented | Offline contract covers both, including the same domain in both inventories |
| Agency site lookup / environment listing | Implemented | Exact namespaced ID lookup; one synthetic environment |
| Agency Connect UI | Implemented in this contribution | Uses normal site-CLI URL authorization; does not offer classic provisioning |
| Novamira ZIP installation in WordPress admin | Successful on one live WordPress site | Official plugin 1.12.9 installed and activated manually; not an HQ API installation |
| AI Abilities and HQ authorization on that site | Pending user approval | Installation/activation does not establish a connected or healthy MCP session |
| Automatic Agency installation/activation via Hostinger API | Not implemented | Classic setup requires different installation/account identifiers and endpoints |
| Agency plugin inventory and other hosting operations | Not implemented | Agency targets fail before reaching classic read/action endpoints |
| Classic provider validation | Unchanged | Does not independently validate Agency access |
| Persistent credential approval for an ad-hoc macOS build | Not supported by upstream helper | Only the matching Developer ID-signed HQ parent receives silent helper authorization |

## Boundaries reviewers should assess

The unscoped listing calls both inventories. A failing Agency response fails the
refresh rather than being silently converted into zero websites. This avoids
misrepresenting an incomplete inventory, but means a classic-only account whose
Agency endpoint rejects access needs a defined upstream policy. No 401/403/404 is
currently swallowed. Explicit hosting usernames intentionally exclude Agency
sites, since a classic username is not an Agency UID.

The mapped platform/state/domain metadata is not a WordPress detection probe.
Builder or other non-WordPress sites may appear. A listing entry must not be
treated as proof that Novamira can be installed. The live observation covered one
account; pagination, mixed accounts and malformed responses are mock-tested.

## Sharing and reuse

The owner requested public visibility so Novamira can read, clone and reuse this
work without an invitation. Public visibility grants read access; it does not
grant Novamira write/admin access or any access to Hostinger. The upstream
AGPL-3.0-or-later license and notices are retained. No vendor signing key is
included or requested. The support message is a draft and has not been sent.

## Primary references

- [Upstream baseline](https://github.com/use-novamira/novamira-hq/tree/68741369c9d75283c9b46d5ea6387159b84d5b00)
- [Hostinger Agency websites API](https://github.com/hostinger/api-python-sdk/blob/main/docs/AgencyHostingWebsitesApi.md)
- [Hostinger Agency file uploads API](https://github.com/hostinger/api-python-sdk/blob/main/docs/AgencyHostingFilesApi.md)
- [Hostinger Agency WordPress API](https://github.com/hostinger/api-python-sdk/blob/main/docs/AgencyHostingWordPressApi.md)
- [Official plugin installation](https://novamira.ai/docs/getting-started/installation/)
