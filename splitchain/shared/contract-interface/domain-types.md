# Canonical domain interface
See `frontend/src/types/domain.ts`. IDs and paise are `bigint` in the browser and serialized as decimal strings in JSON. Split modes: `EQUAL`, `EXACT`. Settlement states: `PROPOSED`, `CONFIRMED`, `REJECTED`, `CANCELLED` (on-chain numeric values 0–3; v1 currently creates only 0–2).
