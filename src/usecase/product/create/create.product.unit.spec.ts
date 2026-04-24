import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const input = {
      name: "Nintendo Switch 2",
      price: 4321,
      type: "a",
    };

    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product-b", async () => {
    const input = {
      name: "Playstation 5",
      price: 4721,
      type: "b",
    };

    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should not create a product with invalid type", async () => {
    const input = {
      name: "XBOX Series X",
      price: 4999,
      type: "invalid",
    };

    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = productCreateUseCase.execute(input);

    await expect(output).rejects.toThrowError("Product type not supported");
  });

  it("should not create a product with invalid price", async () => {
    const input = {
      name: "XBOX Series X",
      price: -1,
      type: "a",
    };

    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = productCreateUseCase.execute(input);

    await expect(output).rejects.toThrowError(
      "Price must be greater than zero",
    );
  });

  it("should not create a product with invalid name", async () => {
    const input = {
      name: "",
      price: 1000,
      type: "a",
    };

    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = productCreateUseCase.execute(input);

    await expect(output).rejects.toThrowError("Name is required");
  });
});
