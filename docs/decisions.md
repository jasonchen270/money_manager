# Engineering Decisions

## 1. Separate Income and Expense Models vs. Single Transaction Model

**Decision**: Use two separate Mongoose models (`Income` and `Expense`) with nearly identical schemas rather than a single `Transaction` model with a `type` discriminator field.

**Alternatives considered**:
- Single `Transaction` model with a `type` field (`"income"` or `"expense"`). Queries would filter by type.
- Mongoose discriminators on a base `Transaction` schema to get separate model classes backed by the same collection.

**Reasoning**: Separate models make each query explicit -- `Expense.find()` vs `Income.find()` -- without needing to remember filter conditions. It also means the two types can diverge independently if their schemas need different fields in the future.

**Tradeoffs**:
- Negative: The schema definitions are nearly identical, and the controller has duplicated add/get/delete logic for each type. Any change to shared fields (e.g., adding a `notes` field) must be applied in two places.
- Negative: Merging incomes and expenses for the dashboard and transaction history requires client-side concatenation and sorting rather than a single sorted query.
- Positive: No risk of accidentally returning expenses in an income query or vice versa.

## 2. JWT Stored in httpOnly Cookie vs. localStorage

**Decision**: Store the JWT in an httpOnly cookie set by the server, rather than returning it in the response body for the client to store in localStorage.

**Alternatives considered**:
- Return the JWT in the JSON response; store it in localStorage and attach it via an `Authorization: Bearer` header on each request.
- Store the JWT in a regular (non-httpOnly) cookie accessible to JavaScript.

**Reasoning**: httpOnly cookies are inaccessible to `document.cookie` and any JavaScript running in the browser. This eliminates the most common XSS attack vector for token theft. The browser sends the cookie automatically on every request to the same origin, so no manual header management is needed on the frontend.

**Tradeoffs**:
- Negative: The application becomes susceptible to CSRF attacks, since the browser attaches the cookie to every request automatically. No CSRF protection (e.g., CSRF tokens, `SameSite` cookie attribute) is currently implemented.
- Negative: Slightly harder to debug authentication issues since the token is not visible in JavaScript.
- Positive: Eliminates XSS-based token theft entirely.
- Positive: Simplifies frontend code -- no need to store, retrieve, or attach tokens manually.

## 3. React Context API vs. Redux for State Management

**Decision**: Use React's built-in Context API with a single `GlobalProvider` to manage all shared application state (user, incomes, expenses, error).

**Alternatives considered**:
- Redux with actions, reducers, and a centralized store.
- Zustand or Jotai for lightweight external state management.

**Reasoning**: The application state is small and flat: two arrays (incomes, expenses), a user object, and an error string. There are no deeply nested state updates, no complex derived state, and no need for middleware like Redux Thunk (async logic is handled directly in context functions via async/await). Context API avoids adding a dependency and the associated boilerplate (action types, action creators, reducers, store configuration).

**Tradeoffs**:
- Negative: Any state change in the `GlobalProvider` re-renders all consuming components, since Context does not support selecting slices of state. This is acceptable at the current scale but could become a performance issue with many components or frequent updates.
- Negative: All state logic lives in a single file (`globalContext.jsx`, ~215 lines). As the application grows, this file would become unwieldy without splitting into multiple contexts.
- Positive: Zero additional dependencies. No boilerplate beyond the provider and a custom hook.
- Positive: Easy to understand for anyone familiar with React -- no Redux-specific concepts to learn.

## 4. Full Re-fetch After Mutations vs. Optimistic Updates

**Decision**: After adding or deleting a transaction, the context re-fetches the entire income or expense list from the server rather than updating local state optimistically.

**Alternatives considered**:
- Optimistic updates: immediately add/remove the item from local state, then reconcile if the server request fails.
- Patch-based updates: apply only the server's response to local state without re-fetching everything.

**Reasoning**: Re-fetching guarantees that the client state always matches the server. This avoids subtle bugs where local state diverges from the database (e.g., if the server-side pre-save hook modifies the title capitalization, the re-fetch picks up the canonical version).

**Tradeoffs**:
- Negative: Every mutation triggers a full list fetch, which doubles the number of HTTP requests per user action. With many transactions, this adds latency.
- Negative: The UI may flash or shift as the full list is re-rendered after the fetch completes.
- Positive: Guaranteed consistency between client and server state.
- Positive: Simpler implementation -- no need to handle rollback logic for failed optimistic updates.
