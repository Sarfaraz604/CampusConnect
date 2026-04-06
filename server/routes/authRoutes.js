const express = require("express");
const passport = require("passport");
const User = require("../models/users");
const { ensureInstitutionalEmail } = require("../middleware/roleMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  buildSignupUserPayload,
  normalizeText,
} = require("../utils/signupUtils");

const router = express.Router();

const getPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || null,
});

const buildFrontendLoginUrl = ({ mode, provider, error }) => {
  const params = new URLSearchParams();

  if (mode === "signup") {
    params.set("mode", "signup");
  }

  if (provider) {
    params.set("provider", provider);
  }

  if (error) {
    params.set("error", error);
  }

  const query = params.toString();
  return `${process.env.VITE_API_BASE_URL}/login${query ? `?${query}` : ""}`;
};

const persistSession = (req) =>
  new Promise((resolve, reject) => {
    if (!req.session) {
      resolve();
      return;
    }

    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const loginUser = (req, user) =>
  new Promise((resolve, reject) => {
    req.logIn(user, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const clearPendingGoogleSignup = (req) => {
  if (!req.session) {
    return;
  }

  delete req.session.pendingGoogleSignup;
  delete req.session.googleAuthMode;
};

const getRequestedRole = (role) => normalizeText(role).toLowerCase();

router.post("/login", ensureInstitutionalEmail, (req, res, next) => {
  passport.authenticate("local", async (error, user, info) => {
    if (error) {
      next(error);
      return;
    }

    if (!user) {
      res.status(400).json({ error: info?.message || "Login failed" });
      return;
    }

    try {
      const requestedRole = getRequestedRole(req.body.role);
      if (requestedRole && requestedRole !== user.role.toLowerCase()) {
        res.status(403).json({ error: "Unauthorized role" });
        return;
      }

      await loginUser(req, user);
      clearPendingGoogleSignup(req);
      await persistSession(req);

      res.json({
        message: "Logged in successfully",
        user: getPublicUser(user),
      });
    } catch (loginError) {
      next(loginError);
    }
  })(req, res, next);
});

router.post("/signup", async (req, res) => {
  try {
    const signupPayload = buildSignupUserPayload(req.body);
    const existingUser = await User.findOne({ email: signupPayload.email });

    if (existingUser) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const user = new User(signupPayload);
    await user.save();

    clearPendingGoogleSignup(req);
    await loginUser(req, user);
    await persistSession(req);

    res.status(201).json({
      message: "Signed up successfully",
      user: getPublicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    res.status(400).json({ error: error.message || "Signup failed" });
  }
});

router.get("/pending-signup", (req, res) => {
  const pendingSignup = req.session?.pendingGoogleSignup;

  if (!pendingSignup) {
    res.status(404).json({ error: "No pending Google signup session found." });
    return;
  }

  res.json({
    provider: pendingSignup.provider || "google",
    name: pendingSignup.name,
    email: pendingSignup.email,
    avatar: pendingSignup.avatar || null,
  });
});

router.post("/google/complete-signup", async (req, res) => {
  const pendingSignup = req.session?.pendingGoogleSignup;

  if (!pendingSignup) {
    res.status(400).json({ error: "Google signup session expired. Please try again." });
    return;
  }

  try {
    const signupPayload = buildSignupUserPayload({
      name: pendingSignup.name,
      email: pendingSignup.email,
      password: req.body.password,
      role: req.body.role,
      branchCode: req.body.branchCode,
      batch: req.body.batch,
      googleId: pendingSignup.googleId,
      avatar: pendingSignup.avatar,
    });

    const existingUser = await User.findOne({ email: signupPayload.email });
    if (existingUser) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const user = new User(signupPayload);
    await user.save();

    clearPendingGoogleSignup(req);
    await loginUser(req, user);
    await persistSession(req);

    res.status(201).json({
      message: "Signed up successfully",
      user: getPublicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    res.status(400).json({ error: error.message || "Google signup failed" });
  }
});

router.get("/profile", (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const socialLinks = req.user.socialLinks || {};

  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    dob: req.user.dob,
    branch: req.user.branch,
    branchCode: req.user.branchCode,
    currentCompany: req.user.currentCompany,
    currentCompanyRole: req.user.currentCompanyRole,
    location: req.user.location,
    batch: req.user.batch,
    homeTown: req.user.homeTown,
    avatar: req.user.avatar || null,
    socialLinks: {
      linkedin: socialLinks.linkedin || null,
      instagram: socialLinks.instagram || null,
      github: socialLinks.github || null,
      x: socialLinks.x || socialLinks.twitter || null,
    },
    personalEmail: req.user.personalEmail,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
  });
});

router.post("/logout", (req, res, next) => {
  try {
    clearPendingGoogleSignup(req);

    req.logout((error) => {
      if (error) {
        next(error);
        return;
      }

      req.session.destroy((sessionError) => {
        if (sessionError) {
          next(sessionError);
          return;
        }

        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/check", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? getPublicUser(req.user) : null,
  });
});

router.get("/google", (req, res, next) => {
  const mode = req.query.mode === "signup" ? "signup" : "signin";

  if (!req.session) {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
    return;
  }

  req.session.googleAuthMode = mode;
  req.session.save((error) => {
    if (error) {
      next(error);
      return;
    }

    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })(req, res, next);
  });
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (error, user, info = {}) => {
    const activeMode = req.session?.googleAuthMode === "signup" ? "signup" : undefined;

    if (error) {
      clearPendingGoogleSignup(req);
      try {
        await persistSession(req);
      } catch (saveError) {
        next(saveError);
        return;
      }

      res.redirect(
        buildFrontendLoginUrl({
          mode: activeMode,
          error: "Authentication failed. Please try again.",
        })
      );
      return;
    }

    if (!user) {
      if (info.pendingSignup) {
        if (!req.session) {
          res.redirect(
            buildFrontendLoginUrl({
              mode: "signup",
              error: "Unable to start Google signup. Please try again.",
            })
          );
          return;
        }

        req.session.pendingGoogleSignup = info.pendingSignup;
        delete req.session.googleAuthMode;
        req.session.save((saveError) => {
          if (saveError) {
            next(saveError);
            return;
          }

          res.redirect(
            buildFrontendLoginUrl({
              mode: "signup",
              provider: "google",
            })
          );
        });
        return;
      }

      clearPendingGoogleSignup(req);

      try {
        await persistSession(req);
      } catch (saveError) {
        next(saveError);
        return;
      }

      const errorMessage = info.message || "Authentication failed.";
      res.redirect(
        buildFrontendLoginUrl({
          mode: activeMode,
          error: errorMessage,
        })
      );
      return;
    }

    try {
      clearPendingGoogleSignup(req);
      await loginUser(req, user);
      await persistSession(req);

      const redirectPath =
        user.role.toLowerCase() === "admin"
          ? "/admin/announcements"
          : "/announcements";

      res.redirect(`${process.env.VITE_API_BASE_URL}${redirectPath}`);
    } catch (callbackError) {
      next(callbackError);
    }
  })(req, res, next);
});

router.get("/debug-auth", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user
      ? {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        }
      : null,
    sessionDetails: {
      passport: req.session?.passport,
      exists: !!req.session,
      pendingGoogleSignup: req.session?.pendingGoogleSignup || null,
    },
  });
});

router.get("/protected", isAuthenticated, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
