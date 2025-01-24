import FileUploadPage from "./pages/FileUploadPage";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./global.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/Register";
import { AuthContext } from "./context/context";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import { account } from "./configurations/appwrite";
import { ID } from "appwrite";
import { syncUsersWithPermit } from "./configurations/permit-io";
// import { permit, syncUserWithPermit } from "./configurations/permit-io";

export interface UserInfo {
  email: string;
  password: string;
}

export interface RegisterInfo {
  email: string;
  password: string;
  name: string;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<object | null>(null);

  // Check the status of the user
  useEffect(() => {
    checkUserStatus();
  }, []);

  console.log(user);

  // Login the user
  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const loggedinUser = await account.get();
      setUser(loggedinUser);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Logout the current user
  const logoutUser = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  // Register a new user
  const registerUser = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      const resultFromUserRegistration = await account.create(ID.unique(), email, password, name);
      const result = await syncUsersWithPermit(email, name);
      const registeredUser = await account.get();
      await account.createEmailPasswordSession(email, password);
      setUser(registeredUser);
      console.log(result, resultFromUserRegistration);
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
    setLoading(false);
  };

  // Check the status of the current user
  const checkUserStatus = async () => {
    try {
      const user = await account.get();
      setUser(user);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
    checkUserStatus,
    loading
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BrowserRouter>
          <header className="flex justify-center items-center p-2 mb-4 bg-purple-400">
            <nav>
              <ul className="flex gap-5">
                {user ? (
                  <li>
                    <button onClick={logoutUser}>Log out</button>
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink to="/login">Sign in</NavLink>
                    </li>
                    <li>
                      <NavLink to="/register">Sign up</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<FileUploadPage />} path="/" />
            </Route>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<SignUpPage />} path="/register" />
          </Routes>
        </BrowserRouter>
      )}
    </AuthContext.Provider>
  );
}

export default App;
