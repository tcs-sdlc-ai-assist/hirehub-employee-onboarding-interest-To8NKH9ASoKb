import { useState, useCallback, useEffect } from 'react';
import { getAll, edit, deleteSubmission } from '../utils/storage.js';
import { getSummaryStats } from '../utils/stats.js';
import { validateAll } from '../utils/validation.js';
import './AdminDashboard.css';

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

function getDeptBadgeClass(department) {
  if (!department) return '';
  const slug = department.toLowerCase().replace(/\s+/g, '-');
  return `admin-dashboard-dept-badge admin-dashboard-dept-badge-${slug}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '—';
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ totalSubmissions: 0, uniqueDepartments: 0, latestSubmissionDate: null });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit modal state
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', email: '', mobile: '', department: '' });
  const [editErrors, setEditErrors] = useState({});
  const [editSubmitError, setEditSubmitError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingSubmission, setDeletingSubmission] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const loadData = useCallback(() => {
    try {
      const data = getAll();
      setSubmissions(data);
      setStats(getSummaryStats(data));
    } catch (e) {
      console.error('Failed to load submissions:', e);
      setError('Failed to load submissions. Data may be corrupted.');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Clear success message after a timeout
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Edit handlers
  const handleEditClick = useCallback((submission) => {
    setEditingSubmission(submission);
    setEditFormData({
      fullName: submission.fullName,
      email: submission.email,
      mobile: submission.mobile,
      department: submission.department
    });
    setEditErrors({});
    setEditSubmitError('');
    setEditSubmitting(false);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditingSubmission(null);
    setEditFormData({ fullName: '', email: '', mobile: '', department: '' });
    setEditErrors({});
    setEditSubmitError('');
    setEditSubmitting(false);
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return prev;
    });
    setEditSubmitError('');
  }, []);

  const handleEditSave = useCallback((e) => {
    e.preventDefault();
    setEditSubmitError('');

    const validationErrors = validateAll(editFormData);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }

    setEditSubmitting(true);

    const result = edit(editingSubmission.id, editFormData);

    if (!result.success) {
      setEditSubmitError(result.error);
      setEditSubmitting(false);
      return;
    }

    setEditSubmitting(false);
    handleEditClose();
    setSuccessMessage('Submission updated successfully!');
    setError('');
    loadData();
  }, [editFormData, editingSubmission, handleEditClose, loadData]);

  // Delete handlers
  const handleDeleteClick = useCallback((submission) => {
    setDeletingSubmission(submission);
    setDeleteSubmitting(false);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeletingSubmission(null);
    setDeleteSubmitting(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingSubmission) return;

    setDeleteSubmitting(true);

    const result = deleteSubmission(deletingSubmission.id);

    if (!result.success) {
      setError(result.error);
      setDeleteSubmitting(false);
      handleDeleteClose();
      return;
    }

    setDeleteSubmitting(false);
    handleDeleteClose();
    setSuccessMessage('Submission deleted successfully!');
    setError('');
    loadData();
  }, [deletingSubmission, handleDeleteClose, loadData]);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        {/* Page Header */}
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Manage candidate submissions and view summary statistics.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="admin-dashboard-error-banner">{error}</div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="admin-dashboard-success-banner">{successMessage}</div>
        )}

        {/* Stat Cards */}
        <div className="admin-dashboard-stats">
          <div className="admin-dashboard-stat-card">
            <p className="admin-dashboard-stat-label">Total Submissions</p>
            <p className="admin-dashboard-stat-value">{stats.totalSubmissions}</p>
            <p className="admin-dashboard-stat-meta">All time submissions</p>
          </div>
          <div className="admin-dashboard-stat-card">
            <p className="admin-dashboard-stat-label">Unique Departments</p>
            <p className="admin-dashboard-stat-value">{stats.uniqueDepartments}</p>
            <p className="admin-dashboard-stat-meta">Departments represented</p>
          </div>
          <div className="admin-dashboard-stat-card">
            <p className="admin-dashboard-stat-label">Latest Submission</p>
            <p className="admin-dashboard-stat-value">
              {stats.latestSubmissionDate ? formatDate(stats.latestSubmissionDate) : '—'}
            </p>
            <p className="admin-dashboard-stat-meta">
              {stats.latestSubmissionDate ? formatDateTime(stats.latestSubmissionDate) : 'No submissions yet'}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-dashboard-table-section">
          <div className="admin-dashboard-table-header">
            <h2 className="admin-dashboard-table-title">All Submissions</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="admin-dashboard-empty">
              <p className="admin-dashboard-empty-title">No submissions yet</p>
              <p className="admin-dashboard-empty-desc">
                Candidate submissions will appear here once they express their interest.
              </p>
            </div>
          ) : (
            <div className="admin-dashboard-table-container">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.fullName}</td>
                      <td>{submission.email}</td>
                      <td>{submission.mobile}</td>
                      <td>
                        <span className={getDeptBadgeClass(submission.department)}>
                          {submission.department}
                        </span>
                      </td>
                      <td>{formatDate(submission.createdAt)}</td>
                      <td>
                        <div className="admin-dashboard-actions">
                          <button
                            className="admin-dashboard-btn-edit"
                            onClick={() => handleEditClick(submission)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-dashboard-btn-delete"
                            onClick={() => handleDeleteClick(submission)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSubmission && (
        <div className="admin-dashboard-modal-overlay" onClick={handleEditClose}>
          <div
            className="admin-dashboard-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-dashboard-modal-header">
              <h3 className="admin-dashboard-modal-title">Edit Submission</h3>
              <button
                className="admin-dashboard-modal-close"
                onClick={handleEditClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {editSubmitError && (
              <div className="admin-dashboard-modal-error-banner">{editSubmitError}</div>
            )}

            <form onSubmit={handleEditSave} noValidate>
              <div className="admin-dashboard-modal-group">
                <label htmlFor="edit-fullName" className="admin-dashboard-modal-label">
                  Full Name<span className="admin-dashboard-modal-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="edit-fullName"
                  name="fullName"
                  className={`admin-dashboard-modal-input${editErrors.fullName ? ' admin-dashboard-modal-input-error' : ''}`}
                  value={editFormData.fullName}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                  autoComplete="name"
                />
                {editErrors.fullName && (
                  <span className="admin-dashboard-modal-field-error">{editErrors.fullName}</span>
                )}
              </div>

              <div className="admin-dashboard-modal-group">
                <label htmlFor="edit-email" className="admin-dashboard-modal-label">
                  Email<span className="admin-dashboard-modal-label-required">*</span>
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  className={`admin-dashboard-modal-input${editErrors.email ? ' admin-dashboard-modal-input-error' : ''}`}
                  value={editFormData.email}
                  onChange={handleEditChange}
                  placeholder="Enter email address"
                  autoComplete="email"
                />
                {editErrors.email && (
                  <span className="admin-dashboard-modal-field-error">{editErrors.email}</span>
                )}
              </div>

              <div className="admin-dashboard-modal-group">
                <label htmlFor="edit-mobile" className="admin-dashboard-modal-label">
                  Mobile Number<span className="admin-dashboard-modal-label-required">*</span>
                </label>
                <input
                  type="tel"
                  id="edit-mobile"
                  name="mobile"
                  className={`admin-dashboard-modal-input${editErrors.mobile ? ' admin-dashboard-modal-input-error' : ''}`}
                  value={editFormData.mobile}
                  onChange={handleEditChange}
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel"
                />
                {editErrors.mobile && (
                  <span className="admin-dashboard-modal-field-error">{editErrors.mobile}</span>
                )}
              </div>

              <div className="admin-dashboard-modal-group">
                <label htmlFor="edit-department" className="admin-dashboard-modal-label">
                  Department<span className="admin-dashboard-modal-label-required">*</span>
                </label>
                <select
                  id="edit-department"
                  name="department"
                  className={`admin-dashboard-modal-select${editErrors.department ? ' admin-dashboard-modal-input-error' : ''}`}
                  value={editFormData.department}
                  onChange={handleEditChange}
                >
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {editErrors.department && (
                  <span className="admin-dashboard-modal-field-error">{editErrors.department}</span>
                )}
              </div>

              <div className="admin-dashboard-modal-actions">
                <button
                  type="button"
                  className="admin-dashboard-modal-btn-cancel"
                  onClick={handleEditClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-dashboard-modal-btn-save"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingSubmission && (
        <div className="admin-dashboard-modal-overlay" onClick={handleDeleteClose}>
          <div
            className="admin-dashboard-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-dashboard-confirm-icon">⚠</div>
            <h3 className="admin-dashboard-confirm-title">Delete Submission</h3>
            <p className="admin-dashboard-confirm-desc">
              Are you sure you want to delete the submission from{' '}
              <span className="admin-dashboard-confirm-name">
                {deletingSubmission.fullName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="admin-dashboard-confirm-actions">
              <button
                className="admin-dashboard-confirm-btn-cancel"
                onClick={handleDeleteClose}
              >
                Cancel
              </button>
              <button
                className="admin-dashboard-confirm-btn-delete"
                onClick={handleDeleteConfirm}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}