"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/assets/logo";
import {
  CartIcon,
  HamburgerMenu,
  SearchIcon,
} from "@/components/ui/assets/svg";
import NavLinks from "@/components/ui/navbar/navLinks";
import NavMobile from "@/components/ui/navbar/navMobile";
import PromoSection from "@/components/ui/promo";
import { Tooltip } from "react-tooltip";
import { useRootContext } from "@/hooks/rootContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/stores/Auth";
import { Heart, LogIn, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const isRootPage = useRootContext();
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const handleOnScroll = () => {
    window.scrollY >= 32 ? setScroll(true) : setScroll(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  const checkSession = useAuthStore(state => state.checkSession);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <>
      {!open && <PromoSection />}
      <div
        className={cn(
          "sticky top-0 z-[100] transition-all duration-300 ease-in-out",
          isRootPage ? "bg-gradient-to-r from-green-100 to-green-200" : "bg-white",
          scroll && "bg-white shadow-md backdrop-blur-sm bg-white/90"
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:justify-normal">
          <div className="flex items-center gap-3 lg:basis-1/4">
            <button 
              className="lg:hidden text-gray-800 hover:text-black transition-colors" 
              onClick={() => setOpen(true)}
            >
              <HamburgerMenu className="w-6" />
            </button>

            <Logo />
          </div>

          <div className="hidden basis-2/4 lg:block">
            <NavLinks />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 lg:basis-1/4 lg:justify-end">
              <Link 
                href="/profilePage" 
                className="hidden lg:block text-gray-700 hover:text-green-600 transition-colors" 
                data-tooltip-id="profile-tooltip"
              >
                <User className="w-5 h-5 stroke-2" />
              </Link>
              <Tooltip id="profile-tooltip" place="top" content="Profile" className="text-xs font-light" />
            
              <Link 
                href="/wishlist" 
                className="hidden lg:flex items-center text-gray-700 hover:text-rose-500 transition-colors" 
                data-tooltip-id="wishlist-tooltip"
              >
                <Heart className="w-5 h-5 stroke-2" />
              </Link>
              <Tooltip id="wishlist-tooltip" place="top" content="Wishlist" className="text-xs font-light" />
            
              <Link 
                href="/cart" 
                className="flex items-center relative text-gray-700 hover:text-green-600 transition-colors" 
                data-tooltip-id="cart-tooltip"
              >
                <CartIcon className="w-6" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 text-white rounded-full text-xs flex items-center justify-center">2</span>
              </Link>
              <Tooltip id="cart-tooltip" place="top" content="Cart" className="text-xs font-light" />
            
              <button 
                type="button" 
                className="hidden lg:block text-gray-700 hover:text-red-600 transition-colors" 
                onClick={() => signOut({ callbackUrl: "/" })} 
                data-tooltip-id="signout-tooltip"
              >
                <LogOut className="w-5 h-5 stroke-2" />
              </button>
              <Tooltip id="signout-tooltip" place="top" content="Sign Out" className="text-xs font-light" />
            </div>
          ) : (
            <div className="flex items-center gap-3 lg:basis-1/4 lg:justify-end">
              <Link
                href="/login"
                className="hidden lg:flex items-center justify-center px-5 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <LogIn className="h-4 w-4 text-gray-700 mr-2" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden lg:flex items-center justify-center px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <User className="h-4 w-4 text-white mr-2" />
                Join Now
              </Link>
            </div>
          )}

          {/* mobile navbar */}
          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;