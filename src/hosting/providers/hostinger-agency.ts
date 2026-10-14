// SPDX-FileCopyrightText: 2026 Ovation S.r.l. <dev@novamira.ai>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CliError } from "../../errors.js";
import { asRecord } from "../../json.js";
import type { HttpClient } from "../http-client.js";
import type { HostingSite } from "../types.js";

export const AGENCY_PREFIX = "agency:";

function invalid(message: string): never {
  throw new CliError(
    "provider_error",
    `Hostinger Agency inventory: ${message}`,
  );
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function domainOf(value: unknown): string {
  const record = asRecord(value);
  const candidate = text(record?.fqdn) || text(record?.domain) || text(value);
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]+$/i.test(candidate)
    ? candidate
    : "";
}

function siteOf(value: unknown, includeEnvironments: boolean): HostingSite {
  const item = asRecord(value);
  const details = asRecord(item?.details);
  const id = text(item?.id);
  if (!item || !details || !id || !text(item.platform) || !text(item.state))
    invalid("invalid website record; listing is incomplete.");
  const domains = Array.isArray(details.domains) ? details.domains : [];
  const domain =
    domains.map(domainOf).find(Boolean) ??
    (domainOf(details.vhost) || domainOf(details.preview_domain));
  const identity = `${AGENCY_PREFIX}${id}`;
  const name = domain || text(details.title) || text(details.description) || id;
  return {
    id: identity,
    name,
    displayName: `${name} (Agency ${text(item.platform)})`,
    status: text(item.state),
    ...(domain ? { primaryDomain: domain } : {}),
    ...(includeEnvironments
      ? {
          environments: [
            {
              id: identity,
              name: "live",
              displayName: "Live (Agency; connect WordPress by URL)",
              isBlocked: item.state !== "active",
              isPremium: false,
              ...(domain ? { primaryDomain: domain } : {}),
            },
          ],
        }
      : {}),
  };
}

/** Agency plans have a separate API and must never use classic hosting writes. */
export async function listAgencySites(
  http: HttpClient,
  includeEnvironments: boolean,
): Promise<HostingSite[]> {
  const sites: HostingSite[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= 2500; page++) {
    const response = asRecord(
      await http.json({
        path: `${http.baseUrl.replace(/\/$/, "")}/api/agency-hosting/v1/websites`,
        query: [
          ["page", String(page)],
          ["per_page", "50"],
        ],
      }),
    );
    const meta = asRecord(response?.meta);
    if (
      !response ||
      !Array.isArray(response.data) ||
      meta?.current_page !== page ||
      !Number.isInteger(meta.per_page) ||
      Number(meta.per_page) < 1 ||
      !Number.isInteger(meta.total) ||
      Number(meta.total) < 0
    )
      invalid("invalid response or pagination; listing is incomplete.");
    for (const row of response.data) {
      const site = siteOf(row, includeEnvironments);
      if (seen.has(site.id)) invalid("duplicate website ID across pages.");
      seen.add(site.id);
      sites.push(site);
    }
    if (page * Number(meta.per_page) >= Number(meta.total)) return sites;
    if (response.data.length === 0) invalid("empty page before the end.");
  }
  return invalid("pagination limit exceeded; listing is incomplete.");
}

export async function getAgencySite(
  http: HttpClient,
  id: string,
): Promise<HostingSite> {
  const site = (await listAgencySites(http, true)).find(
    (item) => item.id === id,
  );
  if (!site)
    throw new CliError(
      "not_found",
      `Hostinger Agency website "${id}" was not found.`,
    );
  return site;
}

export function rejectAgencyOperation(request: object): void {
  for (const key of ["envId", "siteId"] as const) {
    if (
      key in request &&
      String(request[key as keyof typeof request]).startsWith(AGENCY_PREFIX)
    )
      throw new CliError(
        "provider_unsupported",
        "Hostinger Agency hosting operations are not implemented. Install and activate Novamira in WordPress, then connect the site by URL. Classic hosting operations cannot be used for this target.",
      );
  }
}
