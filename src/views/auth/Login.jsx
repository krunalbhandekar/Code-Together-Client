import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";
import PasswordInput from "./PasswordInput";
import Button from "../../components/ui/Button";
import { onLogin } from "../../rtk/auth/action";
import cn from "../../lib/cn";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async ({ email, password }) => {
    try {
      const { user } = await dispatch(
        onLogin({ email: email.trim().toLowerCase(), password }),
      ).unwrap();
      toast.success(`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}!`);
      navigate("/app", { replace: true });
    } catch (message) {
      // Keep what the user typed so they can fix it.
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      subtitle="Welcome back! Enter your details to continue."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn("input", errors.email && "input-error")}
            {...register("email", { required: "Enter your email." })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={Boolean(errors.password)}
            {...register("password", { required: "Enter your password." })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
