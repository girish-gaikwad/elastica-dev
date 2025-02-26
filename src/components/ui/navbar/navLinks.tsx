import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import NavDropdown from "@/components/ui/navbar/navDropdown";

export default function NavLinks() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/get_categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const links = categories

  return (
    <ul className="flex lg:justify-center lg:gap-10">
      {links.map((link) => (
        <li key={link.id} className={cn("font-inter text-sm font-medium text-[#141718] hover:opacity-100", pathname !== link.path && "opacity-70")}>
          {link.subLinks ? <NavDropdown link={link} /> : <Link href={link.path}>{link.name}</Link>}
        </li>
      ))}
    </ul>
  );
}
