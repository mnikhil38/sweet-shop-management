const Sweet = require("../models/Sweet");

/**
 * @desc    Add a new sweet
 * @route   POST /api/sweets
 * @access  Protected
 */
exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error adding sweet" });
  }
};

/**
 * @desc    Get all sweets
 * @route   GET /api/sweets
 * @access  Protected
 */
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sweets" });
  }
};

/**
 * @desc    Search sweets by name, category, or price range
 * @route   GET /api/sweets/search
 * @access  Protected
 */
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Error searching sweets" });
  }
};

/**
 * @desc    Update sweet details
 * @route   PUT /api/sweets/:id
 * @access  Protected
 */
exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error updating sweet" });
  }
};

/**
 * @desc    Delete a sweet
 * @route   DELETE /api/sweets/:id
 * @access  Admin only
 */
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sweet" });
  }
};

/**
 * @desc    Purchase a sweet (decrease quantity)
 * @route   POST /api/sweets/:id/purchase
 * @access  Protected
 */
exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Sweet out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error purchasing sweet" });
  }
};

/**
 * @desc    Restock a sweet (increase quantity)
 * @route   POST /api/sweets/:id/restock
 * @access  Admin only
 */
exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += Number(quantity);
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error restocking sweet" });
  }
};
