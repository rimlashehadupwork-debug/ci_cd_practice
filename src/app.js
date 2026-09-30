import express from "express";

const app = express();

app.use(express.json());

let nextId = 3;

let items = [
  {
    id: 1,
    name: "First item",
    description: "Example record"
  },
  {
    id: 2,
    name: "Second item",
    description: "Another example"
  }
];

// Home
app.get("/", (req, res) => {
  res.json({
    name: "CRUD API",
    status: "ok",
    endpoints: {
      health: "GET /health",
      list: "GET /api/items",
      get: "GET /api/items/:id",
      create: "POST /api/items",
      update: "PUT /api/items/:id",
      delete: "DELETE /api/items/:id"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// READ all
app.get("/api/items", (req, res) => {
  res.json(items);
});

// READ one
app.get("/api/items/:id", (req, res) => {
  const item = items.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  res.json(item);
});

// CREATE
app.post("/api/items", (req, res) => {
  const { name, description = "" } = req.body ?? {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "name is required"
    });
  }

  const item = {
    id: nextId++,
    name,
    description
  };

  items.push(item);

  res.status(201).json(item);
});

// UPDATE
app.put("/api/items/:id", (req, res) => {
  const index = items.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const { name, description = "" } = req.body ?? {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "name is required"
    });
  }

  items[index] = {
    ...items[index],
    name,
    description
  };

  res.json(items[index]);
});

// DELETE
app.delete("/api/items/:id", (req, res) => {
  const index = items.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const [deleted] = items.splice(index, 1);

  res.json({
    message: "Item deleted",
    item: deleted
  });
});

export default app;