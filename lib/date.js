export function monthNameFromKey(monthKey) {
  const [year, month] = monthKey.split('-');
  return `${new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`;
}

export function monthNumberToName(num) {
  return new Date(2020, num - 1).toLocaleString('default', { month: 'long' });
}
