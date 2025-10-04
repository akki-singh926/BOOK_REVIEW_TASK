import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-lg sticky top-0 z-50 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          to="/"
          className="font-extrabold text-2xl sm:text-3xl hover:text-blue-500 transition-all duration-300"
        >
          Book App
        </Link>

        <div className="flex gap-4 items-center">
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-1 rounded-lg border shadow-sm ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                : "bg-gray-200 border-gray-300 hover:bg-gray-300"
            } text-sm font-medium transition-all duration-300`}
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          {token ? (
            <>
              <Link
                to="/add"
                className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-all duration-300"
              >
                Add Book
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow-md transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-md transition-all duration-300"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
