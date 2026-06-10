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

		<div class="placeholder">
			<p>Render the table here.</p>
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

	.workspace-header p {
		margin: 0;
		color: #637083;
		font-size: 0.92rem;
	}

	.placeholder {
		display: grid;
		min-height: 280px;
		place-items: center;
		padding: 24px;
		color: #637083;
		background:
			linear-gradient(#eef2f7 1px, transparent 1px),
			linear-gradient(90deg, #eef2f7 1px, transparent 1px);
		background-size: 48px 48px;
	}

	.placeholder p {
		margin: 0;
		border: 1px dashed #aeb8c8;
		border-radius: 6px;
		padding: 12px 16px;
		background: #ffffff;
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
