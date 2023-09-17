"use client";

import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useMemo } from "react";
import ArticleIcon from "@/components/icons/ArticleIcon";
import CollapsIcon from "@/components/icons/CollapsIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import LogoIcon from "@/components/icons/Logo";
import LogoutIcon from "@/components/icons/LogoutIcon";
import UsersIcon from "@/components/icons/UsersIcon";

const menuItems = [
  { id: 1, label: "UW Essays", icon: ArticleIcon, link: "/" },
  // { id: 2, label: "Home", icon: HomeIcon, link: "/posts" },
  // { id: 3, label: "Manage Users", icon: UsersIcon, link: "/users" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === pathname),
    [pathname],
  );

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    },
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    },
  );

  const getNavItemClasses = (menu: {
    id: number;
    label: string;
    link: string;
  }) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu && activeMenu.id === menu.id,
      },
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <LogoIcon />
            <span
              className={classNames("mt-2 text-lg font-medium text-text", {
                hidden: toggleCollapse,
              })}
            >
              Logo
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            return (
              <div className={classes} key={menu.id}>
                <Link href={menu.link}>
                  <div className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: "2.5rem" }}>
                      <Icon />
                    </div>
                    {!toggleCollapse && (
                      <span
                        className={classNames(
                          "text-md font-medium text-text-light",
                        )}
                      >
                        {menu.label}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`${getNavItemClasses({
          id: 0,
          label: "",
          link: "",
        })} px-3 py-4`}
      >
        <div style={{ width: "2.5rem" }}>
          <LogoutIcon />
        </div>
        {!toggleCollapse && (
          <span className={classNames("text-md font-medium text-text-light")}>
            Logout
          </span>
        )}
      </div>
    </div>
  );
}
