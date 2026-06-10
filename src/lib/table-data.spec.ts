import { describe, expect, it } from 'vitest';
import { table } from './table-data';

describe('table exercise data', () => {
	it('provides a Budibase-like table envelope for the exercise', () => {
		expect(table.id).toBeTruthy();
		expect(table.name).toBeTruthy();
		expect(table.fields.length).toBeGreaterThan(0);
		expect(table.rows.length).toBeGreaterThan(0);
	});

	it('keeps each configured field aligned with row data', () => {
		expect(table.rows.length).toBeGreaterThan(0);
		expect(table.rows.every((row) => table.fields.every((field) => field.id in row))).toBe(true);
	});

	it('provides enough rows to exercise table rendering behaviour', () => {
		expect(table.rows).toHaveLength(500);
	});
});
