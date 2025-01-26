import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../utils/validation";
import { LoginRequest } from "../api/interfaces/loginRequest";
import { getUserData, login } from "../api/services/auth/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const _token = await login(data.email, data.password);
      if (_token) {
        localStorage.setItem("token", _token);

        // si el login es exitoso actualizamos el redux con el userData
        const userData = await getUserData();

        dispatch(
          loginSuccess({
            token: _token,
            user: userData,
          })
        );
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching data:", error.message);
        setError("email", {
          type: "manual",
          message: "Correo o contraseña incorrectos",
        });
      } else {
        console.error("Error desconocido:", error);
        setError("email", {
          type: "manual",
          message: "Ha ocurrido un error inesperado.",
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de correo electrónico */}
          <div>
            <input
              id="email-address"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className={`block w-full rounded-t-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-3 font-bold">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className={`block w-full rounded-b-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-3 font-bold">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Checkbox de "Remember Me" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Botón de envío */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
