import { NavLink, useNavigate } from "react-router-dom";
import { signIn } from "../configurations/appwrite";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/context";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const {user, loginUser} = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const userEmail = formData.get("email") as string;
    const userPassword = formData.get("password") as string;
    // try {
    //   await signIn(userEmail, userPassword);
    //   navigate("/file-upload");
    // } catch (error) {
    //   console.error(error);
    //   navigate("/login");
    // }
    loginUser(userEmail, userPassword);
  }

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSignIn}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
      <p>
        Don't have an account? <NavLink to="/register">Sign up</NavLink>
      </p>
    </div>
  );
}

export default LoginPage;
