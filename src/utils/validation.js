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

export function validateFullName(fullName) {
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return 'Full name is required.';
  }
  if (fullName.trim().length > 100) {
    return 'Full name must be 100 characters or less.';
  }
  if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
    return 'Full name must contain only alphabets and spaces.';
  }
  return null;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validateMobile(mobile) {
  if (!mobile || typeof mobile !== 'string' || !mobile.trim()) {
    return 'Mobile number is required.';
  }
  if (!/^\d{10}$/.test(mobile.trim())) {
    return 'Mobile number must be exactly 10 digits.';
  }
  return null;
}

export function validateDepartment(department) {
  if (!department || typeof department !== 'string' || !department.trim()) {
    return 'Department is required.';
  }
  if (!ALLOWED_DEPARTMENTS.includes(department.trim())) {
    return 'Please select a valid department.';
  }
  return null;
}

export function validateAll(input) {
  const errors = {};

  const fullNameError = validateFullName(input.fullName);
  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  const emailError = validateEmail(input.email);
  if (emailError) {
    errors.email = emailError;
  }

  const mobileError = validateMobile(input.mobile);
  if (mobileError) {
    errors.mobile = mobileError;
  }

  const departmentError = validateDepartment(input.department);
  if (departmentError) {
    errors.department = departmentError;
  }

  return errors;
}

export const FormValidator = {
  validateFullName,
  validateEmail,
  validateMobile,
  validateDepartment,
  validateAll
};