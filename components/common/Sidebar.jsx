"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  Package,
  Notebook,
  FileText,
  Tags,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import Cookies from "js-cookie";

const SIDEBAR_ITEMS = [
  {
    name: "Sản phẩm",
    icon: Package,
    color: "#8B5CF6",
    href: "/management/product",
  },
  {
    name: "Danh mục sản phẩm",
    icon: Tags,
    color: "#F59E0B",
    href: "/management/product-categories",
  },
  {
    name: "Đơn hàng",
    icon: ShoppingBag,
    color: "#EC4899",
    href: "/management/orders",
  },
  {
    name: "Bài Đăng",
    icon: Notebook,
    color: "#3B82F6",
    href: "/management/post",
  },
  {
    name: "Chỉnh sửa UI",
    icon: FileText,
    color: "#10B981",
    href: "/management/pages",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/management/login");
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
        }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div
        className="h-full backdrop-blur-md p-4 flex flex-col border-r border-gray-700"
        style={{
          background: "rgb(2, 0, 36)",
          backgroundColor:
            "linear-gradient(90deg, rgba(2, 0, 36, 1) 6%, rgba(9, 97, 121, 1) 59%, rgba(0, 212, 255, 1) 100%)",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-teal-500 transition-colors max-w-fit text-white"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap text-white"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}

          <motion.div
            className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut
              size={20}
              style={{ color: "#EF4444", minWidth: "20px" }}
            />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-4 whitespace-nowrap text-white"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
