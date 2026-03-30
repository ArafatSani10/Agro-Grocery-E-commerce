import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    FiHome,
    FiPieChart,
    FiUsers,
    FiSettings,
    FiBell,
    FiMail,
    FiCalendar,
    FiBarChart2,
    FiMenu,
    FiChevronLeft,
    FiUser,
    FiLogOut,
    FiChevronDown,
    FiSearch
} from 'react-icons/fi';
import logo from "../../assets/icon/logo-color.png";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const location = useLocation();

    // Handle responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location]);

const menuItems = [
    { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: FiHome, 
        path: '/admin/dashboard' 
    },
    { 
        id: 'category', 
        label: 'Create Category', 
        icon: FiPieChart, 
        path: '/admin/create-category' 
    },
    { 
        id: 'manage-category', 
        label: 'Manage Category', 
        icon: FiPieChart, 
        path: '/admin/manage-category' 
    },

    { 
        id: 'Create Products', 
        label: 'Create Products', 
        icon: FiPieChart, 
        path: '/admin/create-products' 
    },

    { 
        id: 'manage-products', 
        label: 'Manage Products', 
        icon: FiPieChart, 
        path: '/admin/manage-products' 
    },
    { 
        id: 'cupon', 
        label: 'Cupon Code', 
        icon: FiCalendar, 
        path: '/admin/cupon-code' 
    },
    { 
        id: 'users', 
        label: 'Users', 
        icon: FiUsers, 
        path: '/admin/users' 
    },
];

    const sidebarVariants = {
        open: {
            width: '280px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        collapsed: {
            width: '80px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        mobileOpen: {
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        mobileClosed: {
            x: '-100%',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        }
    };

    const menuItemVariants = {
        open: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -10 }
    };

    const overlayVariants = {
        open: { opacity: 1, pointerEvents: 'auto' },
        closed: { opacity: 0, pointerEvents: 'none' }
    };

    const profileDropdownVariants = {
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileSidebarOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-green-600 to-green-500 p-2 rounded-lg shadow-lg"
            >
                <FiMenu size={20} className="text-white" />
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        variants={overlayVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile */}
            <motion.aside
                variants={sidebarVariants}
                initial={false}
                animate={window.innerWidth < 768
                    ? (mobileSidebarOpen ? 'mobileOpen' : 'mobileClosed')
                    : (sidebarOpen ? 'open' : 'collapsed')
                }
                className="fixed md:relative z-50 h-screen overflow-hidden flex flex-col"
                style={{
                    background: 'linear-gradient(180deg, #166534 0%, #15803d 50%, #16a34a 100%)'
                }}
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 -left-4 w-40 h-40 bg-yellow-300 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 -right-4 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-300 rounded-full filter blur-3xl"></div>
                </div>

                {/* Logo Area */}
                <div className="relative flex items-center justify-between p-4 border-b border-white/20 h-16">
                    <AnimatePresence mode="wait">
                        {(sidebarOpen || mobileSidebarOpen) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center"
                            >
                                <Link to="/" className="no-underline">
                                    <img 
                                        src={logo} 
                                        alt="Logo" 
                                        className="h-10 w-auto object-contain brightness-0 invert"
                                    />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {window.innerWidth >= 768 && (
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white relative z-10"
                        >
                            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
                        </motion.button>
                    )}

                    {window.innerWidth < 768 && mobileSidebarOpen && (
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileSidebarOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white relative z-10"
                        >
                            <FiChevronLeft size={20} />
                        </motion.button>
                    )}
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isSelected = location.pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="block"
                            >
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-white text-green-700 shadow-lg shadow-green-900/20'
                                            : 'text-white/80 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    <AnimatePresence mode="wait">
                                        {(sidebarOpen || mobileSidebarOpen) && (
                                            <motion.span
                                                variants={menuItemVariants}
                                                initial="collapsed"
                                                animate="open"
                                                exit="collapsed"
                                                className="text-sm font-medium whitespace-nowrap flex-1"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {item.badge && (sidebarOpen || mobileSidebarOpen) && (
                                        <span className="bg-white text-green-600 text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="relative p-4 border-t border-white/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30 shadow-lg">
                            <FiUser size={20} className="text-white" />
                        </div>
                        <AnimatePresence mode="wait">
                            {(sidebarOpen || mobileSidebarOpen) && (
                                <motion.div
                                    variants={menuItemVariants}
                                    initial="collapsed"
                                    animate="open"
                                    exit="collapsed"
                                    className="flex-1"
                                >
                                    <p className="text-sm font-semibold text-white">John Admin</p>
                                    <p className="text-xs text-white/60">john@admin.com</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                {/* Top Header with Search, Notifications & Profile */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm border-b border-green-100 px-4 md:px-6 py-3 flex items-center justify-between h-16 sticky top-0 z-30"
                >
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative group">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 group-hover:text-green-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-white/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 hover:bg-green-100 rounded-xl relative transition-all duration-200 group"
                            >
                                <FiBell size={20} className="text-green-600 group-hover:text-green-700" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></span>
                            </motion.button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 hover:bg-green-100 rounded-xl transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <span className="text-white font-semibold text-sm">JA</span>
                                </div>
                                <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-green-600">John Admin</span>
                                <FiChevronDown
                                    size={16}
                                    className={`text-gray-500 group-hover:text-green-600 transition-all duration-200 ${
                                        profileDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </motion.button>

                            {/* Profile Dropdown Menu */}
                            <AnimatePresence>
                                {profileDropdownOpen && (
                                    <motion.div
                                        variants={profileDropdownVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-green-100 py-1 shadow-lg z-50"
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <FiUser size={16} className="text-green-500" />
                                            <span>Your Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <FiSettings size={16} className="text-green-500" />
                                            <span>Settings</span>
                                        </Link>
                                        <hr className="my-1 border-green-100" />
                                        <button
                                            onClick={() => {
                                                setProfileDropdownOpen(false);
                                                // Handle logout
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FiLogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.header>

                {/* Content Area - Outlet */}
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

