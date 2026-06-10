import { json } from '@sveltejs/kit';
import { table, type TableApiResponse } from '$lib/table-data';

export function GET() {
	const response: TableApiResponse = { table };

	return json(response);
}
