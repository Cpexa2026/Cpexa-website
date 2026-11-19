# CPEXA

The CPEXA website for purchasing and commercial card professionals. It includes the public pages, the Houston workshop, membership, resources, and Ask CPEXA. There is no live payment, account, or AI connection yet.

## Run locally

```bash
npm start
```

Open http://127.0.0.1:3921/

Main pages:

- `/` home, with the homepage card motion in the hero
- `/about`
- `/consulting`
- `/training`
- `/membership`
- `/events`
- `/events/houston-workshop`
- `/resources`
- `/ask`
- `/contact`
- `/privacy`
- `/terms`

The Houston workshop page is the registration step until CPEXA confirms a booking link. The page names the workshop and the date February 17, 2027. It does not invent a venue, price, or ticket link. Back to Events returns to the list you were on, including the selected tab and scroll position. Resource search and filters work the same way when you return from an article.

Membership uses Explore membership. The join step is a preview: it does not create an account or take payment. The membership page includes one public article marked Sample.

## Build

```bash
npm run build
```

That prepares a Vercel build of the same site. It does not publish it.

## Ask CPEXA

Ask CPEXA answers from `faqs.json`. Add a published question and answer there, then deploy again. The page sends each question to `POST /api/ask`. The OpenAI key stays on the server.

In the Vercel project owned by webdev@cpexa.com, set `OPENAI_API_KEY`. The server uses `gpt-4o-mini` unless `OPENAI_MODEL` is `gpt-4.1-mini`, `gpt-4.1-nano`, or `gpt-5-mini`. Without the key, the same FAQ answers are returned directly.

Questions from another site are refused. Each browser gets 8 questions an hour and 20 a day, with a few seconds between them. An instance stops calling OpenAI after 40 model replies in an hour and serves the FAQ text instead. Set a monthly budget on the OpenAI account as well. That budget is the hard stop if a bot farm gets past the site limits.
