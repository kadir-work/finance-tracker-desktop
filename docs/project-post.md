# Project Post Draft

I built this project because the company I work for needed a simple internal accounting tool for the manager to track the petty cash under his control, separate from the main accountant's system.

The problem was straightforward: the workflow was growing inside spreadsheets, and that made quick cash tracking harder than it needed to be. The manager needed a lightweight way to record incoming and outgoing amounts, see where the money was going, and review monthly activity without opening a large accounting file every time.

So I built **Finance Tracker Desktop**: a small desktop-first finance application focused on speed, clarity, and local reliability.

It includes:

- a Turkish interface for day-to-day office use
- fast transaction entry
- category-based expense tracking
- daily, monthly, and yearly reporting
- charts and summary cards for quick review
- local SQLite storage
- desktop packaging with Electron
- local and Google Drive backup support

The main goal was not to replace a full accounting system. It was to solve a narrower operational problem well: giving management a clean, simple, low-friction tool for handling the cash box outside the primary accounting workflow.

From a technical side, the stack combines:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Express
- SQLite
- Prisma
- Electron

One of the most interesting parts of the work was turning a web-style app into a reliable packaged desktop app. That included handling local database paths, backup flows, OAuth edge cases, packaging issues, and desktop-specific runtime behavior that does not show up during normal web development.

In the end, the project became more than just a finance form. It became a practical internal operations tool that makes a repetitive daily task much easier for the people actually using it.

This is the kind of software I enjoy building most: focused tools with a clear owner, a clear problem, and a real effect on everyday work.
