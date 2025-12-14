import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminPanel() {
  const [sweet, setSweet] = useState({ name: "", category: "", price: "", quantity: "" });
  const [errors, setErrors] = useState({ name: "", category: "", price: "", quantity: "" });
  const [sweetsList, setSweetsList] = useState([]);
  const [stats, setStats] = useState({ totalSweets: 0, totalCategories: 0, totalQuantity: 0 });

  useEffect(() => {
    fetchSweets();
  }, []);

  // Fetch all sweets
  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweetsList(res.data || []);
      calculateStats(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate dashboard stats
  const calculateStats = (list) => {
    const totalSweets = list.length;
    const totalCategories = new Set(list.map((s) => s.category)).size;
    const totalQuantity = list.reduce((sum, s) => sum + Number(s.quantity), 0);
    setStats({ totalSweets, totalCategories, totalQuantity });
  };

  // Field validation
  const validateField = (field, value) => {
    switch (field) {
      case "name":
      case "category":
        setErrors((prev) => ({ ...prev, [field]: value.trim() === "" ? `${field} is required` : "" }));
        break;
      case "price":
      case "quantity":
        setErrors((prev) => ({
          ...prev,
          [field]: value === "" || isNaN(value) || Number(value) <= 0 ? `${field} must be positive` : "",
        }));
        break;
      default:
        break;
    }
  };

  const handleChange = (field, value) => {
    setSweet((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Check if form is valid
  const isFormValid =
    Object.values(errors).every((err) => err === "") &&
    sweet.name.trim() &&
    sweet.category.trim() &&
    Number(sweet.price) > 0 &&
    Number(sweet.quantity) > 0;

  // Add new sweet
  const addSweet = async () => {
    if (!isFormValid) return alert("Please fill all fields correctly!");
    try {
      await API.post("/sweets", sweet);
      alert("Sweet added successfully!");
      setSweet({ name: "", category: "", price: "", quantity: "" });
      setErrors({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Error adding sweet. Try again.");
    }
  };

  // Delete sweet
  const deleteSweet = async (id) => {
    if (!window.confirm("Are you sure to delete this sweet?")) return;
    try {
      await API.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit sweet (inline prompt)
  const editSweet = async (s) => {
    const newName = prompt("Enter new name:", s.name) || s.name;
    const newCategory = prompt("Enter new category:", s.category) || s.category;
    const newPrice = Number(prompt("Enter new price:", s.price)) || s.price;
    const newQty = Number(prompt("Enter new quantity:", s.quantity)) || s.quantity;

    try {
      await API.put(`/sweets/${s._id}`, {
        name: newName,
        category: newCategory,
        price: newPrice,
        quantity: newQty,
      });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Error updating sweet");
    }
  };

  // Restock sweet
  const restockSweet = async (s) => {
    const qty = Number(s.newQty);
    if (!qty || qty <= 0) return alert("Enter valid quantity");
    try {
      await API.put(`/sweets/restock/${s._id}`, { quantity: qty });
      fetchSweets();
    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🍭 Admin Panel</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-500 text-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold">Total Sweets</h3>
            <p className="text-3xl font-bold">{stats.totalSweets}</p>
          </div>
          <div className="bg-pink-500 text-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold">Categories</h3>
            <p className="text-3xl font-bold">{stats.totalCategories}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="text-xl font-semibold">Total Quantity</h3>
            <p className="text-3xl font-bold">{stats.totalQuantity}</p>
          </div>
        </div>

        {/* Add Sweet Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Sweet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "category", "price", "quantity"].map((field) => (
              <div key={field} className="flex flex-col">
                <input
                  type={field === "price" || field === "quantity" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={sweet[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={`border p-3 rounded-xl w-full focus:outline-none transition ${
                    errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                  }`}
                />
                {errors[field] && <span className="text-red-500 text-sm mt-1">{errors[field]}</span>}
              </div>
            ))}
          </div>
          <button
            onClick={addSweet}
            disabled={!isFormValid}
            className={`mt-6 w-full text-white font-bold py-3 rounded-2xl shadow-lg transition transform hover:-translate-y-1 ${
              isFormValid
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Sweet
          </button>
        </div>

        {/* Sweets Table */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">All Sweets</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sweetsList.length > 0 ? (
                sweetsList.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{s.name} (Stock: {s.quantity})</td>
                    <td className="px-6 py-4 whitespace-nowrap">{s.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{s.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <button
                        onClick={() => editSweet(s)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSweet(s._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        className="border px-2 py-1 rounded w-16"
                        onChange={(e) => (s.newQty = e.target.value)}
                      />
                      <button
                        onClick={() => restockSweet(s)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No sweets added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
