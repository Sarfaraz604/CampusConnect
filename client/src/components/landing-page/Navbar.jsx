import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import iiitAgartalaLogo from "../../../assets/iiit_agartala_logo.png";

const aboutSections = [
  {
    title: "About IIIT Agartala",
    paragraphs: [
      "CampusConnect is the alumni networking platform for IIIT Agartala, designed to keep alumni, students, faculty, and institute leadership connected in one secure digital space.",
      "It brings together announcements, mentorship, career opportunities, fundraising, and discussion so the IIIT Agartala community can stay active long after graduation.",
    ],
  },
  {
    title: "Mission",
    paragraphs: [
      "Enable meaningful alumni-student engagement that supports learning, mentoring, placements, and long-term institutional growth.",
    ],
  },
  {
    title: "Vision",
    paragraphs: [
      "Build a thriving IIIT Agartala alumni ecosystem where every batch remains connected and contributes to the institute's future.",
    ],
  },
  {
    title: "Goal",
    paragraphs: [
      "Provide a trusted home for announcements, networking, mentorship, and institute-led initiatives that help alumni give back to IIIT Agartala.",
    ],
  },
];

const contactSections = [
  {
    title: "Connect with IIIT Agartala",
    content: (
      <p className="mt-4 text-sm text-gray-600">
        For platform access, alumni engagement, or institutional coordination,
        use your IIIT Agartala email and the institute's official channels.
      </p>
    ),
  },
  {
    title: "Official Website",
    content: (
      <p className="mt-4 text-sm text-gray-600">
        <a
          href="https://www.iiitagartala.ac.in/"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          www.iiitagartala.ac.in
        </a>
      </p>
    ),
  },
  {
    title: "Campus Address",
    content: (
      <p className="mt-4 text-sm text-gray-600">
        IIIT Agartala, NIT Agartala Campus, Barjala, Jirania, Tripura (W)
        799046
      </p>
    ),
  },
  {
    title: "Institutional Access",
    content: (
      <p className="mt-4 text-sm text-gray-600">
        Please sign in with your institutional email address
        ({' '}@iiitagartala.ac.in) for authenticated access.
      </p>
    ),
  },
  {
    title: "Stay Updated",
    content: (
      <p className="mt-4 text-sm text-gray-600">
        Stay updated through official IIIT Agartala notices, alumni outreach,
        and institute communication channels.
      </p>
    ),
  },
];

const AboutContent = ({ compact = false }) => (
  <div className={compact ? "mt-3 p-4 bg-gray-50 rounded-lg" : "absolute left-1/2 top-full mt-2 w-96 -translate-x-1/2 rounded-lg border border-gray-100 bg-white p-6 shadow-md opacity-0 invisible transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible"}>
    {aboutSections.map((section, index) => (
      <div key={section.title} className={index === 0 ? "" : "mt-4"}>
        <div className="text-center">
          <h2 className={`${compact ? "text-lg" : "text-xl"} font-semibold text-gray-800`}>
            {section.title}
          </h2>
        </div>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph} className={`${compact ? "mt-2" : "mt-4"} text-sm text-gray-600`}>
            {paragraph}
          </p>
        ))}
      </div>
    ))}
  </div>
);

const ContactContent = ({ compact = false }) => (
  <div className={compact ? "mt-3 p-4 bg-gray-50 rounded-lg" : "absolute right-1/2 top-full mt-2 w-96 translate-x-1/2 rounded-lg border border-gray-100 bg-white p-6 shadow-md opacity-0 invisible transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible"}>
    {contactSections.map((section, index) => (
      <div key={section.title} className={index === 0 ? "" : compact ? "mt-2" : "mt-4"}>
        <div className="text-center">
          <h2 className={`${compact ? "text-lg" : "text-xl"} font-semibold text-gray-800`}>
            {section.title}
          </h2>
        </div>
        {section.content}
      </div>
    ))}
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileAbout, setMobileAbout] = useState(false);
  const [mobileContact, setMobileContact] = useState(false);
  const authButtons = [
    {
      label: "Sign In",
      to: "/login",
      className:
        "rounded-md border border-blue-600 px-4 py-2 text-blue-600 transition hover:bg-blue-600 hover:text-white",
    },
    {
      label: "Sign Up",
      to: "/login?mode=signup",
      className:
        "rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex h-16 w-full flex-wrap items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8">
        <div className="logo flex flex-shrink-0 items-center">
          <Link to="/" className="flex items-center">
            <img
              src={iiitAgartalaLogo}
              width="56"
              height="56"
              alt="IIIT Agartala Logo"
              className="object-contain"
            />
            <div className="ml-3 hidden leading-tight lg:block">
              <h1 className="text-xl font-bold text-blue-700">AlumConnect</h1>
              <p className="text-xs text-gray-500">IIIT Agartala</p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-8 lg:flex">
          <ul className="flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li className="group relative">
              <span className="cursor-pointer text-gray-700 hover:text-gray-900">
                About
              </span>
              <AboutContent />
            </li>
            <li className="group relative">
              <span className="cursor-pointer text-gray-700 hover:text-gray-900">
                Contact
              </span>
              <ContactContent />
            </li>
          </ul>

          <div className="ml-4 flex items-center gap-3">
            {authButtons.map((button) => (
              <Link
                key={button.label}
                to={button.to}
                className={button.className}
              >
                {button.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full border-t border-gray-100 bg-white lg:hidden">
          <div className="space-y-4 px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-lg text-gray-700 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setMobileAbout(!mobileAbout)}
                  className="flex w-full items-center justify-between text-lg text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <span>About</span>
                  <ChevronDown
                    className={`transition-transform ${mobileAbout ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                {mobileAbout && <AboutContent compact />}
              </li>
              <li>
                <button
                  onClick={() => setMobileContact(!mobileContact)}
                  className="flex w-full items-center justify-between text-lg text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <span>Contact</span>
                  <ChevronDown
                    className={`transition-transform ${mobileContact ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                {mobileContact && <ContactContent compact />}
              </li>
              <li className="space-y-3 pt-2">
                {authButtons.map((button) => (
                  <Link
                    key={button.label}
                    to={button.to}
                    className={`block w-full rounded-lg px-4 py-3 text-center transition-colors ${button.label === 'Sign In'
                      ? 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {button.label}
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
