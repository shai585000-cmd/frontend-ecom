import React from 'react';
import { CiTwitter } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" bottom-0 w-full left-0 bg-black text-white py-10">
      <div className="mt-0">
        <div className="flex flex-col md:flex-row py-6 justify-between w-full space-y-4 md:space-y-0">
          <div className="text-center mb-4 transition-all transform hover:scale-105 hover:text-blue-500 duration-300 ease-in-out">
            <span>Miaama </span><br /> votre satisfaction
          </div>
          <div className="transition-all transform hover:scale-105 hover:text-blue-500 duration-300 ease-in-out">
            Weebly themes <br /> Pre-sale faqs <br /> SUBMIT A TICKET
          </div>
          <div className="transition-all transform hover:scale-105 hover:text-blue-500 duration-300 ease-in-out">
            service<br /> theme tweak
          </div>
          <div className="transition-all transform hover:scale-105 hover:text-blue-500 duration-300 ease-in-out">
            showcase <br />widgetkit <br />support
          </div>
          <div className="transition-all transform hover:scale-105 hover:text-blue-500 duration-300 ease-in-out">
            About US <br />contact us <br />affiliates <br />resources
          </div>
        </div>
      </div>

      <hr className="border-gray-600 mb-6" />
      
      <div className="flex items-center justify-center space-x-6 h-24 transition-all transform hover:scale-110">
        <a 
          href="https://www.linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-800 hover:text-blue-600 transition-colors transform hover:scale-110 duration-300 ease-in-out" 
          aria-label="LinkedIn"
        >
          <FaLinkedin size={28} />
        </a>
        <a 
          href="https://www.instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-800 hover:text-pink-600 transition-colors transform hover:scale-110 duration-300 ease-in-out" 
          aria-label="Instagram"
        >
          <FaInstagram size={28} />
        </a>
        <a 
          href="https://www.facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-800 hover:text-blue-700 transition-colors transform hover:scale-110 duration-300 ease-in-out" 
          aria-label="Facebook"
        >
          <FaFacebook size={28} />
        </a>
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-800 hover:text-blue-400 transition-colors transform hover:scale-110 duration-300 ease-in-out" 
          aria-label="Twitter"
        >
          <CiTwitter size={28} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
