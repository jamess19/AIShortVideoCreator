"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Circle } from "lucide-react";
import { useState } from "react";
import { LogInApi } from "@/services/user_api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [loginRequest, setLoginRequest] = useState({
    username: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const HandleLogin = async () => {
    try{
      setIsLoggingIn(true);
      const response = await LogInApi(loginRequest);

      if(response) {
        if(response.status_code === 200) {
          sessionStorage.setItem("accessToken", response.access_token);
          sessionStorage.setItem("username", response.username);

          toast.success("Đăng nhập thành công!"); 
          router.push("/statistic");
        }
        else{
          toast.error(response.message || "Đăng nhập thất bại, vui lòng thử lại.");
        }
      }
      else {
        toast.error(response.message || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    }
    catch (error) {
      toast.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    }
    finally {
      setIsLoggingIn(false);
    }
  };


  return (
    <div className="w-full max-w-md px-4">
      <Card className="w-full shadow-md bg-white">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-purple-600">VideoAI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Nhập thông tin đăng nhập của bạn để truy cập tài khoản
          </p>
        </div>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tên đăng nhập
            </label>
            <Input
              type="text"
              value={loginRequest.username}
              onChange={(e) => setLoginRequest({ ...loginRequest, username: e.target.value })}
              id="username"
              placeholder="username"
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:placeholder-transparent"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mật khẩu
              </label>
              <Link
                href="#"
                className="text-sm text-purple-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={loginRequest.password}
              onChange={(e) => setLoginRequest({ ...loginRequest, password: e.target.value })}
              placeholder="••••••••"
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:placeholder-transparent"
            />
          </div>
          
          {!isLoggingIn ? <Button
            onClick={HandleLogin} 
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
            Đăng nhập
          </Button>
          : (
            <Button
              disabled
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
            >
              <Circle className="animate-spin h-5 w-5 mr-2" />
              Đang đăng nhập...
            </Button>
          )}
          <div className="text-center text-sm mt-4 text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              Đăng ký
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
