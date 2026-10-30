// Verifies public enquiry validation before requests reach business services or PostgreSQL.
import { describe, expect, it } from "vitest";
import {
  enquiryAdminUpdateSchema,
  enquiryNoteSchema,
  enquirySchema,
} from "../src/validators/enquiry.schema";

const validEnquiry = {
  customerName: "Ravi Kumar",
  phone: "9876543210",
  email: "",
  location: "Aruppukottai",
  pinCode: "626101",
  preferredDate: "",
  instructions: "",
  items: [
    { productId: "00000000-0000-4000-8000-000000000001", quantity: 100, unit: "bags" },
  ],
};

describe("enquirySchema", () => {
  it("accepts a valid multi-product quotation enquiry", () => {
    expect(enquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("rejects an enquiry without any products", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, items: [] }).success).toBe(false);
  });

  it("rejects invalid Indian mobile numbers and PIN codes", () => {
    expect(
      enquirySchema.safeParse({ ...validEnquiry, phone: "123", pinCode: "12" }).success,
    ).toBe(false);
  });
});

describe("admin enquiry validation", () => {
  it("accepts a status or follow-up update", () => {
    expect(enquiryAdminUpdateSchema.safeParse({ status: "CONTACTED" }).success).toBe(
      true,
    );
    expect(
      enquiryAdminUpdateSchema.safeParse({ followUpAt: "2026-10-30T09:30:00.000Z" })
        .success,
    ).toBe(true);
  });

  it("rejects an empty workflow update and an empty note", () => {
    expect(enquiryAdminUpdateSchema.safeParse({}).success).toBe(false);
    expect(enquiryNoteSchema.safeParse({ note: "" }).success).toBe(false);
  });
});
