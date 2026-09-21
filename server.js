const express = require("express");
const mongoose = require("mongoose");
const logger = require("./server/middleware/logger");
const Item = require("./server/models/Item");

const app = express();
const PORT = 3000;

// ===============================
// MongoDB Connection
// ===============================

mongoose.connect("mongodb://127.0.0.1:27017/lost_found_campus")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error(
            "MongoDB Connection Failed:",
            error.message
        );
    });

// ===============================
// Middleware
// ===============================

app.use(express.json());

app.use(express.static("public"));

app.use(logger);

// Allow requests from Live Server
app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    next();
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {

    res.send(`
        <h1>Lost and Found Campus Portal</h1>

        <p>Server is running successfully!</p>

        <p>
            <a href="/api/items">
                View Lost and Found Items
            </a>
        </p>
    `);

});

// ===============================
// GET - All Items
// ===============================

app.get("/api/items", async (req, res) => {

    try {

        const items = await Item.find();

        res.json({
            success: true,
            message: "Lost and Found items retrieved successfully",
            items: items
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve items",
            error: error.message
        });

    }

});

// ===============================
// GET - Item by ID
// ===============================

app.get("/api/items/:id", async (req, res) => {

    try {

        const item = await Item.findById(req.params.id);

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }

        res.json({
            success: true,
            message: "Item retrieved successfully",
            item: item
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Invalid item ID"
        });

    }

});

// ===============================
// POST - Add New Item
// ===============================

app.post("/api/items", async (req, res) => {

    try {

        const {
            name,
            description,
            location,
            status
        } = req.body;

        if (
            !name ||
            !description ||
            !location ||
            !status
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide name, description, location and status"
            });

        }

        const newItem = new Item({
            name: name,
            description: description,
            location: location,
            status: status
        });

        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            message: "Item reported successfully",
            item: savedItem
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create item",
            error: error.message
        });

    }

});

// ===============================
// PUT - Update Item
// ===============================

app.put("/api/items/:id", async (req, res) => {

    try {

        const {
            name,
            description,
            location,
            status
        } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                location,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }

        res.json({
            success: true,
            message: "Item updated successfully",
            item: updatedItem
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Failed to update item",
            error: error.message
        });

    }

});

// ===============================
// DELETE - Delete Item
// ===============================

app.delete("/api/items/:id", async (req, res) => {

    try {

        const deletedItem = await Item.findByIdAndDelete(
            req.params.id
        );

        if (!deletedItem) {

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }

        res.json({
            success: true,
            message: "Item deleted successfully",
            item: deletedItem
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Invalid item ID"
        });

    }

});

// ===============================
// 404 Error Handler
// ===============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});

// ===============================
// General Error Handler
// ===============================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});