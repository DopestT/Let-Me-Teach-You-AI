export type BrevoSubscribeOutcome =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; reason: "upstream_error" };

type BrevoSubscribeArgs = {
  apiKey: string;
  listId: string;
  email: string;
  firstName?: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
};

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

export function isValidBrevoListId(listId: string | undefined): boolean {
  if (!listId) return false;
  const normalized = listId.trim();
  if (!/^[1-9]\d*$/.test(normalized)) return false;
  const numericListId = Number(normalized);
  return Number.isSafeInteger(numericListId) && numericListId > 0;
}

export async function subscribeToBrevo({
  apiKey,
  listId,
  email,
  firstName,
  signal,
  fetchImpl = fetch,
}: BrevoSubscribeArgs): Promise<BrevoSubscribeOutcome> {
  if (!isValidBrevoListId(listId)) {
    return { ok: false, reason: "upstream_error" };
  }

  const numericListId = Number(listId.trim());
  const response = await fetchImpl(BREVO_CONTACTS_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal,
    body: JSON.stringify({
      email,
      listIds: [numericListId],
      updateEnabled: true,
      ...(firstName ? { attributes: { FIRSTNAME: firstName } } : {}),
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: "upstream_error" };
  }

  // Brevo returns 201 when a contact is created and 204 when an existing
  // contact is updated with updateEnabled=true.
  return { ok: true, alreadySubscribed: response.status === 204 };
}
