import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import backgroundVideo from '../../assets/travel-background-video.mp4';

function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 overflow-hidden">
      
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
        <h1 className="text-white font-extrabold text-4xl md:text-5xl leading-tight">
          <span className="text-[#f56551] block">Discover Your Next Adventure with AI:</span> 
          Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-md md:text-lg text-gray-300 max-w-2xl">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <Link to="/create-trip">
          <Button className="bg-[#f56551] text-white px-6 py-3 rounded-full text-lg hover:bg-[#e05245] transition-all">
            Get Started, It's Free!
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero
