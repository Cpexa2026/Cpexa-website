# CPEXA status ledger

Updated November 19, 2026. Status is technical readiness in this repository. It is not design approval, financial clearance, or permission to launch.

Source of truth: `site.html` plus `hero-motion.mjs`, served by `node dev.cjs` (`npm start`). `npm run build` only prepares a Vercel output. It does not deploy. There is no database, migration, payment provider, or mailbox in this repo. Ask CPEXA can call OpenAI only when the host sets `OPENAI_API_KEY`. That key is not stored here.

| ID | Status | Evidence | Needs | Next action |
| --- | --- | --- | --- | --- |
| AUD-01 | Verified | Public routes are one site with client-side paths. Protected account, gallery, and staff screens are preview shells in the same file. No migrations or env vars. | None for the audit | Keep later provider work out of this static server |
| AUD-02 | Verified | This ledger | None | Update it at the end of each slice |
| AUD-03 | Verified | Order below | None | Membership labels are updated. Accounts stay blocked on client access |
| WEB-01 | In progress | Chrome checked Home, About, Consulting, Corporate Training, Membership, Events, Resources, Ask, Contact, Privacy, and Terms. Each deep link shows its own heading and hides the homepage. Account, gallery, and staff screens remain previews, so they are not verified access. Final copy is still WEB-05. | Approved page copy | Keep the public routes; do not treat preview accounts as real |
| WEB-02 | Verified | Homepage headline is Expertise in Motion. The hero canvas autoplays and keeps drawing, with the control reading Pause motion. Four feature cards are present, and the events card opens on hover to a link for `/events`. | None for this behavior | Leave the hero and cards as they are |
| WEB-03 | Verified | `/events/houston-workshop` shows Houston Workshop and February 17, 2027, with booking marked not confirmed. No price, venue, or registration control. Events → workshop → Back to Events restores the tab and scroll. Browser Back returns to the workshop. Checked at desktop and a 390px width. | Venue, time, agenda, speakers, imagery, ticket details, and booking link from CPEXA | Add the booking link only after CPEXA confirms it |
| WEB-04 | Verified | Resource search and the Leadership filter survive a trip to the article and back, including scroll position. The homepage sample is labeled Example. Closing Ask CPEXA returns focus to its button. No model, payment, or Ticket Tailor request was made. The library is still three sample records. | The approved resource list is WEB-05 | Keep the sample labeled until CPEXA supplies the library |
| WEB-05 | Blocked | Approved membership labels now say enrollment is not open. `/membership` links to one public sample article. Price, billing period, full benefits, Terms, Privacy, and the launch resource list are still unapproved. | CPEXA-approved copy, mission confirmation if it changes, Terms, Privacy, captions, and the launch lists of up to 15 resources, 3 events, and 3 recordings | Do not invent price or a waitlist |
| CORE-01 | Blocked | No client-owned Supabase project, migration, or server-side access check | Client GitHub, Vercel, and Supabase access, kept separate from production data | Do not create a production project from this sandbox |
| CORE-02 | Blocked | Signup, sign-in, and recovery forms stay in the browser and say they are not sent | Resend or a tested replacement, plus the Microsoft 365 mailbox for notices | Do not send mail or change DNS |
| MEM-01 | Blocked | No Stripe price, Checkout, portal, or webhook | Approved price, monthly or annual billing, and refund or grace rules | Leave the payment step as a non-charging preview |
| MEM-02 | Blocked | Member screens are samples and do not enforce access | MEM-01 | Do not treat the sample member home as protected |
| STAFF-01 | Blocked | Three role names are described in the sample staff screen. No accounts exist. | Five named people and role assignments, plus admin sign-in verification | Do not invent staff users |
| STAFF-02 | Blocked | No draft or publish persistence | STAFF-01 and CORE-01 | Keep using the built-in preview, not a separate CMS |
| EVT-01 | Blocked | No Ticket Tailor account or booking link | Client Ticket Tailor connected to the client Stripe account | Keep Houston registration on the detail page |
| EVT-02 | Blocked | No Cloudflare Stream broadcast | A client broadcast and a permitted member account | Do not issue playback links |
| EVT-03 | Blocked | No provider notices or recordings pipeline | EVT-02 | Do not auto-publish |
| EVT-04 | Blocked | Replay screens are samples with no video file | Three supplied recordings and their rights | Do not mark the gallery complete from the mock player |
| AI-01 | In progress | `POST /api/ask` answers from `faqs.json`. OpenAI is called only when `OPENAI_API_KEY` is set, only for a matching FAQ, and only after the per-browser and per-instance limits pass. The model cannot choose its own price, date, or account facts. | The approved FAQ list beyond the published site copy, and the OpenAI monthly budget on the webdev@cpexa.com account | Add approved FAQs to `faqs.json`. Put the key in Vercel, not in the page |
| AI-02 | Blocked | Inquiry forms are not delivered. The staff list is three hard-coded rows. | The Microsoft 365 mailbox and the response standard | Do not email inquiries |
| AI-03 | Blocked | Saved threads are two sample buttons, not per-member records | CORE-01 and a member opt-in | Do not claim cross-device history |
| AI-04 | Blocked | No Dropbox destination | A restricted client Dropbox and permission to export | Do not export chats |
| AI-05 | Blocked | Proposed retention periods are not confirmed | Written retention, consent, and deletion rules, plus the operator | Do not delete or retain real personal data |
| QA-01 | Blocked | Real signup, Stripe, Ticket Tailor, Stream, and AI journeys cannot run | The slices above, 30 agreed questions, and the agreed concurrency check | Record pass or fail only against real test fixtures |
| QA-02 | Ready | Keyboard handlers exist for dialogs, the Ask panel, and feature cards. Full browser matrix is not run. | Final testing window and representative devices | Run the matrix when the public slice is stable |
| OPS-01 | Blocked | No isolated backup or restore | Backup destination, frequency, and named operators | Do not connect live data |
| OPS-02 | Blocked | No operating guide beyond this ledger and the README | Training dates and credential handoff | Write guides when the matching slice exists |
| REL-01 | Blocked | No written design approval and no launch checklist sign-off | Brian for outstanding payments and CPEXA written approval | Do not change DNS or launch |

## Build order

1. Audit. Done in this ledger.
2. Public routes and the Houston journey. Journey behavior is verified. WEB-01 stays in progress until approved copy replaces the preview pages.
3. Accounts and access. Blocked on client Supabase and email.
4. Membership and staff editing. Blocked on price, billing frequency, and named staff.
5. Ticketing and stream. Blocked on provider accounts and recordings. Ask CPEXA now answers from published FAQs, with OpenAI used only after the guardrails pass.
6. QA, training, and handoff. Blocked on the slices above.

Service setup can proceed when Brian supplies access. It does not unblock content that CPEXA still has to approve.
