const express = require("express");
const logger = require("./server/middleware/logger");

const app = express();
const PORT = 3000;

// ===============================
// Middleware
// ===============================

// Read JSON data from requests
app.use(express.json());

// Serve static files from public folder
app.use(express.static("public"));

// Request Logger Middleware
app.use(logger);

// Allow requests from Live Server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
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
// Temporary Lost and Found Data
// ===============================

let items = [
    {
        id: "1",
        name: "Black Wallet",
        description: "Black leather wallet found near library",
        location: "Library",
        status: "Lost"
    },
    {
        id: "2",
        name: "Blue Water Bottle",
        description: "Blue water bottle found in classroom",
        location: "Block A Classroom",
        status: "Found"
    }
];

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

app.get("/api/items", (req, res) => {
    res.json({
        success: true,
        message: "Lost and Found items retrieved successfully",
        items: items
    });
});

// ===============================
// GET - Item by ID
// ===============================

app.get("/api/items/:id", (req, res) => {

    const item = items.find(
        i => i.id === req.params.id
    );

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
});

// ===============================
// POST - Add New Item
// ===============================

app.post("/api/items", (req, res) => {

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

    const newItem = {
        id: String(items.length + 1),
        name: name,
        description: description,
        location: location,
        status: status
    };

    items.push(newItem);

    res.status(201).json({
        success: true,
        message: "Item reported successfully",
        item: newItem
    });
});

// ===============================
// PUT - Update Item
// ===============================

app.put("/api/items/:id", (req, res) => {

    const item = items.find(
        i => i.id === req.params.id
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    const {
        name,
        description,
        location,
        status
    } = req.body;

    if (name) {
        item.name = name;
    }

    if (description) {
        item.description = description;
    }

    if (location) {
        item.location = location;
    }

    if (status) {
        item.status = status;
    }

    res.json({
        success: true,
        message: "Item updated successfully",
        item: item
    });
});

// ===============================
// DELETE - Delete Item
// ===============================

app.delete("/api/items/:id", (req, res) => {

    const itemIndex = items.findIndex(
        i => i.id === req.params.id
    );

    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    const deletedItem = items.splice(
        itemIndex,
        1
    );

    res.json({
        success: true,
        message: "Item deleted successfully",
        item: deletedItem[0]
    });
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