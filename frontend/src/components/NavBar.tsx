import { Text } from "./Text";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnimationState, setMenuAnimationState] = useState("closed");
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
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
      <div 
        className={`hidden lg:flex bg-darkgray h-20 border-b-2 border-lightgray flex-row justify-between items-center px-5 transition-all duration-300 ease-in-out ${
          scrolled ? "bg-opacity-90 backdrop-blur-sm shadow-lg" : ""
        } fixed top-0 left-0 right-0 z-50 transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link to="/landingpage" className="transition-transform duration-200 hover:scale-105">
          <img src="/GradeSyncLogoDarkSmall.png" alt="LOGO" className="h-10" />
        </Link>
        <div className="w-150 flex flex-row justify-around items-center">
          <Link 
            to="/pricing" 
            className="px-5 py-2 mx-3 relative group overflow-hidden"
          >
            <Text type="h4">PRICING</Text>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="px-5 py-2 mx-3 cursor-pointer relative group overflow-hidden">
            <Text type="h4">LOGIN/SIGN UP</Text>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full"></span>
          </div>
        </div>
      </div>

      <div className={`flex flex-row justify-between px-4 pt-4 lg:hidden md:pt-7 md:px-7 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black bg-opacity-80 backdrop-blur-sm py-3" : "bg-transparent"
      } transform ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}>
        <Link to="/landingpage" className="transition-transform duration-200 active:scale-95">
          <img
            src="/GradeSyncLogoDarkSmall.png"
            alt="LOGO"
            className="h-8 md:h-12"
          />
        </Link>
        <button
          className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {!mobileMenuOpen ? (
            <img
              src="/menu.png"
              alt="MENU"
              className="h-8 md:h-12 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
            />
          ) : (
            <span className="text-white text-2xl md:text-3xl font-bold transition-transform duration-200 hover:scale-110">
              ✕
            </span>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div 
          className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
            menuAnimationState === "open" 
              ? "opacity-100" 
              : menuAnimationState === "closing" 
              ? "opacity-0"
              : "opacity-0"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleMobileMenu();
            }
          }}
        >
          <div className={`transition-all duration-500 ease-in-out ${
            menuAnimationState === "open" 
              ? "translate-y-0 opacity-100 scale-100" 
              : "translate-y-8 opacity-0 scale-95"
          }`}>
            <div className="flex flex-col items-center space-y-8 md:hidden">
              <Link 
                to="/pricing" 
                onClick={toggleMobileMenu} 
                className="transition-all duration-200 hover:scale-105 active:scale-100 px-5 py-2 relative overflow-hidden group"
              >
                <Text>Pricing</Text>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
              <div className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-100 px-5 py-2 relative overflow-hidden group">
                <Text>Login/sign up</Text>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </div>
            </div>
            
            <div className="hidden md:flex md:flex-col md:items-center md:space-y-12">
              <Link 
                to="/pricing" 
                onClick={toggleMobileMenu} 
                className="transition-all duration-200 hover:scale-105 active:scale-100 px-6 py-3 relative overflow-hidden group"
              >
                <Text type="h3">Pricing</Text>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
              <div className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-100 px-6 py-3 relative overflow-hidden group">
                <Text type="h3">Login/sign up</Text>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-lightgray transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="h-20 w-full"></div>
    </>
  );
};