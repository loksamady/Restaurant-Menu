export function formatLocalDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${day}-${month}-${year}`;
}

export function isExpired(dateTimeString: string) {
  const today = new Date();
  const expiredDate = new Date(dateTimeString);

  today.setHours(0, 0, 0, 0);
  expiredDate.setHours(0, 0, 0, 0);

  return expiredDate <= today;
}

export function isNearlyExpired(dateTimeString: string) {
  const today = new Date();
  const expiredDate = new Date(dateTimeString);
  today.setHours(0, 0, 0, 0);
  expiredDate.setHours(0, 0, 0, 0);

  // 1 months from expiredDate
  const threeMonthsBeforeExpiry = new Date(expiredDate);
  threeMonthsBeforeExpiry.setMonth(expiredDate.getMonth() - 1);

  return today >= threeMonthsBeforeExpiry && today < expiredDate;
}

export function getDaysUntilExpiry(dateTimeString: string): number {
  const today = new Date();
  const expiredDate = new Date(dateTimeString);

  // Clear time for accurate day diff
  today.setHours(0, 0, 0, 0);
  expiredDate.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = expiredDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / msPerDay);

  return diffDays;
}
