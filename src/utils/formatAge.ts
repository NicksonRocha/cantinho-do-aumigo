
export function formatAge(ageMonths: number) {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} ano(s) e ${months} mês(es)`;
  }
  if (years > 0) {
    return `${years} ano(s)`;
  }
  return `${months} mês(es)`;
}
