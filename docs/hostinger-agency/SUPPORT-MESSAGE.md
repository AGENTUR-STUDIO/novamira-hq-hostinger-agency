Subject: Hostinger Agency support — tested inventory patch, installation gap and repeated macOS credential prompts

Hi Novamira team,

We use Novamira HQ 1.0.0-beta6 with Hostinger Agency Startup Web Hosting. A valid
Hostinger API token initially returned no websites in HQ, although 23 websites
were visible in hPanel.

Following our investigation with Astra using high reasoning, we prepared a
public, reviewable source contribution:

https://github.com/AGENTUR-STUDIO/novamira-hq-hostinger-agency

**What enabled website listing**

The existing integration queried the classic `/api/hosting/v1/websites` endpoint.
Our local change additionally queries `GET /api/agency-hosting/v1/websites`, handles
pagination and maps the results to distinct `agency:<website_uid>` IDs. All 23
websites then appeared in the local HQ build. Classic username-scoped queries
remain classic-only. The repository includes the implementation and offline
regression tests.

**What enabled installation — and what did not**

The listing change does not implement Agency provisioning. Classic setup depends
on classic WordPress installation/account IDs, plugin inventory and file-upload
endpoints. We intentionally blocked Agency targets from entering those paths.
The resulting “not implemented” message came from our local guard, not from a
Hostinger API rejection.

On one affected WordPress site, uploading the official Novamira ZIP through
WordPress admin successfully installed and activated version 1.12.9. This was a
manual WordPress installation, not a successful Agency API installer. AI Abilities
and the subsequent HQ authorization are still awaiting the owner's approval.

The contribution also updates the Connect UI so Agency rows use the normal
site-CLI URL connection and do not offer unsupported classic provisioning.

**Potential next step for automatic installation**

Hostinger documents
`POST /api/agency-hosting/v1/websites/{website_uid}/files/upload-urls`, returning
credentials for TUS uploads. This is a plausible building block, but we have not
implemented or validated an Agency installer. Plugin detection, WordPress root
verification, activation, explicit AI Abilities consent, cleanup and failure
recovery still need an end-to-end supported design. We have deliberately not used
the website archive-import endpoint, whose documented semantics overwrite site
contents.

**The repeated “Allow once” prompts are a major usability problem**

Our local app is ad-hoc signed. Your unchanged macOS credential helper only
silently trusts a live HQ parent with the matching Developer ID team and expected
bundle identifier. Consequently, it asks for “Allow once” for each credential
operation. This is separate from macOS Keychain's “Always Allow” permission and
cannot be fixed just by saving the Hostinger token again.

We want credential access to remain approved during normal use after the initial
Keychain authorization, without approving every operation separately. Could you
integrate the inventory/UI patch into your next signed release, or provide an
officially signed test build? The contribution preserves the existing credential
security boundary; it does not add an “allow every process” exception or move
tokens into files. Please verify repeated refreshes and MCP calls in the signed
build, including after a restart and upgrade.

**Ready for your review**

The repository retains upstream history and AGPL licensing and provides a single
cherry-pickable implementation commit, a `git am` patch, tests, integration
instructions, known limitations and a follow-up plan. The local full check passed:
1,600 tests, 1,597 passed, 3 skipped, 0 failed. Public read access requires no
invitation; there are no credentials or customer domains in the contribution.
The independent Linux/Node 24 GitHub Actions review check also passed.

Could you confirm the intended Agency API support and review the patch for an
upcoming release? We would particularly appreciate guidance on the supported
Agency plugin installation/activation route and the signed-build credential UX.

Thank you,
AGENTUR.STUDIO
