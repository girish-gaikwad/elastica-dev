import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NavDropdown from "@/components/ui/navbar/navDropdown";

export default function NavLinks() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/get_categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const links = categories;

  // Loading skeleton for a smoother user experience
  if (isLoading) {
    return (
      <div className="flex lg:justify-center lg:gap-10">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-5 w-20 bg-gray-100 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  return (
    <ul className="flex lg:justify-center lg:gap-10">
      {links.map((link) => (
        <li 
          key={link.id} 
          className="relative group"
        >
          {link.subLinks ? (
            <NavDropdown link={link} />
          ) : (
            <Link 
              href={link.path}
              className={cn(
                "font-medium text-sm py-2 px-1 block transition-colors duration-200",
                pathname === link.path
                  ? "text-emerald-950"
                  : "text-gray-700 hover:text-black"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full",
                pathname === link.path ? "w-full" : "w-0"
              )}></span>
            </Link>
          )}
        </li>
      ))}
      
      {/* Featured link with special styling */}
      {/* <li className="relative group">
        <Link 
          href="/new-arrivals"
          className={cn(
            "font-medium text-sm py-2 px-1 block transition-colors duration-200",
            pathname === "/new-arrivals"
              ? "text-amber-800"
              : "text-amber-600 hover:text-amber-800"
          )}
        >
          New Arrivals
          <span className={cn(
            "absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full",
            pathname === "/new-arrivals" ? "w-full" : "w-0"
          )}></span>
        </Link>
      </li> */}
    </ul>
  );
}