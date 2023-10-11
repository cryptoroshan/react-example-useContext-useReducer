import { createContext, useReducer, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Create the AuthContext
const AuthContext = createContext();

// Define the initial state and reducer for managing authentication
const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// Create a custom hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if auth token exists in local storage
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch({ type: "LOGIN", payload: token });
    }
  }, []);

  // Login function
  const login = () => {
    const token = "MarcusToken";
    localStorage.setItem("authToken", token);
    dispatch({ type: "LOGIN", payload: token });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the Login component
const Login = () => {
  const { state, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.isAuthenticated) {
      console.log(state.isAuthenticated);
      navigate("/private");
    }
  }, [state]);

  return (
    <div className="flex gap-4 flex-col justify-center items-center pt-12">
      <p className="text-2xl">Login</p>
      <button className="bg-green-400 px-4 py-2" onClick={login}>
        Login
      </button>
    </div>
  );
};

// Create the Private component
const Private = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login route if not authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate("/login");
    }
  }, [state]);

  return (
    <div className="flex gap-4 flex-col justify-center items-center pt-12">
      <p className="text-2xl">Private Page</p>
      <p className="text-lg">Hi Marcus</p>
      <button className="bg-green-400 px-4 py-2" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

// Create the App component
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/private" element={<Private />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
