"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  BookCopy,
  LayoutDashboard,
  LucideIcon,
  Menu,
  Package,
  Receipt,
  ScanLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
// import ProfilePicture from "@/materials/chamomilezhi.jpg";
import Image from "next/image";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const SideBar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div>
          <Image
            src="https://s3-chamomile.s3.ap-southeast-1.amazonaws.com/chamomilezhi.jpg"
            alt="Profile Picture of Chamomile"
            className="rounded-lg w-16 cursor-pointer"
            width="64"
            height="64"
            onClick={toggleSidebar}
          ></Image>
        </div>
        {/* <h1 className={`${isSidebarCollapsed ? "hidden" : "block" }font-extrabold text-2xl`}>Chamomile</h1> */}
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        {/* links here */}
        <SidebarLink
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Package}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/pos"
          icon={ScanLine}
          label="Point of Sale"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/sales"
          icon={Receipt}
          label="Sales"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/collections"
          icon={BookCopy}
          label="Collections"
          isCollapsed={isSidebarCollapsed}
        />
        {/* <SidebarLink href="/users" icon={User} label='Users' isCollapsed={isSidebarCollapsed}/> */}
        {/* <SidebarLink href="/settings" icon={SlidersHorizontal} label='Settings' isCollapsed={isSidebarCollapsed}/> */}
        {/* <SidebarLink href="/expenses" icon={CircleDollarSign} label='Expenses' isCollapsed={isSidebarCollapsed}/> */}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? " hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; 2024-2025 ChamomileZhi
        </p>
        <p className="text-center text-xs text-gray-500">Created by Weng</p>
      </div>
    </div>
  );
};

export default SideBar;
