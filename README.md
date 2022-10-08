# Ukraine Hilfe Sachsen

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Elastic App Search](https://www.elastic.co/de/enterprise-search)
- **I18n**: [i18next & Locize](https://locize.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## How it works

People can [submit information about their needs and offers](https://docs.google.com/forms/d/e/1FAIpQLSc2jeO49sgXrGloTRddNv9j_3A6no0tggN47QTy82c6um2fdw/viewform). This information is then stored in a Google Sheet and curated by a team of volunteers at [Avantgarde Labs](https://avantgarde-labs.de). The curated data is then exported to Elasticsearch and searchable on the website.

## Running Locally

This application requires Node.js v16.13+.

```bash
git clone https://github.com/MartinSeeler/ukraine-hilfe-sachsen.git
cd ukraine-hilfe-sachsen
yarn install
yarn dev
```

Create a `.env` file similar to [`.env.example`](https://github.com/leerob/leerob.io/blob/main/.env.example). You cann use our search API key for testing purposes, as well as the translations from [Locize](https://locize.com/). The provided API key is read-only and can only be used to fetch data.
