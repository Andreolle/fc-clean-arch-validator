import NotificationError from "../../@shared/notification/notification.error";
import Product from "./product";

describe("Product unit tests", () => {
  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });

  it("should throw error when price is less than zero and name is empty", () => {
    try {
      new Product("123", "", -1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationError);

      if (error instanceof NotificationError) {
        expect(error.errors).toEqual([
          {
            context: "product",
            message: "Name is required",
          },
          {
            context: "product",
            message: "Price must be greater than zero",
          },
        ]);
      }
    }
  });

  it("should throw error when id is empty", () => {
    try {
      new Product("", "Product 1", 100);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationError);

      if (error instanceof NotificationError) {
        expect(error.errors).toEqual([
          {
            context: "product",
            message: "Id is required",
          },
        ]);
      }
    }
  });

  it("should throw error when name is empty", () => {
    try {
      new Product("123", "", 100);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationError);

      if (error instanceof NotificationError) {
        expect(error.errors).toEqual([
          {
            context: "product",
            message: "Name is required",
          },
        ]);
      }
    }
  });

  it("should throw error when price is less than zero", () => {
    try {
      new Product("123", "Name", -1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationError);

      if (error instanceof NotificationError) {
        expect(error.errors).toEqual([
          {
            context: "product",
            message: "Price must be greater than zero",
          },
        ]);
      }
    }
  });
});
