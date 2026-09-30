import test from "node:test";
import { equal, ok } from "node:assert/strict";
import request from "supertest";

import app from "../server";

test("GET /health works", async () => {
  const response = await request(app).get("/health");

  equal(response.statusCode, 200);
  equal(response.body.status, "ok");
});

test("GET /api/items returns an array", async () => {
  const response = await request(app).get("/api/items");

  equal(response.statusCode, 200);
  ok(Array.isArray(response.body));
});

test("GET /api/items/:id returns an item", async () => {
  const response = await request(app).get("/api/items/1");

  equal(response.statusCode, 200);
  equal(response.body.id, 1);
});

test("GET unknown item returns 404", async () => {
  const response = await request(app).get("/api/items/999999");

  equal(response.statusCode, 404);
});

test("POST /api/items creates an item", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      name: "Automated Test Item",
      description: "Created by automated test"
    });

  equal(response.statusCode, 201);
  equal(response.body.name, "Automated Test Item");
  ok(response.body.id);
});

test("POST /api/items rejects missing name", async () => {
  const response = await request(app)
    .post("/api/items")
    .send({
      description: "Missing name"
    });

  equal(response.statusCode, 400);
});

test("PUT /api/items/:id updates an item", async () => {
  const response = await request(app)
    .put("/api/items/1")
    .send({
      name: "Updated Item",
      description: "Updated by automated test"
    });

  equal(response.statusCode, 200);
  equal(response.body.name, "Updated Item");
});

test("DELETE /api/items/:id deletes an item", async () => {
  const response = await request(app)
    .delete("/api/items/2");

  equal(response.statusCode, 200);
  equal(response.body.message, "Item deleted");
});