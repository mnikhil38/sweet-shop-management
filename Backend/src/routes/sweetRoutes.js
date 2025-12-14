const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const Sweet = require("../models/Sweet");

// Add sweet
router.post("/", auth, async (req, res) => {
  const sweet = await Sweet.create(req.body);
  res.json(sweet);
});

// Get all sweets
router.get("/", auth, async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
});

// Search
router.get("/search", auth, async (req, res) => {
  const { name, category, min, max } = req.query;
  const sweets = await Sweet.find({
    ...(name && { name }),
    ...(category && { category }),
    ...(min && max && { price: { $gte: min, $lte: max } })
  });
  res.json(sweets);
});

// Purchase
router.post("/:id/purchase", auth, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (sweet.quantity === 0) return res.json({ msg: "Out of stock" });
  sweet.quantity--;
  await sweet.save();
  res.json(sweet);
});

// Restock (Admin)
router.post("/:id/restock", auth, admin, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  sweet.quantity += req.body.quantity;
  await sweet.save();
  res.json(sweet);
});

// Delete (Admin)
router.delete("/:id", auth, admin, async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
