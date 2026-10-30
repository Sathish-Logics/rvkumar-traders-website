// Verifies commercial workflow commands before they reach transactional services.
import { describe, expect, it } from "vitest";
import {
  deliveryCreateSchema,
  orderUpdateSchema,
  paymentCreateSchema,
  quotationSchema,
} from "../src/validators/operations.schema";

const id = "00000000-0000-4000-8000-000000000001";

describe("operations validation", () => {
  it("accepts configurable per-line GST quotation data", () => {
    expect(
      quotationSchema.safeParse({
        enquiryId: id,
        transportationCharge: 1000,
        discountAmount: 250,
        items: [
          {
            productId: id,
            description: "Cement",
            quantity: 100,
            unit: "bags",
            unitRate: 1,
            taxRate: 18,
          },
        ],
      }).success,
    ).toBe(true);
  });

  it("rejects invalid quotation quantities and tax rates", () => {
    expect(
      quotationSchema.safeParse({
        enquiryId: id,
        items: [
          { description: "Steel", quantity: 0, unit: "kg", unitRate: 1, taxRate: 101 },
        ],
      }).success,
    ).toBe(false);
  });

  it("requires a valid delivery date, Indian driver mobile and positive payment", () => {
    expect(
      deliveryCreateSchema.safeParse({
        orderId: id,
        scheduledDate: "bad-date",
        address: "Aathipatti",
        driverPhone: "123",
      }).success,
    ).toBe(false);
    expect(
      paymentCreateSchema.safeParse({
        orderId: id,
        amount: 0,
        method: "CASH",
        receivedAt: new Date().toISOString(),
      }).success,
    ).toBe(false);
  });

  it("accepts a cancellation command with a reason", () => {
    expect(
      orderUpdateSchema.safeParse({ status: "CANCELLED", reason: "Customer request" })
        .success,
    ).toBe(true);
  });
});
