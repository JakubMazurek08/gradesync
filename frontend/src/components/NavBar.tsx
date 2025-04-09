import { Text } from "./Text";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnimationState, setMenuAnimationState] = useState("closed");

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setMenuAnimationState("closing");
      setTimeout(() => {
        setMobileMenuOpen(false);
        setMenuAnimationState("closed");
      }, 300);
    } else {
      setMobileMenuOpen(true);
      setTimeout(() => {
        setMenuAnimationState("open");
      }, 10);
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e:any) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="hidden lg:flex bg-gray-950 h-20 border-b-2 border-lightgray flex-row justify-between items-center px-5">
        <Link to="/landingpage">
          <img src="/GradeSyncLogoDarkSmall.png" alt="LOGO" className="h-10" />
        </Link>
        <div className="w-150 flex flex-row justify-around">
          <Link to="/pricing">
            <Text type="h4">PRICING</Text>
          </Link>
          <Text type="h4">LOGIN/SIGN UP</Text>
        </div>
      </div>

      <div className="flex flex-row justify-between px-4 pt-4 lg:hidden md:pt-7 md:px-7">
        <Link to="/landingpage">
          <img
            src="/GradeSyncLogoDarkSmall.png"
            alt="LOGO"
            className="h-8 md:h-12"
          />
        </Link>
        <img
          src="/menu.png"
          alt="MENU"
          className="h-8 md:h-12 cursor-pointer"
          onClick={toggleMobileMenu}
        />
      </div>

      {mobileMenuOpen && (
        <div 
          className={`fixed inset-0 bg-black z-20 flex flex-col items-center pt-20 transition-all duration-300 ease-in-out ${
            menuAnimationState === "open" 
              ? "opacity-100" 
              : menuAnimationState === "closing" 
              ? "opacity-0"
              : "opacity-0"
          }`}
        >
          <div className="absolute top-4 right-4 md:top-7 md:right-7">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-3xl font-bold transition-transform duration-200 hover:scale-110"
            >
              ✕
            </button>
          </div>
          <div className={`transition-all duration-300 ease-in-out ${
            menuAnimationState === "open" 
              ? "translate-y-0 opacity-100" 
              : "translate-y-8 opacity-0"
          }`}>
            <div className="flex flex-col items-center space-y-6 md:hidden">
              <Link to="/pricing" onClick={toggleMobileMenu} className="transition-all duration-200 hover:scale-105">
                <Text>Pricing</Text>
              </Link>
              <Text>Login/sign up</Text>
            </div>
            <div className="hidden md:flex md:flex-col md:items-center md:space-y-9">
              <Link to="/pricing" onClick={toggleMobileMenu} className="transition-all duration-200 hover:scale-105">
                <Text type="h3">Pricing</Text>
              </Link>
              <Text type="h3">Login/sign up</Text>
            </div>
          </div>
        </div>
      )}
    </>
  );
};