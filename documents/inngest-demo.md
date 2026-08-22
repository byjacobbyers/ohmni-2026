# Showing the mailroom working: a five minute demo

What to have open, what to do, and what to point at, so the three roles in
the mailroom (front desk, manager, workers) are visible as real things rather
than a diagram. Every name below is the actual name in the code.

## The cast

| Role | Tool | Where you see it |
|---|---|---|
| Front desk | Next.js on Vercel, `app/api/send/route.ts` | The form on ohmni.tech/free-site-audit |
| Manager | Inngest, function `lead-submitted` | app.inngest.com → Functions → `lead-submitted` → Runs |
| Worker 1 | Attio, steps `attio-upsert-person` + `attio-timeline-note` | Attio → People |
| Worker 2 | PostHog, step `posthog-server-event` | PostHog → Activity → event `lead_submitted` |
| Worker 3 | Customer.io, step `customerio-track` | Customer.io → People → the profile → Activity |
| Worker 4 | Slack, step `slack-new-lead-ping` | The alerts channel |
| Worker 5 | Resend, step `resend-notification` | Your inbox, and Resend → Emails |

The event the front desk drops in the tray is `lead/submitted`. The manager
runs the five workers **in that order**; Slack is deliberately before Resend so
a broken email lane can never suppress the ping.

## Before the call (two minutes)

1. Open these tabs, in this order, so you can walk left to right:
   ohmni.tech/free-site-audit · app.inngest.com (Functions → `lead-submitted`)
   · Attio People · Customer.io People · the Slack channel · your inbox.
2. Pick a throwaway identity you can find later, for example
   `you+deepgram-demo@yourdomain`. Everything downstream keys off that email.
3. Send one test lead now so there is a **completed run from today** to show
   first. Live demos fail; a finished run in the list does not.

## The walkthrough (three minutes)

**1. Front desk.** Submit the form with the demo email. Point at how fast
"message sent" comes back. Say: *the site did none of the work. It wrote the
envelope down and dropped it in the tray.* That is `inngest.send({ name:
'lead/submitted' })` in the send route, then an immediate 200.

**2. Manager.** Switch to Inngest. The new run appears within a few seconds
under `lead-submitted`. Click it. The timeline shows the steps in order with
a duration and an output for each:

```
attio-upsert-person   → { recordId: "…" }
attio-timeline-note   → ok
posthog-server-event  → ok
customerio-track      → { … }
slack-new-lead-ping   → ok
resend-notification   → { id: "…" }
```

Say: *this is the logbook. Every envelope, every worker, every attempt.* Open
one step's output so they see it is real data, not a green tick.

**3. Workers.** Now go down the tabs and show each result landed:
Attio has the person and a timeline note; Customer.io has the profile with
the event on it; Slack has the "New lead via Free Site Audit" message; your
inbox has the notification. PostHog has `lead_submitted` with `crm_synced:
true`. Five tabs, one envelope, under sixty seconds end to end.

## The part that sells it: showing a skip and a retry

A happy path proves it works. A failure proves it is *operated*.

**The skip (safe, no production changes).** Every worker checks its supplies
first. With a key missing it returns `{ skipped: 'RESEND_API_KEY not set' }`
instead of throwing, and the other four still finish. You have a real example
of this: the night the form shipped, Resend had no key. If that run is still
in Inngest's history, open it and point at the `resend-notification` step
output. If it has aged out, say it from memory. It is the best line in the
deck.

**The retry (local, so production is untouched).** Run the Inngest dev server
against your local site:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Then in another terminal, start the site with one worker deliberately
unplugged:

```bash
SLACK_ALERT_WEBHOOK_URL=https://example.invalid/hook pnpm dev
```

Submit the form locally. In the dev UI at http://localhost:8288 the
`slack-new-lead-ping` step fails, **retries with backoff**, and after the
retries are exhausted `onFailure` fires. Point at three things: the other
steps completed and stayed completed, the failed step shows every attempt
with the error, and the failure alert is a separate path so a human hears
about it. Say: *a skipped job and a done job look identical from outside.
This is what keeps them from looking identical.*

If you would rather not run anything live, the dev UI has a **Replay** on any
past run. Replay the morning's run and narrate the steps as they re-execute.

## One line per role, if you only get sixty seconds

- Front desk: *the site says "got it" and turns back to the visitor.*
- Manager: *Inngest hands out the work, retries a fumble, keeps the book,
  and pages me when something truly cannot finish.*
- Workers: *one job each, and a worker short on supplies sits the round out
  instead of stopping everyone else.*

## Cleanup

Delete the demo person from Attio and Customer.io afterward, the same way
the `+audit-test` profiles were cleaned up before. PostHog and Inngest can
keep their records; they are the logbook.
