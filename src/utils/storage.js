const STORAGE_KEY = 'hirehub_submissions';

const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Support'
];

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

function safeReadSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('Corrupted storage: expected array, resetting.');
      reset();
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Corrupted storage data, resetting:', e);
    reset();
    return [];
  }
}

function safeWriteSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return true;
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
    return false;
  }
}

function validateSubmission(input, existingSubmissions, excludeId) {
  if (!input.fullName || typeof input.fullName !== 'string' || !input.fullName.trim()) {
    return 'Full name is required.';
  }
  if (input.fullName.trim().length > 100) {
    return 'Full name must be 100 characters or less.';
  }
  if (!/^[A-Za-z\s]+$/.test(input.fullName.trim())) {
    return 'Full name must contain only alphabets and spaces.';
  }

  if (!input.email || typeof input.email !== 'string' || !input.email.trim()) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email.trim())) {
    return 'Please enter a valid email address.';
  }

  const emailLower = input.email.trim().toLowerCase();
  const duplicate = existingSubmissions.find(
    (s) => s.email.toLowerCase() === emailLower && s.id !== excludeId
  );
  if (duplicate) {
    return `Duplicate email: ${input.email.trim()}`;
  }

  if (!input.mobile || typeof input.mobile !== 'string' || !input.mobile.trim()) {
    return 'Mobile number is required.';
  }
  if (!/^\d{10}$/.test(input.mobile.trim())) {
    return 'Mobile number must be exactly 10 digits.';
  }

  if (!input.department || typeof input.department !== 'string' || !input.department.trim()) {
    return 'Department is required.';
  }
  if (!ALLOWED_DEPARTMENTS.includes(input.department.trim())) {
    return 'Please select a valid department.';
  }

  return null;
}

export function getAll() {
  const submissions = safeReadSubmissions();
  return [...submissions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function add(input) {
  const submissions = safeReadSubmissions();

  const error = validateSubmission(input, submissions, null);
  if (error) {
    return { success: false, error };
  }

  const now = new Date().toISOString();
  const newSubmission = {
    id: generateId(),
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    mobile: input.mobile.trim(),
    department: input.department.trim(),
    createdAt: now,
    updatedAt: now
  };

  submissions.push(newSubmission);

  if (!safeWriteSubmissions(submissions)) {
    return { success: false, error: 'Failed to save submission. Please try again.' };
  }

  return { success: true };
}

export function edit(id, updates) {
  const submissions = safeReadSubmissions();

  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    return { success: false, error: 'Submission not found.' };
  }

  const error = validateSubmission(updates, submissions, id);
  if (error) {
    return { success: false, error };
  }

  submissions[index] = {
    ...submissions[index],
    fullName: updates.fullName.trim(),
    email: updates.email.trim(),
    mobile: updates.mobile.trim(),
    department: updates.department.trim(),
    updatedAt: new Date().toISOString()
  };

  if (!safeWriteSubmissions(submissions)) {
    return { success: false, error: 'Failed to save changes. Please try again.' };
  }

  return { success: true };
}

export function deleteSubmission(id) {
  const submissions = safeReadSubmissions();

  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    return { success: false, error: 'Submission not found.' };
  }

  submissions.splice(index, 1);

  if (!safeWriteSubmissions(submissions)) {
    return { success: false, error: 'Failed to delete submission. Please try again.' };
  }

  return { success: true };
}

export function findByEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }
  const submissions = safeReadSubmissions();
  const emailLower = email.trim().toLowerCase();
  return submissions.find((s) => s.email.toLowerCase() === emailLower) || null;
}

export function reset() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
}

export const SubmissionStore = {
  getAll,
  add,
  edit,
  delete: deleteSubmission,
  findByEmail,
  reset
};