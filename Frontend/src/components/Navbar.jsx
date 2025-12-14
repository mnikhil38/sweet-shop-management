import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex justify-between p-4 bg-pink-600 text-white">
      <h1 className="font-bold">🍬 Sweet Shop</h1>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
