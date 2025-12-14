function SweetCard({ sweet, onPurchase }) {
  return (
    <div className="border rounded p-4 shadow">
      <h2 className="text-lg font-bold">{sweet.name}</h2>
      <p>Category: {sweet.category}</p>
      <p>Price: ₹{sweet.price}</p>
      <p>Stock: {sweet.quantity}</p>

      <button
        disabled={sweet.quantity === 0}
        onClick={() => onPurchase(sweet._id)}
        className={`mt-2 px-4 py-2 text-white ${
          sweet.quantity === 0
            ? "bg-gray-400"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        Purchase
      </button>
    </div>
  );
}

export default SweetCard;
