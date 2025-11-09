'use client'

import { DataTable } from '@packages/table_v1/data-table/data-table'
import { DataTableToolbar } from '@packages/table_v1/data-table/toolbar'
import { Checkbox } from '@packages/ui/components/checkbox'
import { useDataTable } from '@packages/table_v1/hooks/use-data-table'
import type { ColumnDef } from '@tanstack/react-table'

type Invoice = {
	invoice: string
	customer: string
	status: 'Paid' | 'Pending' | 'Draft'
	amount: number
}

const invoices: Invoice[] = [
	{ invoice: 'INV-001', customer: 'Acme Inc.', status: 'Paid', amount: 1280 },
	{ invoice: 'INV-002', customer: 'Globex Corp.', status: 'Pending', amount: 560 },
	{ invoice: 'INV-003', customer: 'Soylent Corp.', status: 'Pending', amount: 980 },
	{ invoice: 'INV-004', customer: 'Initech', status: 'Draft', amount: 240 },
	{ invoice: 'INV-005', customer: 'Stark Industries', status: 'Paid', amount: 1860 },
]

const amountFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
})

const columns: ColumnDef<Invoice>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				aria-label="Select all"
				className="translate-y-0.5"
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				className="translate-y-0.5"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
		enableHiding: false,
		size: 40,
	},
	{
		accessorKey: 'invoice',
		header: 'Invoice',
		enableSorting: false,
		cell: ({ row }) => <span className="font-medium">{row.original.invoice}</span>,
	},
	{
		accessorKey: 'customer',
		header: 'Customer',
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		enableSorting: false,
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		enableSorting: false,
		cell: ({ row }) => <span className="tabular-nums">{amountFormatter.format(row.original.amount)}</span>,
	},
]

export default function Home() {
	const { table } = useDataTable({
		data: invoices,
		columns,
		pageCount: 1,
		initialState: {
			pagination: { pageIndex: 1, pageSize: 1 },
		},
	})

	return (
		<main className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
			<div className="space-y-1">
				<h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
				<p className="text-muted-foreground text-sm">
					A minimal example wired up to the reusable data table components.
				</p>
			</div>

			<DataTable table={table}>
				<DataTableToolbar table={table} />
			</DataTable>
		</main>
	)
}
