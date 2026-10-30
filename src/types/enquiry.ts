// Defines application-facing enquiry inputs, responses, and safe admin-list records.
import type { z } from "zod";
import type { enquirySchema } from "@/validators/enquiry.schema";

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryCreated = {
  id: string;
  reference: string;
};

export type EnquiryListItem = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  location: string;
  status: string;
  createdAt: string;
  itemSummary: string;
};
