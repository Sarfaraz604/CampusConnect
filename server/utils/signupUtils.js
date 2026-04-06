const INSTITUTIONAL_DOMAIN = "@iiitagartala.ac.in";

const BRANCH_LABELS = Object.freeze({
  CSE: "Computer Science",
  CSA: "Computer Science - AI/ML",
  CSD: "Computer Science - DSA",
  CSH: "Computer Science - HCI & GT",
  ECE: "Electronics and Communication Engineering",
  ECI: "Electronics and Communication Engineering - IOT",
  ADM: "Administration",
});

const SELF_SIGNUP_ROLES = Object.freeze(["student", "alumni", "admin"]);
const ACADEMIC_BRANCH_CODES = Object.freeze(
  Object.keys(BRANCH_LABELS).filter((branchCode) => branchCode !== "ADM")
);

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const normalizeEmail = (email) => normalizeText(email).toLowerCase();

const isInstitutionalEmail = (email) =>
  normalizeEmail(email).endsWith(INSTITUTIONAL_DOMAIN);

const resolveSignupProfile = ({ role, branchCode, batch }) => {
  const normalizedRole = normalizeText(role).toLowerCase();

  if (!SELF_SIGNUP_ROLES.includes(normalizedRole)) {
    throw new Error("Please choose a valid signup role.");
  }

  if (normalizedRole === "admin") {
    return {
      role: "admin",
      branchCode: "ADM",
      branch: BRANCH_LABELS.ADM,
      batch: "N/A",
    };
  }

  const normalizedBranchCode = normalizeText(branchCode).toUpperCase();
  if (!ACADEMIC_BRANCH_CODES.includes(normalizedBranchCode)) {
    throw new Error("Please choose a valid branch.");
  }

  const normalizedBatch = normalizeText(batch);
  if (!normalizedBatch) {
    throw new Error("Batch is required for student and alumni signups.");
  }

  return {
    role: normalizedRole,
    branchCode: normalizedBranchCode,
    branch: BRANCH_LABELS[normalizedBranchCode],
    batch: normalizedBatch,
  };
};

const buildSignupUserPayload = ({
  name,
  email,
  password,
  role,
  branchCode,
  batch,
  googleId,
  avatar,
}) => {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    throw new Error("Name is required.");
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!isInstitutionalEmail(normalizedEmail)) {
    throw new Error("Only @iiitagartala.ac.in email addresses are allowed");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const profile = resolveSignupProfile({ role, branchCode, batch });

  const payload = {
    name: normalizedName,
    email: normalizedEmail,
    password,
    role: profile.role,
    branchCode: profile.branchCode,
    branch: profile.branch,
    batch: profile.batch,
  };

  if (normalizeText(googleId)) {
    payload.googleId = normalizeText(googleId);
  }

  if (normalizeText(avatar)) {
    payload.avatar = normalizeText(avatar);
  }

  return payload;
};

module.exports = {
  ACADEMIC_BRANCH_CODES,
  BRANCH_LABELS,
  SELF_SIGNUP_ROLES,
  buildSignupUserPayload,
  isInstitutionalEmail,
  normalizeEmail,
  normalizeText,
  resolveSignupProfile,
};
