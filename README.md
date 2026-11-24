<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/permit-io-appwrite-app.webp" alt="File Sharing App with Permit.io and Appwrite: Share files with owner and viewer roles using ReBAC" width="100%" />

<br />
<br />

# File Sharing App with Permit.io and Appwrite

### Share files with owner and viewer roles using ReBAC

A React and Vite file-sharing app where Appwrite handles auth, database and storage, and an Appwrite Function calls Permit.io to assign per-file roles and check view, download, update and share.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Permit.io](https://img.shields.io/badge/Built_with_Permit.io-141414?style=for-the-badge)](https://permit.io)

[Permit.io docs](https://docs.permit.io) &nbsp;·&nbsp; [Permit.io](https://permit.io) &nbsp;·&nbsp; [Appwrite](https://appwrite.io) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

A file-sharing app. [Appwrite](https://appwrite.io) provides authentication, the database and file storage. [Permit.io](https://permit.io) provides relationship-based access control (ReBAC), a granular form of role-based access control, on each file as a resource instance.

Permit.io is called only from an Appwrite Function (`sync-with-permit`), never from the browser. When a user uploads a file, the function creates a `file` resource instance and makes the uploader its `owner`. Owners can share a file with another user as a role such as `viewer`, which the function checks against the `share` permission before assigning.

The app is in the `permit-io-appwrite/` folder.

## Features

- **Per-file roles**: Role assignments on `file:<id>` instances, with owner and viewer roles.
- **Permissions**: `view`, `create`, `download`, `update` and `share`.
- **Share modal**: The owner enters an email and a role.
- **Owner-only sharing**: The function checks `share` before it assigns a role.
- **Automatic sync**: Appwrite event triggers create the Permit.io user on sign-up and the file instance on upload.
- **Appwrite backend**: Auth, database, storage and serverless function.

## Tech stack

| Layer | Tool |
| --- | --- |
| Frontend | [React](https://react.dev) 18, [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com) |
| Backend | [Appwrite](https://appwrite.io) auth, database, storage, Functions |
| Authorization | [Permit.io](https://permit.io) ReBAC (`permitio` SDK, local PDP) |
| Routing | React Router |

## Getting started

### Prerequisites

- Node.js
- An [Appwrite](https://appwrite.io) project with a database, a file metadata collection, a storage bucket and the `sync-with-permit` function deployed
- A [Permit.io](https://permit.io) account with a `file` resource, the five actions above and `owner` and `viewer` roles
- Docker, to run the Permit.io PDP (`permitio/pdp-v2`)

### Installation

```bash
git clone https://github.com/Studio1HQ/permit-io-appwrite-app.git
cd permit-io-appwrite-app/permit-io-appwrite
npm install
```

### Environment variables

Frontend (Vite `.env`):

| Variable | Description |
| --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint. |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID. |
| `VITE_DATABASE_ID` | Appwrite database ID. |
| `VITE_FILE_METADATA_COLLECTION_ID` | Collection that stores file metadata and `shared_with`. |
| `VITE_FILES_BUCKET_ID` | Storage bucket for uploaded files. |
| `VITE_FUNCTION_ID` | ID of the `sync-with-permit` Appwrite Function. |
| `VITE_BASE_URL` | Used by the older, commented-out `permit-io.ts` client. |

Appwrite Function (`functions/sync-with-permit`):

| Variable | Description |
| --- | --- |
| `PERMIT_API_KEY_PROD` | Permit.io API key. |
| `APPWRITE_API_KEY` | Appwrite API key, used when the request has no `x-appwrite-key`. |

The function currently hard-codes the PDP URL in `src/main.js`; change it to your own PDP URL.

### Run

Start the PDP, then the app:

```bash
docker run -p 7766:7000 --env PDP_API_KEY=<your_permit_api_key> permitio/pdp-v2:latest
npm run dev
```

Other scripts: `npm run build`, `npm run lint` and `npm run preview`.

## How it works

The `sync-with-permit` function handles these requests and events:

| Trigger | What it does |
| --- | --- |
| HTTP `get-user-role` | Returns the user's roles on `file:<id>`. |
| HTTP `check-user-permission` | Runs `permit.check(user, action, "file:<id>")`. |
| HTTP `update-user-role` | Checks that the requester has `share`, then assigns the role to the target user. |
| Event: file created | Creates the `file` resource instance and assigns `owner` to the uploader. |
| Event: user created | Syncs the user to Permit.io by email. |

```text
permit-io-appwrite/
├── functions/sync-with-permit/src/main.js
└── src/
    ├── actions/actions.ts      # shareFile
    ├── components/             # FileList, ShareModal, ProtectedRoute
    ├── configurations/         # appwrite.ts, permit-io.ts
    ├── context/
    └── pages/                  # LoginPage, Register, FileUploadPage
```

`shareFile` rejects sharing with yourself or with a user who already has access, calls the function, then adds the email to the document's `shared_with` list.

## Resources

- [Permit.io docs](https://docs.permit.io): ReBAC, resource instances and the PDP.
- [Permit.io](https://permit.io): Account and API key.
- [Appwrite docs](https://appwrite.io/docs): Auth, databases, storage and Functions.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Permit.io](https://permit.io).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
