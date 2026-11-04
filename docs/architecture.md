# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- Presentation tier decision:Keep the frontend responsible for displaying the UI, collecting user input, navigation, and calling backend APIs. Business logic and direct database access should not be placed in the frontend.

- Logic tier decision: Keep application and business logic in the backend. The backend will validate requests, process application rules, coordinate operations, and expose API endpoints to the frontend.

- Data tier decision: Keep persistent application data in the database and access it only through the backend data-access layer. The frontend will not communicate directly with the database.

- Activity tracking approach: Store user workout and activity records in the database. The backend will provide APIs for creating, retrieving, updating, and deleting activity records, while the frontend will provide the activity tracking interface.

- Team management approach: Store teams and team membership in the database. Team creation, membership changes, and validation will be handled by the backend, with the frontend providing screens for viewing and managing teams.

- Leaderboard approach: Calculate leaderboard rankings in the backend using stored activity data. Expose the calculated rankings through an API endpoint and let the frontend focus on displaying the leaderboard.

- Workout suggestions approach: Keep workout suggestion rules in the backend so recommendation logic is centralized and testable. The frontend will request suggestions from the backend and display the returned workouts.

## Test plan

Record the commands you run and what each failure means.

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend`
Result: Failed (4 of 5 tests failed).
Meaning: The current data models are missing required validation and schema fields for users, teams, activities, and workout suggestions. The seed-data test already passes.

- API command: `npm run test:api --prefix octofit-tracker/backend`
Result: Failed (4 of 4 tests failed).
Meaning: Activity and team endpoints are not yet correctly implemented and return 501 instead of validating invalid requests with 400 responses. The leaderboard is not calculating or returning team rankings, and workout suggestions are not yet matching users' activity patterns.

- Frontend command: `npm test --prefix octofit-tracker/frontend`
Result: Failed (15 of 15 tests failed).
Meaning: The frontend capability pages are still placeholders. Activities, teams, leaderboard, and workout suggestions do not yet render the expected API data, meaningful empty states, or accessible error alerts.

- Backend build command: `npm run build --prefix octofit-tracker/backend`
Result: Passed. The backend builds successfully.

- Frontend build command: `npm run build --prefix octofit-tracker/frontend`
Result: Passed. The frontend builds successfully.
