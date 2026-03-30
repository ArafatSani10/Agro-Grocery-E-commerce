import React, { useEffect, useState, Fragment } from "react";
import logo from "../../assets/icon/logo-color.png";
import Basket from "../basket/Basket";
import SearchBar from "../searchBar/SearchBar";
import { Popover, Transition, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import Declaration from "../declaration/Declaration.js";
import { ResourcesData } from "../../fakeData/ResourcesData";
import { useDispatch, useSelector } from "react-redux";
import { isLoginAction } from "../../store/reducers/isOpenSlice";
import { authClient } from "../../lib/auth-client";
import { User, LogOut, LayoutDashboard, Settings, Layers } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navigation() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { isOpen } = useSelector((state) => state.isOpen);

  // ডাটাবেজ থেকে ক্যাটাগরি ফেচ করা
  const { data: categories, isLoading } = useCategories();
  // সাব-ক্যাটাগরি টগল করার স্টেট
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchSession();
  }, [isOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    window.location.reload();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="sticky bg-emerald-500 top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="h-16 top-bar lg:h-auto flex items-center justify-between py-4 mx-auto">
          <Link to="/" className="!no-underline mr-3 hidden xl:mr-12 md:hidden lg:block">
            <span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: " 0px", position: "relative", maxWidth: "100%", alignItems: "center" }}>
              <span style={{ boxSizing: "border-box", display: "block", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: " 0px", maxWidth: "100%", alignItems: "center" }}>
                <img className="flex items-center w-[110px] h-10" src={logo} alt="logo" />
              </span>
            </span>
          </Link>

          <SearchBar />

          <div className="hidden md:hidden md:items-center lg:flex xl:flex absolute inset-y-0 right-0 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Declaration />
            <Basket className="relative px-5 text-white text-2xl font-bold" />
            <div className="pl-5">
              {user ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="flex items-center focus:outline-none group">
                    <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold text-sm border-2 border-emerald-400 group-hover:border-white transition-all shadow-sm">
                      {user.image ? <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" /> : getInitials(user.name)}
                    </div>
                  </Menu.Button>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50/80">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider leading-none">Account</p>
                        <p className="text-sm font-bold truncate text-gray-800 mt-1">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/user/dashboard" className={classNames(active ? "bg-emerald-50 text-emerald-600" : "text-gray-700", "flex items-center px-3 py-2 text-sm rounded-lg font-medium transition-colors")}>
                              <LayoutDashboard className="mr-2.5 w-4 h-4 opacity-70" /> Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/user/settings" className={classNames(active ? "bg-emerald-50 text-emerald-600" : "text-gray-700", "flex items-center px-3 py-2 text-sm rounded-lg font-medium transition-colors")}>
                              <Settings className="mr-2.5 w-4 h-4 opacity-70" /> Settings
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="p-1.5">
                        <Menu.Item>
                          {({ active }) => (
                            <button onClick={handleLogout} className={classNames(active ? "bg-red-50 text-red-600" : "text-gray-700", "flex w-full items-center px-3 py-2 text-sm rounded-lg font-medium transition-colors")}>
                              <LogOut className="mr-2.5 w-4 h-4 opacity-70" /> Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button onClick={() => dispatch(isLoginAction(true))} className="text-white hover:text-emerald-100 transition-colors focus:outline-none">
                  <User className="w-7 h-7" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block xl:block bg-white border-b">
        <div className=" items-center justify-between flex mx-auto max-w-screen-2xl px-3 sm:px-10 h-12">
          <div className="inline-flex">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center md:justify-start md:space-x-10">
                <Popover.Group as="nav" className=" md:flex space-x-10 items-center">
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button className={classNames("group inline-flex items-center py-2 text-sm focus:outline-none text-black hover:text-emerald-600")}>
                          <span className="text-sm ">Categories</span>
                          <ChevronDownIcon className={classNames("ml-1 h-3 w-3 group-hover:text-emerald-600")} aria-hidden="true" />
                        </Popover.Button>

                        <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                          <Popover.Panel className="absolute z-10 -ml-1 mt-1 transform w-screen max-w-xs bg-white">
                            <div className="rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-y-scroll scrollbar flex-grow w-full h-[400px]">
                              <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
                                <div className="w-full max-h-full">
                                  <div className="relative grid gap-2 p-6">
                                    {isLoading ? (
                                      <p className="text-xs text-gray-400 italic">Loading...</p>
                                    ) : (
                                      categories?.map((category) => (
                                        <div key={category.id} className="w-full">
                                          {/* মেইন ক্যাটাগরি ডিজাইন */}
                                          <div className="p-2 flex items-center rounded-md hover:bg-gray-50 w-full group transition-colors">
                                            <span style={{ boxSizing: "border-box", display: "inline-block", overflow: "hidden", width: "initial", height: "initial", background: "none", opacity: "1", border: "0px", margin: "0px", padding: "0px", position: "relative", maxWidth: "100%" }}>
                                              {category.iconUrl ? (
                                                <img src={category.iconUrl} alt="" style={{ inset: "0px", boxSizing: "border-box", padding: "0px", border: "none", margin: "auto", display: "block", width: "16px", height: "16px", minWidth: "100%", maxWidth: "100%", minHeight: "100%", maxHeight: "100%" }} />
                                              ) : (
                                                <Layers className="w-4 h-4 text-gray-400" />
                                              )}
                                            </span>
                                            
                                            <div className="ml-3 inline-flex items-center justify-between w-full text-gray-700 group-hover:text-emerald-600 text-sm font-medium">
                                              <Link to={`/category/${category.path || category.id}`} className="no-underline text-inherit flex-grow">
                                                {category.name}
                                              </Link>
                                              
                                              {/* সাবক্যাটাগরি থাকলে ক্লিক আইকন দেখাবে */}
                                              {category.subCategories?.length > 0 && (
                                                <span 
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveCategoryId(activeCategoryId === category.id ? null : category.id);
                                                  }}
                                                  className={classNames(
                                                    activeCategoryId === category.id ? "rotate-90" : "",
                                                    "transition duration-300 ease-in-out inline loading-none items-end text-gray-400 p-1 hover:text-emerald-600"
                                                  )}
                                                >
                                                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M184 112l144 144-144 144"></path>
                                                  </svg>
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* সাব-ক্যাটাগরি লিস্ট (ক্লিক করলে আসবে) */}
                                          {activeCategoryId === category.id && category.subCategories?.length > 0 && (
                                            <div className="ml-8 border-l-2 border-emerald-100 mb-2">
                                              {category.subCategories.map((sub, idx) => (
                                                <Link
                                                  key={idx}
                                                  to={`/category/${sub.path || sub.name.toLowerCase()}`}
                                                  className="block px-4 py-1.5 text-[13px] text-gray-500 hover:text-emerald-600 no-underline transition-colors"
                                                >
                                                  {sub.name}
                                                </Link>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                  
                  <Link className="text-sm !text-black !no-underline hover:!text-emerald-600" to="/about-us">About Us</Link>
                  <Link className="text-sm !text-black !no-underline hover:!text-emerald-600" to="/contact-us"> Contact Us</Link>

                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button className={classNames("group bg-white rounded-md inline-flex items-center text-sm py-2 text-black hover:text-emerald-600 ")}>
                          <span className="text-sm ">Pages</span>
                          <ChevronDownIcon className={classNames("ml-1 h-3 w-3 group-hover:text-emerald-600 ")} aria-hidden="true" />
                        </Popover.Button>
                        <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                          <Popover.Panel className="absolute z-10 -ml-1 mt-1 transform w-screen max-w-xs bg-white">
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-y-scroll flex-grow scrollbar w-full h-full">
                              <div className="relative grid gap-2 px-6 py-6 ">
                                {ResourcesData.map((item, index) => (
                                  <span key={index} className="p-2 flex items-center rounded-md hover:!bg-gray-50 w-full hover:!text-emerald-600">
                                    <item.icon className="flex-shrink-0 h-4 w-4 " aria-hidden="true" />
                                    <Link to={item.href} className="!text-black inline-flex items-center justify-between ml-2 text-sm font-medium w-full !no-underline hover:!text-emerald-600">
                                      {item.name}
                                    </Link>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>

                  <Link className="relative inline-flex items-center h-6 !bg-red-100 font-serif ml-4 py-0 px-2 rounded text-sm font-medium !no-underline !text-red-500 hover:!text-emerald-600" to="/offer">
                    Offers
                    <div className="absolute flex w-2 h-2 left-auto -right-1 -top-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                  </Link>
                </Popover.Group>
              </div>
            </div>
          </div>
          <div className="flex">
            <Link to="/privacy-policy" className=" mx-4 py-2 text-sm cursor-pointer !no-underline !text-black hover:text-emerald-600">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className=" mx-4 py-2 text-sm cursor-pointer !no-underline !text-black hover:text-emerald-600">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;