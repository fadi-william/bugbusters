import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { signIn } from "@/services/users";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useState } from "react"; // Import useState for alert management
import { Alert } from "@/components/ui/alert"; // Import the SHDCN alert component
import { useAuth } from "@/contexts/use/auth";

// Define the form schema with required fields
const schema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { setLoggedIn } = useAuth();
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for alert message

  const onSubmit = async (data: FormData) => {
    try {
      const user = await signIn(data);
      console.log(user);
      navigate("/"); // Navigate to home on successful login
      setLoggedIn(true);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setAlertMessage(errorMessage); // Set alert message on error
      console.error(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
            {alertMessage && (
              <Alert variant="destructive">{alertMessage}</Alert>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <Link to="/signup">
                  <Button className="w-full" variant="secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
