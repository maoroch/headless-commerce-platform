'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarMain() {
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    { href: "/about", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/sales", label: "Sales" },
    { href: "/discounts", label: "Discounts" },
    { href: "/blog", label: "Blog" },
  ];

  const userLinks = [
    { href: "/favourite", label: "Favourite", icon: "/icons/favourite.svg" },
    { href: "/orders", label: "Orders", icon: "/icons/orders.svg" },
    { href: "/signin", label: "Sign in", icon: "/icons/auth.svg" },
  ];

  return (
    <header className="bg-white text-gray-800">
      {/* Main Navbar */}
      <nav className="navbar flex px-4 md:px-15 py-6 gap-6 items-center justify-between md:justify-start">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <Image src="/img/logos/logo.svg" className="w-[80px] md:w-[100px]" alt="Logo" width={100} height={50} />
          </Link>
        </div>

        {/* Search Bar - Desktop Only */}
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
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-[50px] pl-12 pr-4 rounded-full bg-[#F7F6F4] focus:outline-none"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex nav-links justify-end">
          <ul className="flex gap-5 items-center">
            {userLinks.map((link) => (
              <li key={link.href} className="grid w-15 place-items-center text-center cursor-pointer">
                <img src={link.icon} alt={link.label} width={20} height={20} />
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Burger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 ml-auto"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Desktop Navigation Links */}
      <div className="links hidden md:block">
        <ul className="flex gap-8 px-15 pb-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.35)] z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-4 text-gray-600 hover:text-black transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pt-20 px-6 pb-6">
          {/* Search on Mobile */}
          <div className="mb-8">
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
                <img
                  src="/icons/search.svg"
                  alt=""
                  className="w-5 h-5 opacity-60"
                />
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
                className="w-full h-[45px] pl-12 pr-4 rounded-full bg-[#F7F6F4] focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Menu</h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 hover:text-blue-600 hover:pl-2 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Links */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Account</h3>
            <ul className="flex flex-col gap-4">
              {userLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600 hover:pl-2 transition-all"
                  >
                    <img src={link.icon} alt={link.label} width={18} height={18} />
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