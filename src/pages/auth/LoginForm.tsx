import { Button } from "primereact/button";
import DevSphereLogo from "@src/assets/Logo/Logo.png";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@src/validationType/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@src/state/auth";
import { useMutation } from "@tanstack/react-query";
import { login } from "@src/api/service/authService";
import { AuthTypeResponse } from "@src/types/auth";
import { toast } from "sonner";
import FormInput from "@src/components/Form/FormInput";
import FormPassword from "@src/components/Form/FormPassword";

const LoginForm = () => {
  const { t } = useTranslation("login");
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

  async function onSubmit(data: LoginSchemaType) {
    mutate(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="p-[0.3rem] rounded-[56px] bg-gradient-to-b from-yellow-600 from-20%  to-slate-50 to-40%">
        <div className="w-full py-16 px-14 md:px-20 shadow-lg bg-white rounded-[53px]">
          <div className="flex flex-col justify-center items-center gap-6 pb-10">
            <img
              alt="logo"
              className="mr-2 min-w-[100px] h-[75px]"
              src={DevSphereLogo}
            ></img>
            <div className="text-gray-800 text-2xl font-medium">Login</div>
          </div>

          <div className="flex flex-col gap-6">
            <FormInput
              name="username"
              placeholder="Username"
              title="Username"
              control={form.control}
              required
            />
            <FormPassword
              name="password"
              placeholder="Password"
              title="Password"
              control={form.control}
              feedback={false}
              required
            />
            <Button
              disabled={isPending}
              label={t("login")}
              type="submit"
              onClick={() => onSubmit}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
