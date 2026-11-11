# Test plan

## Automated layers
- Contract: valid group creation, membership authorization, expense sum validation, expense balance updates, settlement creditor-only confirmation, and unauthorized writes.
- Frontend pure logic: rupees/paise conversion, invalid precision, equal split remainder determinism, exact split validation, and the shared expense accounting vector.
- Build/typecheck: `npm run build`; contract compile/test: `npm run compile && npm run test:contracts`.

## Required manual checks
1. Connect MetaMask; verify displayed address and chain.
2. Attempt a write on the wrong chain; verify it is blocked until the user switches.
3. Create a group with valid, duplicate, zero, and malformed addresses.
4. Add an expense with equal and exact splits; reject a mismatched total.
5. Verify contract balances match the UI for the shared vector.
6. Propose settlement; ensure only creditor can confirm/reject.
7. Verify proposed/rejected states do not change balances; confirmed does.
8. Verify transaction hash and Sepolia explorer link after confirmation.
9. Verify no secrets or private user data are stored on-chain or committed.
10. Run a clean clone using `npm ci` and all test/build commands.

## Shared vector
A pays ₹900 split equally among A/B/C; B pays ₹600 split equally among A/B/C. Expected net balances: A +₹400, B +₹100, C −₹500. C proposes ₹400 to A and A confirms: A ₹0, B +₹100, C −₹100. C proposes ₹100 to B and B confirms: all ₹0.
