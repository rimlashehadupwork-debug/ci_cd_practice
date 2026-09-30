import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

test("GET /health works", async () => {
  const response = await request(app)
    .get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /api/items returns items", async () => {
  const response = await request(app)
    .get("/api/items");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("POST /api/items creates an item", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      name: "Test item",
      description: "Created automatically"
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, "Test item");
  assert.ok(response.body.id);
});

test("POST /api/items rejects missing name", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      description: "No name"
    });

  assert.equal(response.status, 400);
});

test("GET /api/items/:id works", async () => {
  const response = await request(app)
    .get("/api/items/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 1);
});

test("GET unknown item returns 404", async () => {
  const response = await request(app)
    .get("/api/items/999999");

  assert.equal(response.status, 404);
});

test("PUT /api/items/:id updates an item", async () => {
  const response = await request(app)
    .put("/api/items/1")
    .send({
      name: "Updated item",
      description: "Updated automatically"
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.name, "Updated item");
});

test("DELETE /api/items/:id deletes an item", async () => {
  const response = await request(app)
    .delete("/api/items/2");

  assert.equal(response.status, 200);
  assert.equal(response.body.message, "Item deleted");
});