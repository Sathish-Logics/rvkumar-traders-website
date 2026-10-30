# Application source map

Only authored application code belongs in `src/`. Generated Prisma internals are kept in
`node_modules/@prisma/client` and must not be edited manually.

```text
src/
├── app/
│   ├── products/         Public catalogue and product detail routes
│   ├── enquiry/          Public multi-product enquiry route
│   ├── contact/          Public contact route
│   ├── admin/            Login, dashboard, enquiries and products
│   └── api/              Enquiry and product Route Handlers
├── components/           Header, Footer, ProductCard, EnquiryForm and admin UI
├── lib/                  Prisma, auth, Supabase and notification infrastructure
├── services/             Enquiry and product business workflows
├── validators/           Zod enquiry and product schemas
├── types/                Shared enquiry contracts
└── proxy.ts              Supabase session-cookie refresh at the request boundary
```

Every authored TypeScript or TSX file begins with a short comment describing its single
responsibility. Generated files, framework declarations and third-party code are excluded
because their generators overwrite manual comments.
