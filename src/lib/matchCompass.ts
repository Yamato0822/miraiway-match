import type { Candidate, Job, MatchSummary, MatchResult } from '../types';

export function computeMatchCompass(
  candidate: Candidate,
  job: Job
): MatchSummary {
  const results: MatchResult[] = [];

  // Field match
  const fieldMatch = candidate.field === job.field;
  results.push({
    field: 'field',
    label: '分野',
    status: fieldMatch ? 'matched' : 'not_matched',
    detail: fieldMatch
      ? `${candidate.field}で一致`
      : `候補者: ${candidate.field} / 求人: ${job.field}`,
  });

  // Location match
  const locationMatch = candidate.desiredLocations.some(
    (loc) => job.location.includes(loc) || loc.includes(job.location)
  );
  results.push({
    field: 'location',
    label: '希望勤務地',
    status: locationMatch ? 'matched' : 'needs_check',
    detail: locationMatch
      ? `${job.location}で一致`
      : `候補者: ${candidate.desiredLocations.join('・')} / 求人: ${job.location}`,
  });

  // Start timing
  const timingOrder = ['1か月以内', '2か月以内', '3か月以内', '半年以内', '1年以内'];
  const candidateIdx = timingOrder.indexOf(candidate.startTiming);
  const jobIdx = timingOrder.indexOf(job.startTiming);
  const timingMatch =
    candidateIdx >= 0 && jobIdx >= 0 && candidateIdx <= jobIdx;
  results.push({
    field: 'startTiming',
    label: '入社時期',
    status: timingMatch ? 'matched' : 'needs_check',
    detail: timingMatch
      ? `${candidate.startTiming}で開始可能`
      : `候補者: ${candidate.startTiming} / 求人: ${job.startTiming}`,
  });

  // Dorm
  if (candidate.dormPreference) {
    results.push({
      field: 'dorm',
      label: '寮',
      status: job.dorm.available ? 'matched' : 'not_matched',
      detail: job.dorm.available
        ? `${job.dorm.type}の寮あり`
        : '寮なし（住居探しサポートあり）',
    });
  }

  // Salary
  const salaryMatch =
    candidate.desiredSalary >= job.salary.min &&
    candidate.desiredSalary <= job.salary.max;
  const salaryClose =
    !salaryMatch &&
    candidate.desiredSalary >= job.salary.min * 0.9 &&
    candidate.desiredSalary <= job.salary.max * 1.1;
  results.push({
    field: 'salary',
    label: '希望給与',
    status: salaryMatch ? 'matched' : salaryClose ? 'needs_check' : 'not_matched',
    detail: salaryMatch
      ? '範囲内'
      : `候補者: ${(candidate.desiredSalary / 10000).toFixed(0)}万円 / 求人: ${(job.salary.min / 10000).toFixed(0)}〜${(job.salary.max / 10000).toFixed(0)}万円`,
  });

  // Japanese level
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const candidateLevel = levels.indexOf(candidate.japaneseLevel);
  const reqLevel = levels.indexOf(
    job.japaneseRequirement.replace('以上', '')
  );
  const jpMatch = candidateLevel >= 0 && reqLevel >= 0 && candidateLevel >= reqLevel;
  const jpClose = candidateLevel >= 0 && reqLevel >= 0 && candidateLevel === reqLevel - 1;
  results.push({
    field: 'japanese',
    label: '日本語',
    status: jpMatch ? 'matched' : jpClose ? 'needs_check' : 'needs_check',
    detail: jpMatch
      ? `${candidate.japaneseLevel}（要件: ${job.japaneseRequirement}）`
      : `面接で確認（候補者: ${candidate.japaneseLevel} / 要件: ${job.japaneseRequirement}）`,
  });

  const matched = results.filter((r) => r.status === 'matched');
  const needsCheck = results.filter((r) => r.status === 'needs_check');
  const notMatched = results.filter((r) => r.status === 'not_matched');

  return { matched, needsCheck, notMatched };
}
