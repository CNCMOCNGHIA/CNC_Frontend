"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme } from "@/constants/theme";
import { login } from "@/services/authentication";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await login(username, password);

      if (result?.resultStatus !== "Success" || !result?.data) {
        toast.error("Đăng nhập thất bại, vui lòng thử lại!");
        return;
      }

      Cookies.set("token", result.data, { expires: 1 / 24, secure: true });
      toast.success("Đăng nhập thành công");
      router.push("/management/product");
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${theme.colors.bgSecondary} ${theme.colors.lightText}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card className="bg-[#1e1e1e] border-[#333] text-white">
          <CardHeader>
            <CardTitle
              className={`text-center text-2xl ${theme.fonts.heading}`}
            >
              Đăng nhập quản trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-[#2c2c2c] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#2c2c2c] border-[#333] text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className={`w-full ${theme.colors.brand} ${theme.colors.darkText} ${theme.colors.brandHover}`}
              >
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
