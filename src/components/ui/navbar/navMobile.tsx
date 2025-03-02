// package
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ui
import Logo from "@/components/ui/assets/logo";
import Button from "@/components/ui/button";
import {
  CartIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  NotificationCount,
  SearchIcon,
  WishlistIcon,
  YoutubeIcon,
} from "@/components/ui/assets/svg";

// lib
import { cn } from "@/lib/utils";

// This would typically come from your API like in NavLinks
const links = [
  {
    id: "home",
    path: "/",
    name: "Home",
  },
  {
    id: "shop",
    path: "/shop",
    name: "Shop",
  },
  {
    id: "product",
    path: "/product",
    name: "Product",
  },
  {
    id: "new-arrivals",
    path: "/new-arrivals",
    name: "New Arrivals",
  },
  {
    id: "contact-us",
    path: "/contact-us",
    name: "Contact Us",
  },
];

export default function NavMobile({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="grid h-full grid-cols-[85fr_15fr] md:grid-cols-[70fr_30fr]">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex h-full flex-col justify-between bg-white p-6 overflow-y-auto"
            >
              {/* Top section */}
              <div className="flex flex-col gap-6">
                {/* Logo and close button */}
                <div className="flex items-center justify-between">
                  <Logo />
                  <button 
                    onClick={onClick}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <CloseIcon className="w-6 text-gray-800" />
                  </button>
                </div>

                {/* Search input */}
                <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 px-4 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all duration-200">
                  <label htmlFor="mobile-search" className="cursor-pointer text-gray-500">
                    <SearchIcon />
                  </label>
                  <input
                    id="mobile-search"
                    name="mobile-search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-full w-full font-medium text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder="Search products..."
                  />
                  {searchValue && (
                    <button 
                      onClick={() => setSearchValue("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Navigation links */}
                <ul className="grid grid-cols-1 -mx-4">
                  {links.map((link, index) => (
                    <motion.li
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      key={link.id}
                      className="border-b border-gray-100"
                    >
                      <Link
                        href={link.path}
                        className={cn(
                          "flex justify-between items-center px-4 py-4 font-medium text-gray-800",
                          link.id === "new-arrivals" && "text-amber-600"
                        )}
                        onClick={onClick}
                      >
                        {link.name}
                        {link.id === "new-arrivals" && (
                          <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">New</span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Bottom section */}
              <div className="flex flex-col gap-6 mt-6">
                {/* Cart & wishlist */}
                <ul className="bg-gray-50 rounded-lg -mx-2">
                  <li>
                    <Link
                      href="/cart"
                      className="flex items-center justify-between px-4 py-4 border-b border-gray-100"
                      onClick={onClick}
                    >
                      <span className="font-medium text-gray-800">
                        Shopping Bag
                      </span>

                      <div className="flex items-center gap-2">
                        <CartIcon className="w-5 h-5" />
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full text-xs flex items-center justify-center">
                          6
                        </span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between px-4 py-4"
                      onClick={onClick}
                    >
                      <span className="font-medium text-gray-800">
                        Saved Items
                      </span>

                      <div className="flex items-center gap-2">
                        <WishlistIcon className="w-5 h-5" />
                        <span className="w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center">
                          12
                        </span>
                      </div>
                    </Link>
                  </li>
                </ul>

                {/* Sign in/Join buttons */}
                <div className="flex flex-col gap-3">
                  <Button 
                    width="full" 
                    fontSize="sm" 
                    className="py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    Sign In
                  </Button>
                  <Link 
                    href="/signup" 
                    className="py-3 border border-gray-200 text-center rounded-lg font-medium text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Social media */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                  <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-black transition-colors">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-black transition-colors">
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="YouTube" className="text-gray-600 hover:text-black transition-colors">
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full bg-black/60 backdrop-blur-sm" 
              onClick={onClick}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}