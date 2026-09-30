const express = require("express");

const app = express();

app.use(express.json());

let items = [
  {
    id: 1,
    name: "First item",
    description: "Example item"
  },
  {
    id: 2,
    name: "Second item",
    description: "Another example"
  }
];

// HOME
app.get("/", (req, res) => {
  res.json({
    message: "CRUD API is running",
    status: "ok"
  });
});

// HEALTH
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// GET ALL
app.get("/api/items", (req, res) => {
  res.json(items);
});

// GET ONE
app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find(item => item.id === id);

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  res.json(item);
});

// CREATE
app.post("/api/items", (req, res) => {
  const { name, description = "" } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "name is required"
    });
  }

  const item = {
    id: items.length
      ? Math.max(...items.map(item => item.id)) + 1
      : 1,
    name,
    description
  };

  items.push(item);

  res.status(201).json(item);
});

// UPDATE
app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find(item => item.id === id);

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const { name, description = "" } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "name is required"
    });
  }

  item.name = name;
  item.description = description;

  res.json(item);
});

// DELETE
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const deleted = items.splice(index, 1)[0];

  res.json({
    message: "Item deleted",
    item: deleted
  });
});

// LOCAL SERVER
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

// IMPORTANT FOR VERCEL + TESTS
module.exports = app;