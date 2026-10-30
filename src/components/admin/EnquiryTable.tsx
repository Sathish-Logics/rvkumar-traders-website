// Renders the owner-facing enquiry list with customer, material, and status details.
import type { EnquiryListItem } from "@/types/enquiry";

export function EnquiryTable({ enquiries }: { enquiries: EnquiryListItem[] }) {
  if (!enquiries.length)
    return <p className="admin-empty-state">No enquiries received yet.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Materials</th>
            <th>Location</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id}>
              <td>{enquiry.reference}</td>
              <td>
                <b>{enquiry.customerName}</b>
                <small>{enquiry.phone}</small>
              </td>
              <td>{enquiry.itemSummary}</td>
              <td>{enquiry.location}</td>
              <td>
                <span className="status-pill">
                  {enquiry.status.replaceAll("_", " ")}
                </span>
              </td>
              <td>{new Date(enquiry.createdAt).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
