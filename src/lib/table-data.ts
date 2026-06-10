import tableData from './table-data.json';

export type FieldType = 'Text' | 'Number' | 'Boolean' | 'Date' | 'Relationship';

export type TableFieldId =
	| 'customerName'
	| 'accountValue'
	| 'activeSubscription'
	| 'renewalDate'
	| 'owner';

export type TableField = {
	id: TableFieldId;
	label: string;
	type: FieldType;
};

export type TableRow = {
	id: string;
	customerName: string;
	accountValue: number;
	activeSubscription: boolean;
	renewalDate: string;
	owner: string;
};

export type TableData = {
	id: string;
	name: string;
	fields: TableField[];
	rows: TableRow[];
};

export type TableApiResponse = {
	table: TableData;
};

export const table = tableData as TableData;
export const fields = table.fields;
export const rows = table.rows;
