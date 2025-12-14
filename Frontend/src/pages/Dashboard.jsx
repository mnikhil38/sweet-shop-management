import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api"; // axios instance: baseURL = "http://localhost:5000"

function Dashboard() {
  const [sweets, setSweets] = useState([]);

  // Fetch sweets from backend
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await API.get("/sweets");
        setSweets(res.data);
      } catch (err) {
        console.error("Error fetching sweets:", err);
      }
    };
    fetchSweets();
  }, []);

  const purchase = (id) => {
    setSweets((prevSweets) =>
      prevSweets.map((sweet) =>
        sweet._id === id && sweet.quantity > 0
          ? { ...sweet, quantity: sweet.quantity - 1 }
          : sweet
      )
    );
  };

  const SweetCard = ({ sweet, onPurchase }) => (
    <div className="relative flex flex-col items-center text-center bg-gradient-to-tr from-pink-100 to-pink-50 rounded-3xl p-5 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all">
      <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full font-bold shadow-md">
        ₹{sweet.price}
      </div>
      <h2 className="text-xl font-semibold text-pink-700 mb-2">{sweet.name}</h2>
      <p className="text-gray-600 mb-2">{sweet.description}</p>
      <p className="text-gray-700 mb-4 font-semibold">Quantity: {sweet.quantity}</p>
      <button
        onClick={() => onPurchase(sweet._id)}
        disabled={sweet.quantity === 0}
        className={`${
          sweet.quantity === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        } text-white px-6 py-2 rounded-full font-semibold transition-transform shadow-md`}
      >
        {sweet.quantity === 0 ? "Sold Out" : "Purchase"}
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-pink-50 to-pink-200 min-h-screen p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-pink-700">Sweet Shop Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sweets.length > 0 ? (
            sweets.map((s) => <SweetCard key={s._id} sweet={s} onPurchase={purchase} />)
          ) : (
            <p className="text-gray-500">No sweets available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
