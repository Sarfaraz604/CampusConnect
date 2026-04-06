// server\middleware\authMiddleware.js
const { ensureRole } = require('./roleMiddleware');

const verifyAdmin = (req, res, next) => {
  return ensureRole(['admin'])(req, res, next);
};

const isAlumni = (req, res, next) => {
  return ensureRole(['alumni'])(req, res, next);
};

const isStudent = (req, res, next) => {
  return ensureRole(['student'])(req, res, next);
};

const isStudentOrAlumni = (req, res, next) => {
  return ensureRole(['student','alumni'])(req, res, next);
};

module.exports = { verifyAdmin, isAlumni, isStudent, isStudentOrAlumni };