/**
 * Tracks whether the client app has already mounted a page in this tab.
 *
 * The home page uses it to tell a first, hard load (run the full intro) apart
 * from a client-side arrival from another page (show the page straight away).
 * A module flag survives client-side navigation but resets on a real reload.
 */
let siteBooted = false;

export function markSiteBooted() {
  siteBooted = true;
}

export function hasSiteBooted() {
  return siteBooted;
}
