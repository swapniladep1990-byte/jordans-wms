"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";
import GoodsReceiptForm from "@/components/goods/GoodsReceiptForm";
import type { TransactionFilters } from "@/types/transaction";

const COLUMN_COUNT = 5;

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

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GoodsReceiptPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters: TransactionFilters = useMemo(
    () => ({
      transactionType: "GOODS_RECEIPT",
      ...(searchTerm ? { search: searchTerm } : {}),
      sortBy: "created_at",
      sortOrder: "desc",
    }),
    [searchTerm]
  );

  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactions(filters);

  // Products are looked up here (not in the service/hook layer) purely
  // to resolve product_id -> display name/SKU for the history table.
  const { data: products } = useProducts();

  const productLookup = useMemo(() => {
    const map = new Map<string, { product_name: string; sku: string }>();
    products?.forEach((product) => {
      map.set(product.id, {
        product_name: product.product_name,
        sku: product.sku,
      });
    });
    return map;
  }, [products]);

  function handleNewReceiptClick() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleFormSuccess() {
    setIsModalOpen(false);
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-100">
          Goods Receipt
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by reference, remarks, or staff"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-slate-500 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={handleNewReceiptClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            <Plus size={16} />
            New Goods Receipt
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[720px] table-auto text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900">
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                <th scope="col" className="px-4 py-3 font-medium">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Reference #
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Performed By
                </th>
              </tr>
            </thead>

            {isLoading && <TableSkeleton />}

            {!isLoading && isError && (
              <TableMessageRow>
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-red-400">
                    {error?.message ??
                      "Something went wrong while loading goods receipts."}
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

            {!isLoading && !isError && (transactions?.length ?? 0) === 0 && (
              <TableMessageRow>
                <p className="text-sm text-slate-400">
                  No goods receipts found.
                </p>
              </TableMessageRow>
            )}

            {!isLoading &&
              !isError &&
              transactions &&
              transactions.length > 0 && (
                <tbody>
                  {transactions.map((transaction, index) => {
                    const product = productLookup.get(transaction.product_id);

                    return (
                      <tr
                        key={transaction.id}
                        className={`border-b border-slate-800 transition-colors hover:bg-slate-800/60 ${
                          index % 2 === 1 ? "bg-slate-900/40" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-300">
                          {formatDateTime(transaction.created_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-100">
                          {product ? (
                            <span>
                              {product.product_name}{" "}
                              <span className="font-mono text-xs text-slate-500">
                                ({product.sku})
                              </span>
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-slate-500">
                              {transaction.product_id}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-emerald-400">
                          +{transaction.quantity}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {transaction.reference_number ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {transaction.performed_by ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={handleModalClose}
              aria-label="Close"
              className="absolute -top-10 right-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100 sm:-right-2"
            >
              <X size={20} />
            </button>

            <GoodsReceiptForm
              onSuccess={handleFormSuccess}
              onCancel={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}