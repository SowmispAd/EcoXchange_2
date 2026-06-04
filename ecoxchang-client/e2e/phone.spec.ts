import { test, expect } from '@playwright/test';
import { normalizePhoneNumber } from '../src/lib/phone';

test.describe('Phone Number Normalization Tests', () => {
  test('converts 10-digit Indian numbers with +91 prepended', () => {
    expect(normalizePhoneNumber('9876543210')).toBe('+919876543210');
  });

  test('normalizes spaces, dashes, brackets', () => {
    expect(normalizePhoneNumber('+91 98765-43210')).toBe('+919876543210');
    expect(normalizePhoneNumber('(98765)43210')).toBe('+919876543210');
  });

  test('converts 91XXXXXXXXXX to +91XXXXXXXXXX', () => {
    expect(normalizePhoneNumber('919876543210')).toBe('+919876543210');
  });

  test('handles general international format with +', () => {
    expect(normalizePhoneNumber('+1 555-555-5555')).toBe('+15555555555');
  });

  test('throws error for empty/null input', () => {
    expect(() => normalizePhoneNumber('')).toThrow();
  });

  test('throws error for invalid characters', () => {
    expect(() => normalizePhoneNumber('+919876abc210')).toThrow();
  });

  test('throws error for too short or too long numbers', () => {
    expect(() => normalizePhoneNumber('123')).toThrow();
    expect(() => normalizePhoneNumber('1234567890123456789')).toThrow();
  });
});
