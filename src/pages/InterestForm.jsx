import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateAll } from '../utils/validation.js';
import { add, findByEmail } from '../utils/storage.js';
import './InterestForm.css';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  mobile: '',
  department: ''
};

const DEPARTMENTS = [
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

export default function InterestForm() {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successDismissing, setSuccessDismissing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const successTimerRef = useRef(null);
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });
    setSubmitError('');
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSubmitError('');
      setSuccess(false);
      setSuccessDismissing(false);

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      const validationErrors = validateAll(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const existingSubmission = findByEmail(formData.email);
      if (existingSubmission) {
        setErrors({ email: `Duplicate email: ${formData.email.trim()}` });
        return;
      }

      setSubmitting(true);

      const result = add(formData);

      if (!result.success) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }

      setFormData({ ...INITIAL_FORM });
      setErrors({});
      setSuccess(true);
      setSuccessDismissing(false);
      setSubmitting(false);

      successTimerRef.current = setTimeout(() => {
        setSuccessDismissing(true);
        dismissTimerRef.current = setTimeout(() => {
          setSuccess(false);
          setSuccessDismissing(false);
        }, 300);
      }, 4000);
    },
    [formData]
  );

  return (
    <div className="interest-form-page">
      <div className="interest-form-container">
        <div className="interest-form-card">
          <div className="interest-form-header">
            <h1 className="interest-form-title">Express Your Interest</h1>
            <p className="interest-form-subtitle">
              Fill out the form below to let us know you're interested in joining our team.
            </p>
          </div>

          {success && (
            <div
              className={`interest-form-success${successDismissing ? ' interest-form-success-dismiss' : ''}`}
            >
              Your interest has been submitted successfully!
            </div>
          )}

          {submitError && (
            <div className="interest-form-error-banner">{submitError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="interest-form-group">
              <label htmlFor="fullName" className="interest-form-label">
                Full Name<span className="interest-form-label-required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`interest-form-input${errors.fullName ? ' interest-form-input-error' : ''}`}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.fullName && (
                <span className="interest-form-field-error">{errors.fullName}</span>
              )}
            </div>

            <div className="interest-form-group">
              <label htmlFor="email" className="interest-form-label">
                Email<span className="interest-form-label-required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`interest-form-input${errors.email ? ' interest-form-input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && (
                <span className="interest-form-field-error">{errors.email}</span>
              )}
            </div>

            <div className="interest-form-group">
              <label htmlFor="mobile" className="interest-form-label">
                Mobile Number<span className="interest-form-label-required">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className={`interest-form-input${errors.mobile ? ' interest-form-input-error' : ''}`}
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
                autoComplete="tel"
              />
              {errors.mobile && (
                <span className="interest-form-field-error">{errors.mobile}</span>
              )}
            </div>

            <div className="interest-form-group">
              <label htmlFor="department" className="interest-form-label">
                Department<span className="interest-form-label-required">*</span>
              </label>
              <select
                id="department"
                name="department"
                className={`interest-form-select${errors.department ? ' interest-form-input-error' : ''}`}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className="interest-form-field-error">{errors.department}</span>
              )}
            </div>

            <button
              type="submit"
              className="interest-form-submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Interest'}
            </button>
          </form>

          <div className="interest-form-footer">
            <Link to="/" className="interest-form-back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}