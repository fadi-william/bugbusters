import api, { AxiosError } from "./axios";

// Define types for the sign-up request and response
interface SignUpRequest {
  username: string;
  password: string; // Note: This seems to be a typo; it should likely be "password"
  email: string;
}

interface SignUpResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Define types for the sign-in request and response
interface SignInRequest {
  password: string;
  email: string;
}

interface SignInResponse {
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

interface ErrorResponse {
  error: string;
}

// Function to sign up a user
export const signUp = async (
  userData: SignUpRequest,
): Promise<SignUpResponse> => {
  try {
    const response = await api.post<SignUpResponse>("/users/signup", userData);
    return response.data;
  } catch (error) {
    // Throw an error or return a default SignUpResponse
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.error ||
        "An error occurred during sign up",
    );
  }
};

// Function to sign in a user
export const signIn = async (
  credentials: SignInRequest,
): Promise<SignInResponse> => {
  try {
    const response = await api.post<SignInResponse>(
      "/users/login",
      credentials,
    );
    // Save the token to local storage
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    // Throw an error or return a default SignInResponse
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.error ||
        "An error occurred during sign in",
    );
  }
};

// Function to sign out a user
export const signOut = (): void => {
  // Remove the token from local storage
  localStorage.removeItem("token");
};
