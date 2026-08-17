const express = require("express");

const router = express.Router();

// Get all lost and found items
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Lost and Found items retrieved successfully",
        items: []
    });
});

// Get one item by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;

    res.json({
        success: true,
        message: "Item retrieved successfully",
        itemId: id
    });
});

// Add a new lost or found item
router.post("/", (req, res) => {
    const item = req.body;

    res.status(201).json({
        success: true,
        message: "Item reported successfully",
        item: item
    });
});

module.exports = router;