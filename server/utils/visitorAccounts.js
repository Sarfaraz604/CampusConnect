const User = require("../models/users");
const { normalizeEmail } = require("./signupUtils");

const DEFAULT_VISITOR_ACCOUNTS = Object.freeze([
  {
    name: "Visitor 1",
    email: "visitor1@iiitagartala.ac.in",
    password: "visitor1",
    role: "visitor",
    branch: "Computer Science",
    branchCode: "CSE",
    batch: "2022",
    location: "IIIT Agartala",
    homeTown: "IIIT Agartala",
  },
  {
    name: "Visitor 2",
    email: "visitor2@iiitagartala.ac.in",
    password: "visitor2",
    role: "visitor",
    branch: "Computer Science",
    branchCode: "CSE",
    batch: "2022",
    location: "IIIT Agartala",
    homeTown: "IIIT Agartala",
  },
]);

const getVisitorAccountTemplate = ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  return (
    DEFAULT_VISITOR_ACCOUNTS.find(
      (account) =>
        account.email === normalizedEmail && account.password === password
    ) || null
  );
};

const ensureVisitorAccount = async ({ email, password }) => {
  const visitorTemplate = getVisitorAccountTemplate({ email, password });
  if (!visitorTemplate) {
    return null;
  }

  const existingUser = await User.findOne({ email: visitorTemplate.email });
  if (existingUser) {
    return existingUser;
  }

  try {
    const visitorUser = new User(visitorTemplate);
    await visitorUser.save();
    return visitorUser;
  } catch (error) {
    if (error.code === 11000) {
      return User.findOne({ email: visitorTemplate.email });
    }

    throw error;
  }
};

module.exports = {
  DEFAULT_VISITOR_ACCOUNTS,
  ensureVisitorAccount,
  getVisitorAccountTemplate,
};
