import { getAll } from './storage.js';

export function getSummaryStats(submissions) {
  const data = submissions !== undefined ? submissions : getAll();

  const totalSubmissions = data.length;

  const departments = new Set();
  data.forEach((s) => {
    if (s.department && typeof s.department === 'string' && s.department.trim()) {
      departments.add(s.department.trim());
    }
  });
  const uniqueDepartments = departments.size;

  let latestSubmissionDate = null;
  if (data.length > 0) {
    let latest = null;
    data.forEach((s) => {
      if (s.createdAt) {
        const d = new Date(s.createdAt);
        if (!isNaN(d.getTime()) && (latest === null || d > latest)) {
          latest = d;
        }
      }
    });
    if (latest !== null) {
      latestSubmissionDate = latest.toISOString();
    }
  }

  return {
    totalSubmissions,
    uniqueDepartments,
    latestSubmissionDate
  };
}

export const StatCalculator = {
  getSummaryStats
};