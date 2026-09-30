const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

test("GET /health works", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /api/items returns an array", async () => {
  const response = await request(app).get("/api/items");

  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body));
});

test("GET /api/items/:id returns an item", async () => {
  const response = await request(app).get("/api/items/1");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.id, 1);
});

test("GET unknown item returns 404", async () => {
  const response = await request(app).get("/api/items/999999");

  assert.equal(response.statusCode, 404);
});

test("POST /api/items creates an item", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      name: "Automated Test Item",
      description: "Created by automated test"
    });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.name, "Automated Test Item");
  assert.ok(response.body.id);
});

test("POST /api/items rejects missing name", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      description: "Missing name"
    });

  assert.equal(response.statusCode, 400);
});

test("PUT /api/items/:id updates an item", async () => {
  const response = await request(app)
    .put("/api/items/1")
    .send({
      name: "Updated Item",
      description: "Updated by automated test"
    });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.name, "Updated Item");
});

test("DELETE /api/items/:id deletes an item", async () => {
  const response = await request(app)
    .delete("/api/items/2");

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.message, "Item deleted");
});