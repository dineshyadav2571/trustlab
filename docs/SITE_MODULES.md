# Site modules (source of truth)

Public navigation and admin are limited to these sections:

| Public route | Admin module | MongoDB collection(s) |
|--------------|--------------|------------------------|
| `/` (Home) | Website Data + Highlights | `websitedatas`, `homehighlights` |
| `/other-activities` | Other Activities | `otheractivitysections` |
| `/publications` | Publications | `publications` |
| `/projects` | Projects | `researchprojects` |
| `/teaching` | Teaching | `teachingcourses` |
| `/students` | Students | `supervisedstudents` |
| `/administration` | Administration | `administrationsections` |
| `/important-links` | Important Links | `importantlinksections` |

## System (not in public nav)

- **Admin Management** — `admins`, `refreshsessions`, `passwordresettokens`
- **Users** — `appusers`, `userrefreshsessions`, `userpasswordresettokens`
- **Content** — `contents`

## Legacy data cleanup

Removed modules (patents, achievements, news, opportunities, collaborations, research areas, people) are no longer in the app. To drop their MongoDB collections:

```bash
npm run db:drop-legacy
```

Old URLs redirect via `next.config.ts` (e.g. `/contact` → `/important-links`).
