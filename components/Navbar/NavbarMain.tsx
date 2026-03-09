'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavbarMain() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/discounts", label: "Discounts" },
    { href: "/blog", label: "Blog" },
  ];

  const userLinks = [
    { href: "/favourites", label: "Favourite", icon: "/icons/favourite.svg" },
    { href: "/orders", label: "Orders", icon: "/icons/orders.svg" },
    { href: "/login", label: "Sign in", icon: "/icons/auth.svg" },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down (but not at the top)
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      // Show navbar when at the top
      else if (currentScrollY < 50) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        bg-white
        text-gray-800
        border-b
        border-gray-100
        z-50
        transition-transform
        duration-300
        ease-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Main Navbar */}
      <nav className="navbar flex px-4 md:px-15 py-6 gap-6 items-center justify-between md:justify-start">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <Image
              src="/img/logos/logo.svg"
              className="w-[80px] md:w-[100px]"
              alt="Logo"
              width={100}
              height={50}
            />
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="search hidden md:block relative w-full">
          <button
            type="button"
            onClick={handleSearch}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            aria-label="Search"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
            />
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-[50px] pl-12 pr-4 rounded-full bg-[#F7F6F4] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex nav-links justify-end">
          <ul className="flex gap-5 items-center">
            {userLinks.map((link) => (
              <li key={link.href} className="grid w-15 place-items-center text-center cursor-pointer group">
                <Link href={link.href}>
                <div className="p-2 rounded-lg group-hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <img src={link.icon} alt={link.label} width={20} height={20} />
                </div>
                 <span className="text-xs font-medium hover:text-black transition-colors">
                  {link.label}
                </span>
              </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Burger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 ml-auto p-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 origin-center ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Desktop Navigation Links */}
      <div className="links hidden md:block border-t border-gray-100">
        <ul className="flex gap-8 px-15 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden "
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          bg-white
          shadow-xl
          z-40
          md:hidden
          transform
          transition-transform
          duration-300
          ease-in-out
          overflow-y-auto
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="pt-5 px-6 pb-6">
          {/* Search on Mobile */}
          <div className="mb-8">
                   {/* Logo */}
        <div className="logo mb-5">
          <Link href="/">
            <Image
              src="/img/logos/logo.svg"
              className="w-[80px] md:w-[100px]"
              alt="Logo"
              width={100}
              height={50}
            />
          </Link>
        </div>
            <div className="search relative w-full">
              <button
                type="button"
                onClick={() => {
                  handleSearch();
                  closeMenu();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                aria-label="Search"
              >
                <img src="/icons/search.svg" alt="" className="w-5 h-5 opacity-60" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    closeMenu();
                  }
                }}
                className="w-full h-[45px] pl-12 pr-4 rounded-full bg-[#F7F6F4] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Menu</h3>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Links */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Account</h3>
            <ul className="flex flex-col gap-1">
              {userLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200"
                  >
                    <img src={link.icon} alt={link.label} width={20} height={20} className="w-5 h-5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}