export function displayPhoneNumber(phoneNumber: string | null) {
  if (phoneNumber == null) return "";

  if (!/^\d{11,}$/.test(phoneNumber)) return phoneNumber; // basic validation

  const country = phoneNumber.slice(0, 3); // "855"
  const area = phoneNumber.slice(3, 5); // "11"
  const part1 = phoneNumber.slice(5, 8); // "234"
  const part2 = phoneNumber.slice(8); // "567"

  return `(${country}) ${area} ${part1} ${part2}`;
}

export function formatPhoneToTelLink(phoneNumber: string) {
  if (!phoneNumber) return "";
  // Remove all characters except digits and +
  const tel = phoneNumber.replace(/[^+\d]/g, "");
  return `tel:${tel}`;
}
