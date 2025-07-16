/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button";
import DevSphereLogo from "@src/assets/Logo/logo-white.png";
import BgLogo from "@src/assets/bg/login-form-image5.png";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@src/validationType/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@src/state/auth";
import { useMutation } from "@tanstack/react-query";
import { login } from "@src/api/service/authService";
import { AuthTypeResponse } from "@src/types/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const LoginFormV2 = () => {
  const authStore = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data: AuthTypeResponse) => {
      const roles: string[] = data.data.user.roles.map((role) => role.name!);
      authStore.setAuth(data?.data?.token, roles, data.data.user);
    },
    onError: () => {
      toast.error("Invalid Username or Password");
    },
  });

  const form = useForm<LoginSchemaType>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onValid(data: LoginSchemaType) {
    mutate(data);
  }

  function onInvalid(errors: any) {
    const messages = Object.values(errors)
      .map((err: any) => err.message)
      .filter(Boolean); // Only get valid messages

    if (messages.length > 0) {
      if (errors?.username && errors?.password) {
        toast.error("Please enter your Username & Password");
      } else if (errors?.username) {
        toast.error("Please enter your Username");
      } else if (errors?.password) {
        toast.error("Please enter your Password");
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-full min-w-screen bg-[radial-gradient(at_70%_20%,_theme(colors.sky.300),_theme(colors.blue.500),_theme(colors.indigo.900))] px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-black/70 text-white shadow-lg ">
        <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
          <div style={{ backdropFilter: "blur(2px)" }}>
            <div className="w-full py-16 px-14 md:px-24 shadow-lg">
              <div className="flex flex-col justify-center items-center gap-6 pb-10">
                <Link to="https://dev-sphere.net/en" target="_blank">
                  <img
                    alt="logo"
                    className="md:mx-10 max-h-28"
                    src={DevSphereLogo}
                  ></img>
                </Link>
                <div className="text-slate-200 text-xl md:text-2xl font-bold">
                  E-CATALOG
                </div>
              </div>

              <div className="flex flex-col gap-6 custom-input">
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="relative">
                      <InputText
                        {...field}
                        type="text"
                        className="placeholder-gray-300 text-white w-full h-12 px-4 py-3 bg-transparent border-0 border-b-2 border-white focus:border-blue-500 focus:outline-none focus:ring-0 rounded-none"
                        placeholder="Username"
                        invalid={!!fieldState.error}
                        unstyled
                      />
                    </div>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="relative w-full">
                      <Password
                        {...field}
                        placeholder="Password"
                        inputClassName="placeholder-gray-300 text-white w-full h-12 px-4 py-3 bg-transparent border-0 border-b-2 border-white focus:border-blue-500 focus:outline-none focus:ring-0 rounded-none"
                        toggleMask
                        feedback={false}
                        onChange={(e) => field.onChange(e.target.value)}
                        invalid={!!fieldState.error}
                        unstyled
                      />
                    </div>
                  )}
                />

                <div className="mt-2">
                  <Button
                    disabled={isPending}
                    label="Login"
                    type="submit"
                    outlined
                    rounded
                    size="small"
                    className="w-full"
                    onClick={() => onInvalid}
                  />
                </div>
                <div className="text-slate-300 text-xs text-center">
                  All rights reserved. Powered by{" "}
                  <Link
                    to="https://dev-sphere.net/en"
                    target="_blank"
                    className="font-semibold text-slate-200 hover:underline cursor-pointer hover:text-blue-500 transform duration-300"
                  >
                    DevSphere
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div
          className="hidden md:block"
          style={{
            backgroundImage: `url(${BgLogo})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoginFormV2;
