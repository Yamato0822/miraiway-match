import { describe, it, expect } from 'vitest';
import { computeMatchCompass } from './matchCompass';
import { candidates } from '../data/candidates';
import { jobs } from '../data/jobs';

describe('Match Compass Logic', () => {
  it('should compute match summary for candidate and job', () => {
    const candidate = candidates[0]; // Saminda: Construction, Tokyo, 1 month, dorm
    const job = jobs[0]; // Sunrise Construction: Construction, Tokyo, 1 month, dorm

    const summary = computeMatchCompass(candidate, job);
    expect(summary.matched.length).toBeGreaterThan(0);
    expect(summary.matched.some((m) => m.field === 'field')).toBe(true);
    expect(summary.matched.some((m) => m.field === 'location')).toBe(true);
  });

  it('should flag mismatched fields without hiding candidate', () => {
    const candidate = candidates[1]; // Anusha: Nursing, Osaka
    const job = jobs[0]; // Sunrise Construction: Construction, Tokyo

    const summary = computeMatchCompass(candidate, job);
    expect(summary.notMatched.some((m) => m.field === 'field')).toBe(true);
  });
});
