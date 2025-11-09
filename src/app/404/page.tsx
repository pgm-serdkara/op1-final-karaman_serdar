import Link from "next/link";

export default function ErrorPage() {
	return (
		<div className="mx-auto max-w-xl p-8 space-y-4">
			<h1 className="text-2xl font-semibold">Pagina niet gevonden</h1>
			<p>De aangevraagde pagina of resource bestaat niet (meer).</p>
			<div className="flex flex-wrap gap-3">
				<Link className="px-3 py-1 rounded border" href="/books">Terug naar overzicht</Link>
			</div>
		</div>
	);
}
