// package
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ui
import { NavDropdownProps, SubLinkProps } from "@/components/ui/navbar/definition";
import { DropdownIcon } from "@/components/ui/assets/svg";
import { motion, AnimatePresence } from "framer-motion";

export default function NavDropdown({ link }: { link: NavDropdownProps }) {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      onMouseOver={() => setDropdown(true)}
      onMouseLeave={() => setDropdown(false)}
      className="relative"
    >
      <button className="flex items-center gap-1 py-2 px-1 text-gray-800 hover:text-black transition-colors duration-200 font-medium text-sm">
        {link.name}
        <DropdownIcon 
          className={`h-[18px] w-[18px] transition-transform duration-200 ${dropdown ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {dropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-2 z-50"
          >
            <DropdownSubLinks subLinks={link.subLinks} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownSubLinks({ subLinks }: { subLinks?: SubLinkProps[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ul className="min-w-[250px] rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl backdrop-blur-sm bg-white/95">
      {/* map subLinks */}
      {subLinks?.map((link, idx) => (
        <li key={link.path} className="relative">
          {/* check for nested sublinks */}
          {link.subLinks ? (
            <div onMouseLeave={() => setActiveIndex(null)}>
              <button
                onMouseOver={() => setActiveIndex(idx)}
                className="flex w-full items-center justify-between rounded-md px-4 py-2.5 font-medium text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors duration-150"
              >
                <span>{link.name}</span>
                <DropdownIcon className="h-[16px] w-[16px] -rotate-90 text-gray-400" />
              </button>
              
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div 
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full top-0 pl-2"
                  >
                    <DropdownSubLinks subLinks={link.subLinks} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={link.path}
              className="inline-block w-full rounded-md px-4 py-2.5 font-medium text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors duration-150"
            >
              {link.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}