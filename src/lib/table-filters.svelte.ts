import type { TableFieldId, TableRow } from './table-data';

export type FilterOption = { value: string; label: string };

export type NumericOperator = '>' | '>=' | '=' | '<=' | '<';
export type NumericValue = { operator: NumericOperator; amount: number | null };

export type SelectColumnFilter = {
	kind: 'select';
	defaultValue: string;
	options: FilterOption[];
	matches: (row: TableRow, value: string) => boolean;
};

export type NumericColumnFilter = {
	kind: 'numeric';
	defaultValue: NumericValue;
	matches: (row: TableRow, value: NumericValue) => boolean;
};

export type ColumnFilter = SelectColumnFilter | NumericColumnFilter;

export type SortDirection = 'asc' | 'desc';
export type SortState = { column: TableFieldId; direction: SortDirection } | null;

export const numericOperators: { value: NumericOperator; label: string }[] = [
	{ value: '>', label: 'Greater than' },
	{ value: '>=', label: 'Greater than or equal' },
	{ value: '=', label: 'Equal to' },
	{ value: '<=', label: 'Less than or equal' },
	{ value: '<', label: 'Less than' }
];

export function compareNumeric(actual: number, value: NumericValue): boolean {
	if (value.amount === null) return true;
	switch (value.operator) {
		case '>':
			return actual > value.amount;
		case '>=':
			return actual >= value.amount;
		case '=':
			return actual === value.amount;
		case '<=':
			return actual <= value.amount;
		case '<':
			return actual < value.amount;
	}
}

// Add a filter to any column by adding an entry here.
const columnFilters: Partial<Record<TableFieldId, ColumnFilter>> = {
	activeSubscription: {
		kind: 'select',
		defaultValue: 'all',
		options: [
			{ value: 'all', label: 'All' },
			{ value: 'active', label: 'Active' },
			{ value: 'inactive', label: 'Inactive' }
		],
		matches: (row, value) =>
			value === 'all' ? true : value === 'active' ? row.activeSubscription : !row.activeSubscription
	},
	accountValue: {
		kind: 'numeric',
		defaultValue: { operator: '>', amount: null },
		matches: (row, value) => compareNumeric(row.accountValue, value)
	}
};

export class TableFilters {
	readonly columnFilters = columnFilters;
	readonly numericOperators = numericOperators;

	rows = $state<TableRow[]>([]);
	activeFilters = $state<Partial<Record<TableFieldId, string | NumericValue>>>({});
	openFilter = $state<TableFieldId | null>(null);
	numericDraft = $state<NumericValue | null>(null);
	sort = $state<SortState>(null);

	visibleRows = $derived.by(() => {
		const entries = Object.entries(this.columnFilters) as [TableFieldId, ColumnFilter][];
		return this.rows.filter((row) =>
			entries.every(([id, filter]) =>
				filter.kind === 'select'
					? filter.matches(row, this.selectValue(id, filter))
					: filter.matches(row, this.numericValue(id, filter))
			)
		);
	});

	displayRows = $derived.by(() => {
		if (!this.sort) return this.visibleRows;
		const { column, direction } = this.sort;
		const factor = direction === 'asc' ? 1 : -1;
		return [...this.visibleRows].sort((a, b) => {
			const av = a[column];
			const bv = b[column];
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
			return String(av).localeCompare(String(bv)) * factor;
		});
	});

	setRows(rows: TableRow[]) {
		this.rows = rows;
	}

	selectValue(id: TableFieldId, filter: SelectColumnFilter): string {
		return (this.activeFilters[id] as string) ?? filter.defaultValue;
	}

	numericValue(id: TableFieldId, filter: NumericColumnFilter): NumericValue {
		return (this.activeFilters[id] as NumericValue) ?? filter.defaultValue;
	}

	isFilterActive(id: TableFieldId, filter: ColumnFilter): boolean {
		if (filter.kind === 'select') return this.selectValue(id, filter) !== filter.defaultValue;
		return this.numericValue(id, filter).amount !== null;
	}

	setSort(column: TableFieldId, direction: SortDirection) {
		this.sort = { column, direction };
		this.openFilter = null;
	}

	toggleFilter(id: TableFieldId, filter: ColumnFilter) {
		if (this.openFilter === id) {
			this.openFilter = null;
			return;
		}
		this.openFilter = id;
		this.numericDraft = filter.kind === 'numeric' ? { ...this.numericValue(id, filter) } : null;
	}

	selectFilter(id: TableFieldId, value: string) {
		this.activeFilters = { ...this.activeFilters, [id]: value };
		this.openFilter = null;
	}

	setNumericDraft(patch: Partial<NumericValue>) {
		if (this.numericDraft) this.numericDraft = { ...this.numericDraft, ...patch };
	}

	applyNumeric(id: TableFieldId) {
		if (this.numericDraft) this.activeFilters = { ...this.activeFilters, [id]: this.numericDraft };
		this.openFilter = null;
	}

	clearFilter(id: TableFieldId, filter: ColumnFilter) {
		this.activeFilters = { ...this.activeFilters, [id]: filter.defaultValue };
		this.numericDraft = null;
		this.openFilter = null;
	}

	closeMenu() {
		this.openFilter = null;
	}
}
