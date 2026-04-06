import React, { useEffect, useState } from "react";
import iiitAgartalaLogo from "../../../assets/iiit_agartala_logo.png";

const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = iiitAgartalaLogo;
    logoImage.onload = () => setImagesLoaded(true);
    logoImage.onerror = () => setImagesLoaded(true);
  }, []);

  return (
    <div className="relative bg-white pt-16">
      <main className="w-full px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col items-center text-center py-20">
          {!imagesLoaded ? (
            <div className="w-40 h-24 mb-8 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <img
              src={iiitAgartalaLogo}
              alt="IIIT Agartala Logo"
              className="w-28 sm:w-32 mb-8 object-contain"
            />
          )}
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to <span className="text-blue-600 block mt-2">AlumConnect</span>
          </h1>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            The networking experience for IIIT Agartala to help students, alumni, and institute leadership stay
            connected, informed, and ready to give back.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Hero;
