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
