// The site is a static export with no server of its own, so forms post to
// FormSubmit, which relays the message on. The first submission to a given
// address triggers a one-off confirmation mail there; until that link is
// clicked, FormSubmit delivers nothing.
export const FALLBACK_INBOX = "leorusgames@gmail.com";
export const FALLBACK_SOURCE = "Leorus Games";

// Everyone who receives every enquiry. The Aqua Games and Leorus Games sites
// carry the same list. FormSubmit relays to the single address in its
// endpoint, so the rest are copied in; the endpoint address is dropped from
// the copies so nobody receives a message twice. Only the endpoint address
// needs the one-off confirmation click; the copied ones just receive.
export const TEAM_INBOXES = [
  "io.aquagames@gmail.com",
  "leorusgames@gmail.com",
  "moaazafzal@gmail.com",
  "husainisadiq@gmail.com",
  "hamzaayoubofficial@gmail.com",
];

/**
 * Sends one form's fields to every team inbox. Throws when the relay does not
 * accept the message, so callers never show success for a lost enquiry.
 */
export async function relay({
  inbox,
  source,
  subject,
  fields,
}: {
  inbox: string;
  source: string;
  subject: string;
  fields: Record<string, FormDataEntryValue>;
}): Promise<void> {
  const copies = TEAM_INBOXES.filter((a) => a.toLowerCase() !== inbox.toLowerCase());
  // The same five inboxes get messages from both studio sites, so every
  // message says where it came from: first row of the email, and the exact
  // page it was sent from as the last.
  const data = {
    _subject: `[${source} website] ${subject}`,
    _cc: copies.join(","),
    _template: "table",
    _captcha: "false",
    "Received from": `${source} website`,
    ...fields,
    "Sent from page": window.location.href,
  };

  const res = await fetch(`https://formsubmit.co/ajax/${inbox}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Relay answered ${res.status}`);
}
