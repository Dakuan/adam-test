<script lang="ts">
	import { onMount } from 'svelte';
	import type { FieldType, TableData } from '$lib/table-data';
	import { TableFilters, type NumericOperator } from '$lib/table-filters.svelte';

	const filters = new TableFilters();

	let table: TableData | null = $state(null);

	onMount(async () => {
		const res = await fetch('/api/table');
		const data = await res.json();
		table = data.table;
		filters.setRows(table?.rows ?? []);
	});

	function formatCell(value: unknown, type: FieldType): string {
		if (type === 'Boolean') return value ? 'Yes' : 'No';
		if (type === 'Date') return new Date(value as string).toLocaleDateString('en-GB');
		return String(value);
	}
</script>

<svelte:window
	onclick={(event) => {
		if (filters.openFilter && !(event.target as HTMLElement).closest('.filter-cell')) {
			filters.closeMenu();
		}
	}}
/>

<svelte:head>
	<title>Table rendering exercise</title>
</svelte:head>

<main>
	<section class="intro" aria-labelledby="page-title">
		<p class="eyebrow">Software engineer exercise</p>
		<h1 id="page-title">Render a simple table</h1>
		<p>
			Load the local API data from <code>/api/table</code> and display it as a readable HTML table. Further
			behaviour will be introduced during the live coding session.
		</p>
	</section>

	<section class="workspace" aria-labelledby="workspace-title">
		<div class="workspace-header">
			<h2 id="workspace-title">Table workspace</h2>
		</div>
		
		<div>
			{#if table}
				<table>
					<thead>
						<tr>
							{#each table.fields as field (field.id)}
								{@const filter = filters.columnFilters[field.id]}
								{#if filter}
									<th scope="col" class="filter-cell">
										<button
											type="button"
											class="column-trigger"
											class:is-active={filters.isFilterActive(field.id, filter)}
											aria-haspopup="listbox"
											aria-expanded={filters.openFilter === field.id}
											onclick={() => filters.toggleFilter(field.id, filter)}
										>
											<span>{field.label}</span>
											{#if filters.sort?.column === field.id}
												<span class="sort-indicator" aria-hidden="true">
													{filters.sort.direction === 'asc' ? '↑' : '↓'}
												</span>
											{/if}
											<svg
												class="chevron"
												width="12"
												height="12"
												viewBox="0 0 12 12"
												aria-hidden="true"
											>
												<path
													d="M2 4l4 4 4-4"
													fill="none"
													stroke="currentColor"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>
										{#if filters.openFilter === field.id}
											<div class="filter-menu">
												{#if filter.kind === 'select'}
													<ul class="filter-options" role="listbox" aria-label="Filter by {field.label}">
														{#each filter.options as option (option.value)}
															<li>
																<button
																	type="button"
																	role="option"
																	aria-selected={filters.selectValue(field.id, filter) === option.value}
																	class:selected={filters.selectValue(field.id, filter) === option.value}
																	onclick={() => filters.selectFilter(field.id, option.value)}
																>
																	{option.label}
																</button>
															</li>
														{/each}
													</ul>
												{:else}
													{@const value = filters.numericDraft ?? filters.numericValue(field.id, filter)}
													<div class="numeric-filter">
														<label class="numeric-field">
															<span class="numeric-label">Condition</span>
															<select
																value={value.operator}
																onchange={(e) =>
																	filters.setNumericDraft({
																		operator: e.currentTarget.value as NumericOperator
																	})}
															>
																{#each filters.numericOperators as op (op.value)}
																	<option value={op.value}>{op.label}</option>
																{/each}
															</select>
														</label>
														<label class="numeric-field">
															<span class="numeric-label">Amount</span>
															<input
																type="number"
																inputmode="decimal"
																placeholder="Enter amount"
																value={value.amount ?? ''}
																oninput={(e) =>
																	filters.setNumericDraft({
																		amount: e.currentTarget.value === '' ? null : Number(e.currentTarget.value)
																	})}
															/>
														</label>
														<div class="sort-options">
															<span class="numeric-label">Sort</span>
															<div class="sort-buttons">
																<button
																	type="button"
																	class="sort-button"
																	class:selected={filters.sort?.column === field.id && filters.sort.direction === 'asc'}
																	onclick={() => filters.setSort(field.id, 'asc')}
																>
																	Ascending ↑
																</button>
																<button
																	type="button"
																	class="sort-button"
																	class:selected={filters.sort?.column === field.id && filters.sort.direction === 'desc'}
																	onclick={() => filters.setSort(field.id, 'desc')}
																>
																	Descending ↓
																</button>
															</div>
														</div>
														<div class="numeric-actions">
															<button
																type="button"
																class="link-button"
																onclick={() => filters.clearFilter(field.id, filter)}
															>
																Clear
															</button>
															<button
																type="button"
																class="primary-button"
																onclick={() => filters.applyNumeric(field.id)}
															>
																Done
															</button>
														</div>
													</div>
												{/if}
											</div>
										{/if}
									</th>
								{:else}
									<th scope="col">{field.label}</th>
								{/if}
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each filters.displayRows as row (row.id)}
							<tr>
								{#each table.fields as field (field.id)}
									<td>{formatCell(row[field.id], field.type)}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		color: #172033;
		background: #f6f7f9;
	}

	main {
		width: min(960px, calc(100% - 32px));
		margin: 0 auto;
		padding: 48px 0;
	}

	.intro {
		margin-bottom: 32px;
	}

	.eyebrow {
		margin: 0 0 8px;
		color: #476181;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: uppercase;
	}

	h1,
	h2,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 12px;
		font-size: 2.2rem;
		line-height: 1.1;
	}

	h2 {
		margin-bottom: 0;
		font-size: 1.1rem;
	}

	.intro p:last-child {
		max-width: 680px;
		margin-bottom: 0;
		color: #4a5568;
		line-height: 1.6;
	}

	code {
		border-radius: 4px;
		padding: 0.1rem 0.25rem;
		background: #e8edf4;
		font-size: 0.95em;
	}

	.workspace {
		overflow: hidden;
		border: 1px solid #d7dde7;
		border-radius: 8px;
		background: #ffffff;
	}

	.workspace-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px solid #d7dde7;
		padding: 16px 20px;
	}

	.filter-cell {
		position: relative;
	}

	.column-trigger {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin: -4px -8px;
		border: 1px solid transparent;
		border-radius: 6px;
		padding: 4px 8px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.column-trigger:hover {
		background: #e6ebf3;
	}

	.column-trigger.is-active {
		border-color: #2563eb;
		background: #e8f0ff;
		color: #1d4ed8;
	}

	.chevron {
		transition: transform 0.15s ease;
	}

	.column-trigger[aria-expanded='true'] .chevron {
		transform: rotate(180deg);
	}

	.filter-menu {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		z-index: 10;
		min-width: 160px;
		margin: 0;
		padding: 4px;
		border: 1px solid #d7dde7;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 8px 24px rgba(23, 32, 51, 0.14);
	}

	.filter-options {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.filter-options button {
		display: block;
		width: 100%;
		border: none;
		border-radius: 5px;
		padding: 8px 10px;
		background: transparent;
		color: #2b3648;
		font: inherit;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
	}

	.filter-options button:hover {
		background: #f0f3f8;
	}

	.filter-options button.selected {
		background: #e8f0ff;
		color: #1d4ed8;
		font-weight: 600;
	}

	.numeric-filter {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 8px;
	}

	.numeric-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.numeric-label {
		color: #5a6b85;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.numeric-field select,
	.numeric-field input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #d7dde7;
		border-radius: 6px;
		padding: 7px 8px;
		background: #ffffff;
		color: #2b3648;
		font: inherit;
		font-weight: 500;
	}

	.numeric-field select:focus,
	.numeric-field input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18);
	}

	.numeric-actions {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 2px;
	}

	.sort-options {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-top: 1px solid #eaeef4;
		padding-top: 10px;
	}

	.sort-buttons {
		display: flex;
		gap: 6px;
	}

	.sort-button {
		flex: 1;
		border: 1px solid #d7dde7;
		border-radius: 6px;
		padding: 7px 8px;
		background: #ffffff;
		color: #2b3648;
		font: inherit;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
	}

	.sort-button:hover {
		background: #f0f3f8;
	}

	.sort-button.selected {
		border-color: #2563eb;
		background: #e8f0ff;
		color: #1d4ed8;
		font-weight: 600;
	}

	.sort-indicator {
		color: #1d4ed8;
		font-weight: 700;
	}

	.link-button {
		border: none;
		border-radius: 6px;
		padding: 7px 10px;
		background: transparent;
		color: #476181;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.link-button:hover {
		background: #f0f3f8;
	}

	.primary-button {
		border: none;
		border-radius: 6px;
		padding: 7px 14px;
		background: #2563eb;
		color: #ffffff;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.primary-button:hover {
		background: #1d4ed8;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	thead th {
		border-bottom: 2px solid #d7dde7;
		padding: 12px 20px;
		background: #f0f3f8;
		color: #33425b;
		font-weight: 700;
		text-align: left;
	}

	tbody td {
		border-bottom: 1px solid #eaeef4;
		padding: 12px 20px;
		color: #2b3648;
	}

	tbody tr:nth-child(even) {
		background: #fafbfd;
	}

	@media (max-width: 640px) {
		main {
			width: min(100% - 24px, 960px);
			padding: 32px 0;
		}

		h1 {
			font-size: 1.8rem;
		}

		.workspace-header {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
