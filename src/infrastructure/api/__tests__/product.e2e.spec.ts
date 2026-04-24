import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(100);
    expect(response.body.id).toBeDefined();
  });

  it("should create a product-b", async () => {
    const response = await request(app).post("/product").send({
      name: "Product 2",
      price: 300,
      type: "b",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 2");
    expect(response.body.price).toBe(600);
    expect(response.body.id).toBeDefined();
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "invalid product",
    });
    expect(response.status).toBe(500);
  });

  it("should not create a product with invalid type", async () => {
    const response = await request(app).post("/product").send({
      name: "invalid product",
      price: 100,
      type: "invalid",
    });
    expect(response.status).toBe(500);
  });

  it("should not create a product with invalid price", async () => {
    const response = await request(app).post("/product").send({
      name: "invalid product",
      price: -100,
      type: "a",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const prod1 = await request(app).post("/product").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });
    expect(prod1.status).toBe(200);
    const prod2 = await request(app).post("/product").send({
      name: "Product 2",
      price: 300,
      type: "b",
    });
    expect(prod2.status).toBe(200);

    const responseList = await request(app).get("/product").send();
    expect(responseList.status).toBe(200);
    expect(responseList.body.length).toBe(2);
    expect(responseList.body[0].name).toBe("Product 1");
    expect(responseList.body[1].name).toBe("Product 2");
    expect(responseList.body[0].price).toBe(100);
    expect(responseList.body[1].price).toBe(600);
  });
});
