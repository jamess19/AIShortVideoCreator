"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { RegisterApi } from "@/services/user_api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [registerRequest, setRegisterRequest] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const HandleRegister = async () => {
    console.log("Registering with", registerRequest);

    const response = await RegisterApi(registerRequest);

    if(response) {
      if(response.status === "success") {
        console.log("Register successful", response.message);
        router.push("/login");
      }
      else{
        console.log("Register failed: ", response.message);
      }
    }
    else {
      console.log("Register failed");
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
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Nhập thông tin của bạn để tạo tài khoản
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
              id="username"
              type="text"
              onChange={(e) => {
                setRegisterRequest({
                  ...registerRequest,
                  username: e.target.value,
                });
              }}
              value={registerRequest.username}
              placeholder="username"
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:placeholder-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              onChange={(e) => {
                setRegisterRequest({
                  ...registerRequest,
                  password: e.target.value,
                });
              }}
              value={registerRequest.password}
              placeholder="••••••••"
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:placeholder-transparent"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nhập lại mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              onChange={(e) => {
                setRegisterRequest({
                  ...registerRequest,
                  confirmPassword: e.target.value,
                });
              }}
              value={registerRequest.confirmPassword}
              placeholder="••••••••"
              required
              className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:placeholder-transparent"
            />
          </div>
          <Button
            onClick={HandleRegister} 
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
            Đăng ký
          </Button>
          <div className="text-center text-sm mt-4 text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
