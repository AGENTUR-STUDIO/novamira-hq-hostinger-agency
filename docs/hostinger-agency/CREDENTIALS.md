# macOS: why “Allow once” repeats

## Confirmed source-level cause

`native/macos/keychain.swift` has two distinct authorization layers:

1. The helper authenticates its **live parent process** using macOS Code Signing.
   `trustedParent()` requires the `ai.novamira.hq.desktop` identifier and a valid
   Developer ID signature from the same team as the helper. An untrusted parent
   reaches an application-owned dialog containing **Deny / Allow once**.
2. The helper accesses the Keychain item. macOS may independently present a
   Keychain prompt with **Always Allow**. That ACL decision concerns the helper;
   it does not bypass the parent-process check in step 1.

The inspected official beta6 executable carries a Developer ID signature from
Ovation S.r.l. The local inventory-fix executable is ad-hoc signed and has no team
identifier. The source explicitly grants unverified callers one operation only.
This explains why reconnecting Hostinger or choosing macOS “Always Allow” cannot
make this local build silently trusted by the existing helper.

## Requested supported outcome

Integrate the inventory/UI change into an official signed app, or provide an
official signed test build with the app and helper signed by the same authorized
Developer ID team. After the user's normal Keychain authorization, trusted HQ
operations should not show the helper's **Allow once** dialog.

This is an expected consequence of the existing code-signing policy, not a live
validation of a newly signed build. Keychain lock state, OS policies, revoked or
changed signatures, credential changes and ACL changes can still legitimately
cause future OS prompts. “Approved once for normal use” cannot promise that macOS
will never ask again under any circumstances.

## What this contribution does not change

- No unconditional `trustedParent()` result.
- No trust based only on an app path, executable name, request flag or environment
  variable.
- No blanket permission for Node, Deno, Terminal or arbitrary scripts.
- No permanent development-caller allowlist.
- No export of the Hostinger token into a file, URL, command line, log or repo.
- No weakening of Keychain ACLs or disabling of Gatekeeper.

The local machine has no usable Developer ID code-signing identity. We cannot
produce a vendor-trusted build ourselves; Novamira must perform the official
signing/release step. Shipping the unchanged helper beside an ad-hoc signed app
does not solve this.

## Signed-build acceptance scenario for Novamira

1. Sign the app and helper using the supported matching-team release process.
2. Verify signature validity, expected identifiers, notarization and the actual
   live parent relationship used by both the desktop and MCP launch paths.
3. Store/connect a test Hostinger credential through the normal UI. Let the owner
   authorize Keychain access if macOS requests it.
4. Refresh the inventory repeatedly; perform repeated read-only MCP site queries.
5. Quit/relaunch HQ and repeat. Test the upgrade from the prior official build.
6. Confirm no helper-level “Allow once” prompt appears for the verified HQ parent.
7. Confirm unverified Node/development callers still require per-operation
   approval, and denial prevents the Keychain read.

The existing `test/macos-keychain-contract.test.mjs` remains unchanged. There is
no security bypass in the Agency patch.
