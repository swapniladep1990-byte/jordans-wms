One flag before the file: `Product` only stores `warehouse_id` (a uuid) — there's no warehouse name available since the frozen service doesn't join `warehouses`, and no `Warehouse` type/lookup exists yet. The **Warehouse** column currently renders the raw `warehouse_id` (or `—` if null). You'll likely want a follow-up task to join/resolve the warehouse name once that's in scope — I didn't touch the service or types to fix this, since both are frozen.

```typescript
"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import type { ProductFilters } from "@/types/product";

interface ProductTableProps {
  filters?: ProductFilters;
  onView?(id: string): void;
  onEdit?(id: string): void;
  onDelete?(id: string): void;
}

const COLUMN_COUNT = 6;

function TableSkeleton() {
  const rows = Array.from({ length: 6 });

  return (
    <tbody>
      {rows.map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-800">
          {Array.from({ length: COLUMN_COUNT }).map((__, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-slate-800" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function TableMessageRow({ children }: { children: React.ReactNode }) {
  return (
    <tbody>
      <tr>
        <td colSpan={COLUMN_COUNT} className="px-4 py-12 text-center">
          {children}
        </td>
      </tr>
    </tbody>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {active ? "🟢 Active" : "🔴 Inactive"}
    </span>
  );
}

function StockBadge({
  currentStock,
  minimumStock,
}: {
  currentStock: number;
  minimumStock: number;
}) {
  const isLowStock = currentStock <= minimumStock;

  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums text-slate-200">{currentStock}</span>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
          isLowStock
            ? "bg-yellow-500/10 text-yellow-400"
            : "bg-emerald-500/10 text-emerald-400"
        }`}
      >
        {isLowStock ? "Low Stock" : "In Stock"}
      </span>
    </div>
  );
}

export default function ProductTable({
  filters,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { data: products, isLoading, isError, error, refetch } =
    useProducts(filters);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[720px] table-auto text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-900">
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <th scope="col" className="px-4 py-3 font-medium">
                SKU
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Product Name
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Current Stock
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Warehouse
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          {isLoading && <TableSkeleton />}

          {!isLoading && isError && (
            <TableMessageRow>
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-red-400">
                  {error?.message ?? "Something went wrong while loading products."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800"
                >
                  Try again
                </button>
              </div>
            </TableMessageRow>
          )}

          {!isLoading && !isError && (products?.length ?? 0) === 0 && (
            <TableMessageRow>
              <p className="text-sm text-slate-400">No products found.</p>
            </TableMessageRow>
          )}

          {!isLoading && !isError && products && products.length > 0 && (
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-800 transition-colors hover:bg-slate-800/60 ${
                    index % 2 === 1 ? "bg-slate-900/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 text-slate-100">
                    {product.product_name}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge
                      currentStock={product.current_stock}
                      minimumStock={product.minimum_stock}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {product.warehouse_id ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={product.active} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView?.(product.id)}
                        aria-label={`View ${product.product_name}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(product.id)}
                        aria-label={`Edit ${product.product_name}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(product.id)}
                        aria-label={`Delete ${product.product_name}`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
```