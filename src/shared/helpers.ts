import CryptoJS from 'crypto-js';

export function hashAnswer(answer: string): string {
  const norm = answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // remove invisible chars

  return CryptoJS.SHA256(norm).toString(CryptoJS.enc.Hex);
}
