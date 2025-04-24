import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome Crypto Dashboard Fullstack Application</h1>
      <Link
        to="/signup"
        className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-all mb-4"
      >
        Sign Up
      </Link>
      <Link
        to="/login"
        className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-all"
      >
        Login
      </Link>
    </div>
  );
}
