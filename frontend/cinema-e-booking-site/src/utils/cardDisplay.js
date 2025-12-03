// Helper to consistently format saved card labels across the app.
export function getCardDisplay(card = {}) {
  const rawNumber = card.cardNumber ?? "";
  const digitsOnly = String(rawNumber).replace(/[^\d]/g, "");
  const last4 =
    card.cardNumberLast4 ||
    (digitsOnly.length >= 4 ? digitsOnly.slice(-4) : "");

  const firstName = card.cardHolderFirstName || "";
  const lastName = card.cardHolderLastName || "";
  const name = `${firstName} ${lastName}`.trim() || "Cardholder";

  return {
    last4: last4 || "????",
    name,
    label: `•••• ${last4 || "????"} — ${name}`,
  };
}
