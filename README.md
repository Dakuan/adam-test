# Table Rendering Exercise

This repository is a small SvelteKit scaffold for a software engineer technical exercise.

## Goal

Render the provided Budibase-flavored data as a readable HTML table.

The data is available from the local API stub at `/api/table`. The response has this shape:

```ts
{
	table: {
		id: string;
		name: string;
		fields: TableField[];
		rows: TableRow[];
	}
}
```

Load this endpoint from `src/routes/+page.svelte` and use `table.fields` and `table.rows` to
implement the table.

## Timebox

This at-home setup task should take no more than 20 minutes. Additional requirements such as sorting
or filtering may be introduced during the live coding session.

## Expectations

- Use Svelte and TypeScript.
- Do not add a table/grid library.
- Keep the data local.
- Display visible column headings and all provided rows.
- Format boolean and date values so they are readable.
- Keep the app free of TypeScript and Svelte check errors.

## Commands

```sh
npm i
npm run dev
npm run check
npm test
```

Use Node `^20.19.0 || >=22.12.0`.

To create a production build:

```sh
npm run build
```
