import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, UserCircle, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import iiitAgartalaLogo from "../../assets/iiit_agartala_logo.png";

const VISITOR_CREDENTIALS = [
  { email: 'visitor1@iiitagartala.ac.in', password: 'visitor1' },
  { email: 'visitor2@iiitagartala.ac.in', password: 'visitor2' }
];

const BRANCH_OPTIONS = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'CSA', label: 'Computer Science - AI/ML' },
  { value: 'CSD', label: 'Computer Science - DSA' },
  { value: 'CSH', label: 'Computer Science - HCI & GT' },
  { value: 'ECE', label: 'Electronics and Communication Engineering' },
  { value: 'ECI', label: 'Electronics and Communication Engineering - IOT' }
];

const SIGNIN_ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'admin', label: 'Admin' },
  { value: 'visitor', label: 'Visitor' }
];

const SIGNUP_ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'admin', label: 'Admin' }
];

const createInitialFormState = () => ({
  name: '',
  role: 'student',
  email: '',
  password: '',
  confirmPassword: '',
  branchCode: 'CSE',
  batch: ''
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const isInstitutionalEmail = (email) =>
  normalizeEmail(email).endsWith('@iiitagartala.ac.in');

const getRedirectPath = (role) =>
  role?.toLowerCase() === 'admin' ? '/admin/announcements' : '/announcements';

const applyRoleDefaults = (draft, nextRole) => {
  const nextState = { ...draft, role: nextRole };

  if (nextRole === 'admin') {
    nextState.branchCode = 'ADM';
    nextState.batch = 'N/A';
    return nextState;
  }

  if (nextState.branchCode === 'ADM') {
    nextState.branchCode = 'CSE';
  }

  if (nextState.batch === 'N/A') {
    nextState.batch = '';
  }

  return nextState;
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 m-4 w-full max-w-md rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const searchParams = new URLSearchParams(location.search);
  const isSignupMode = searchParams.get('mode') === 'signup';
  const isGoogleSignup = isSignupMode && searchParams.get('provider') === 'google';

  const [formData, setFormData] = useState(createInitialFormState);
  const [previousValues, setPreviousValues] = useState({
    email: '',
    password: ''
  });
  const [pendingGoogleProfile, setPendingGoogleProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingGoogleLoading, setIsPendingGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get('error');

    if (!errorMessage) {
      return;
    }

    setError(errorMessage);
    params.delete('error');

    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [location.search]);

  useEffect(() => {
    setFormData((prev) => {
      if (!isSignupMode || prev.role !== 'visitor') {
        return prev;
      }

      return applyRoleDefaults(
        {
          ...prev,
          email: previousValues.email,
          password: previousValues.password,
          confirmPassword: ''
        },
        'student'
      );
    });

    if (!isGoogleSignup) {
      setPendingGoogleProfile(null);
    }
  }, [isSignupMode, isGoogleSignup, previousValues.email, previousValues.password]);

  useEffect(() => {
    if (!isGoogleSignup) {
      return undefined;
    }

    let isMounted = true;

    const fetchPendingGoogleSignup = async () => {
      setIsPendingGoogleLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backend_URL}/auth/pending-signup`,
          { withCredentials: true }
        );

        if (!isMounted) {
          return;
        }

        setPendingGoogleProfile(response.data);
        setFormData((prev) => ({
          ...applyRoleDefaults(prev, prev.role === 'visitor' ? 'student' : prev.role),
          name: response.data.name || '',
          email: response.data.email || ''
        }));
        setError(null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setPendingGoogleProfile(null);
        setError(
          requestError.response?.data?.error ||
            'Google signup session expired. Please try again.'
        );
      } finally {
        if (isMounted) {
          setIsPendingGoogleLoading(false);
        }
      }
    };

    fetchPendingGoogleSignup();

    return () => {
      isMounted = false;
    };
  }, [isGoogleSignup]);

  const isVisitorRole = !isSignupMode && formData.role === 'visitor';
  const showAcademicFields = isSignupMode && formData.role !== 'admin';
  const googleSignupReady = !isGoogleSignup || !!pendingGoogleProfile;
  const roleOptions = isSignupMode ? SIGNUP_ROLE_OPTIONS : SIGNIN_ROLE_OPTIONS;

  const pageTitle = isGoogleSignup
    ? 'Complete Your Signup'
    : isSignupMode
      ? 'Create Your Account'
      : 'Welcome Back';

  const pageDescription = isGoogleSignup
    ? 'Finish your IIIT Agartala account details to continue'
    : isSignupMode
      ? 'Sign up instantly with your IIIT Agartala email address'
      : 'Sign in to the IIIT Agartala alumni platform';

  const accessNote = isSignupMode
    ? 'Any @iiitagartala.ac.in email can sign up immediately as a student, alumni, or admin account.'
    : 'Visitor access is available from the role dropdown.';

  const toggleLabel = isSignupMode ? 'Already have an account? Sign In' : 'Need an account? Sign Up';
  const togglePath = isSignupMode ? '/login' : '/login?mode=signup';

  const submitLabel = isGoogleSignup
    ? 'Complete Sign Up'
    : isSignupMode
      ? 'Create Account'
      : 'Sign In';

  const submittingLabel = isGoogleSignup
    ? 'Completing signup...'
    : isSignupMode
      ? 'Creating account...'
      : 'Signing in...';

  const googleButtonLabel = isSignupMode ? 'Sign up with Google' : 'Sign in with Google';

  const handleAuthSuccess = (user) => {
    localStorage.setItem('cachedUserProfile', JSON.stringify(user));
    setUser(user);
    navigate(getRedirectPath(user.role));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;
    setError(null);

    if (!isSignupMode && nextRole === 'visitor' && formData.role !== 'visitor') {
      const randomVisitor =
        VISITOR_CREDENTIALS[Math.floor(Math.random() * VISITOR_CREDENTIALS.length)];

      setPreviousValues({
        email: formData.email,
        password: formData.password
      });

      setFormData((prev) => ({
        ...prev,
        role: 'visitor',
        email: randomVisitor.email,
        password: randomVisitor.password,
        confirmPassword: ''
      }));
      setShowConfirmPassword(false);
      return;
    }

    if (!isSignupMode && formData.role === 'visitor' && nextRole !== 'visitor') {
      setFormData((prev) =>
        applyRoleDefaults(
          {
            ...prev,
            email: previousValues.email,
            password: previousValues.password,
            confirmPassword: ''
          },
          nextRole
        )
      );
      return;
    }

    setFormData((prev) => applyRoleDefaults(prev, nextRole));
  };

  const validateSignupForm = ({ requiresEditableEmail }) => {
    if (!formData.name.trim()) {
      return 'Name is required.';
    }

    if (formData.role === 'visitor') {
      return 'Visitor accounts cannot sign up.';
    }

    if (requiresEditableEmail && !isInstitutionalEmail(formData.email)) {
      return 'Only @iiitagartala.ac.in email addresses are allowed';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }

    if (formData.role !== 'admin') {
      if (!formData.branchCode) {
        return 'Please choose a branch.';
      }

      if (!formData.batch.trim()) {
        return 'Batch is required for student and alumni signups.';
      }
    }

    return null;
  };

  const handleLogin = async () => {
    if (!isInstitutionalEmail(formData.email)) {
      throw new Error('Only @iiitagartala.ac.in email addresses are allowed');
    }

    const response = await axios.post(
      `${import.meta.env.VITE_backend_URL}/auth/login`,
      {
        role: formData.role,
        email: normalizeEmail(formData.email),
        password: formData.password
      },
      { withCredentials: true }
    );

    handleAuthSuccess(response.data.user);
  };

  const handleLocalSignup = async () => {
    const validationError = validateSignupForm({ requiresEditableEmail: true });
    if (validationError) {
      throw new Error(validationError);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_backend_URL}/auth/signup`,
      {
        name: formData.name.trim(),
        role: formData.role,
        email: normalizeEmail(formData.email),
        password: formData.password,
        branchCode: formData.role === 'admin' ? 'ADM' : formData.branchCode,
        batch: formData.role === 'admin' ? 'N/A' : formData.batch.trim()
      },
      { withCredentials: true }
    );

    handleAuthSuccess(response.data.user);
  };

  const handleGoogleSignupCompletion = async () => {
    if (!pendingGoogleProfile) {
      throw new Error('Google signup session expired. Please try again.');
    }

    const validationError = validateSignupForm({ requiresEditableEmail: false });
    if (validationError) {
      throw new Error(validationError);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_backend_URL}/auth/google/complete-signup`,
      {
        role: formData.role,
        password: formData.password,
        branchCode: formData.role === 'admin' ? 'ADM' : formData.branchCode,
        batch: formData.role === 'admin' ? 'N/A' : formData.batch.trim()
      },
      { withCredentials: true }
    );

    handleAuthSuccess(response.data.user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignupMode && isGoogleSignup) {
        await handleGoogleSignupCompletion();
      } else if (isSignupMode) {
        await handleLocalSignup();
      } else {
        await handleLogin();
      }
    } catch (submitError) {
      setError(submitError.response?.data?.error || submitError.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    const modeQuery = isSignupMode ? '?mode=signup' : '';
    window.location.href = `${import.meta.env.VITE_backend_URL}/auth/google${modeQuery}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src={iiitAgartalaLogo}
              alt="IIIT Agartala Logo"
              className="h-20 w-20 object-contain"
            />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-blue-700">{pageTitle}</h2>
          <p className="text-gray-500">{pageDescription}</p>

          <div
            className={`mt-3 rounded-lg border px-4 py-2 text-sm font-medium ${
              isSignupMode
                ? 'border-blue-200 bg-blue-50 text-blue-800'
                : 'border-yellow-200 bg-yellow-50 text-yellow-800'
            }`}
          >
            {accessNote}
          </div>

          {isGoogleSignup && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
              Your Google account has been verified. Add the remaining profile details below to finish creating your account.
            </div>
          )}
        </div>

        {isGoogleSignup && isPendingGoogleLoading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            Loading your Google signup details...
          </div>
        ) : isGoogleSignup && !googleSignupReady ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              Google signup could not be resumed. Start the Google sign-up flow again or switch to regular email signup.
            </div>
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Start Google Sign Up Again
            </button>
            <button
              type="button"
              onClick={() => navigate('/login?mode=signup')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Use Email Signup Instead
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignupMode && (
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  readOnly={isGoogleSignup}
                  className={`block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                    isGoogleSignup ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            )}

            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-8 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  {roleOptions.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
                <UserCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>

            {showAcademicFields && (
              <>
                <div>
                  <label htmlFor="branchCode" className="mb-2 block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <select
                    id="branchCode"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    {BRANCH_OPTIONS.map((branch) => (
                      <option key={branch.value} value={branch.value}>
                        {branch.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="batch" className="mb-2 block text-sm font-medium text-gray-700">
                    Batch Year
                  </label>
                  <input
                    id="batch"
                    name="batch"
                    type="text"
                    required
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="Enter your batch year"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {isSignupMode && formData.role === 'admin' && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Admin signups are stored with branch <span className="font-semibold">Administration</span> and batch <span className="font-semibold">N/A</span>.
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your institutional email"
                readOnly={isGoogleSignup}
                disabled={isVisitorRole}
                className={`block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  isGoogleSignup || isVisitorRole ? 'bg-gray-50' : ''
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isSignupMode ? 'Create a password' : 'Enter your password'}
                  disabled={isVisitorRole}
                  className={`block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                    isVisitorRole ? 'bg-gray-50' : ''
                  }`}
                />
                {!isVisitorRole && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>

            {isSignupMode && (
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isPendingGoogleLoading}
              className={`w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading || isPendingGoogleLoading ? 'cursor-not-allowed opacity-75' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {submittingLabel}
                </span>
              ) : (
                submitLabel
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(togglePath)}
              className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {toggleLabel}
            </button>

            {!isSignupMode && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Forgot Password?
              </button>
            )}
          </form>
        )}

        {!isGoogleSignup && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-2 text-center text-sm text-gray-600">
              Please use your IIIT Agartala email (@iiitagartala.ac.in)
            </div>

            <button
              type="button"
              onClick={handleGoogleLoginClick}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {googleButtonLabel}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Password Recovery
          </h3>
          <p className="mb-6 text-gray-600">
            Please contact your college admin or alumni cell for password recovery assistance.
          </p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Understood
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
