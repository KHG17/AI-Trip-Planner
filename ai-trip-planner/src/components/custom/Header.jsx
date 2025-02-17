import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import logo from "../../assets/logo.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Menu } from "lucide-react"; // For a mobile menu icon
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMessenger, setIsMessenger] = useState(false);

  // Check if user is logged in by accessing localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser); // Set user if available in localStorage
    }
  }, []);

  // Check if the user is inside Facebook Messenger
  useEffect(() => {
    const checkMessenger = () => {
      const userAgent = window.navigator.userAgent;
      setIsMessenger(/FBAN|FBAV/i.test(userAgent));
    };
  
    checkMessenger();
  }, []);

  const handleLogin = () => {
    if (isMessenger) {
      return (
        <div className="fixed top-0 left-0 w-full h-full bg-white flex flex-col justify-center items-center text-center z-50">
          <p className="text-lg font-bold text-gray-900">
            Google Sign-In does not work inside Facebook Messenger.
          </p>
          <p className="text-gray-700 mt-2">Please open this page in Chrome or Safari.</p>
          <p>😪🥺😭</p>
        </div>
      );
    }
    login(); // Proceed with normal Google login
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data)); // Store user in localStorage
        setUser(response.data); // Update state with user data
        setOpenDialog(false);
        window.location.reload();
      });
  };

  // Apply padding-top only when not on the hero page
  const bodyStyle = location.pathname !== '/' ? { paddingTop: '60px' } : {};

  // Determine if header should be hidden (when on the hero page and not logged in)
  const shouldHideHeader = location.pathname === '/' && !user;

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <>
      {/* Apply conditional padding on the main content wrapper */}
      <div style={bodyStyle}>
        {/* Only render header if not on hero page or user is signed in */}
        {!shouldHideHeader && (
          <header className="fixed top-0 left-0 w-full p-4 shadow-sm bg-white dark:bg-gray-900 flex justify-between items-center px-6 md:px-10 z-50">
            {/* Logo */}
            <Link to={"/"} className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/create-trip">
                    <Button variant="outline" className="rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      + Create Trip
                    </Button>
                  </Link>
                  <Link to="/my-trips">
                    <Button variant="outline" className="rounded-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      My Trips
                    </Button>
                  </Link>
                  <Popover>
                    <PopoverTrigger>
                      <img
                        src={user?.picture}
                        className="h-[40px] w-[40px] rounded-full border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
                        alt="User profile"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                      <h2
                        className="cursor-pointer text-red-500 hover:underline"
                        onClick={() => {
                          googleLogout();
                          localStorage.clear();
                          setUser(null); // Remove user data from state and localStorage
                          navigate("/");
                        }}
                      >
                        Sign Out
                      </h2>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Button onClick={() => setOpenDialog(true)} className="bg-[#f56551] hover:bg-[#e55345] text-white">
                  Sign In
                </Button>
              )}
            </nav>

            {/* Mobile Menu */}
            <button className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
            </button>

            {mobileMenu && (
              <div
                className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col space-y-4 md:hidden"
                style={{ zIndex: 999 }}
              >
                {user ? (
                  <>
                    <Link to="/create-trip">
                      <Button variant="outline" className="w-full">+ Create Trip</Button>
                    </Link>
                    <Link to="/my-trips">
                      <Button variant="outline" className="w-full">My Trips</Button>
                    </Link>
                    <Button
                      onClick={() => {
                        googleLogout();
                        localStorage.clear();
                        setUser(null); // Remove user from state
                        navigate("/");
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setOpenDialog(true)} className="w-full bg-[#f56551] hover:bg-[#e55345] text-white">
                    Sign In
                  </Button>
                )}
              </div>
            )}

            {/* Sign-In Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="bg-white dark:bg-gray-900">
                <DialogHeader>
                  <DialogDescription>
                    <img src={logo} alt="logo" className="h-12 mx-auto" />
                    <h2 className="font-bold text-lg mt-7 text-center text-gray-900 dark:text-white">
                      Sign In With Google
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Sign into the app with Google authentication securely.
                    </p>
                    <Button
                      onClick={handleLogin}
                      className="w-full mt-5 bg-white text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 flex items-center gap-2 py-2 px-4 rounded-lg shadow-md"
                    >
                      <FcGoogle className="text-2xl" />
                      Sign In With Google
                    </Button>
                    <Button variant="outline" className="w-full mt-2" onClick={() => setOpenDialog(false)}>
                      Close
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </header>
        )}
      </div>
    </>
  );
}

export default Header;
