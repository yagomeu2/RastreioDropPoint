export function generateTrackingCode(suffix: 'F' | 'T' | 'M'): string {
  const digits = Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, '0');
  return `BR${digits}${suffix}`;
}

export function validateTrackingCode(code: string): boolean {
  const regex = /^BR\d{12}[FTM]$/;
  return regex.test(code);
}
