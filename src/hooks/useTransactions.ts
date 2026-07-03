import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getTransactions,
  getTransaction,
  createStockTransaction,
} from "@/lib/services/transactions.service";
import { productKeys } from "@/hooks/useProducts";
import type {
  StockTransaction,
  CreateStockTransactionInput,
  TransactionFilters,
} from "@/types/transaction";

/**
 * Stable query key factory for the stock transactions domain. Every
 * hook reads, writes, and invalidates through these so key shape never
 * drifts between call sites.
 */
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: TransactionFilters = {}) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

/**
 * Fetch a list of stock transactions, optionally filtered/sorted.
 */
export function useTransactions(
  filters: TransactionFilters = {}
): UseQueryResult<StockTransaction[], Error> {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => getTransactions(filters),
  });
}

/**
 * Fetch a single stock transaction by id. Disabled until a valid id is
 * provided, so components can call this before an id is known without
 * triggering an invalid request.
 */
export function useTransaction(
  id: string | undefined
): UseQueryResult<StockTransaction, Error> {
  return useQuery({
    queryKey: transactionKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("useTransaction: id is required");
      }
      return getTransaction(id);
    },
    enabled: Boolean(id),
  });
}

/**
 * Record a stock transaction (goods receipt, stock out, or adjustment).
 *
 * On success, invalidates both the transaction domain (its own lists
 * and the new transaction's detail) and the product domain (product
 * lists and the affected product's detail) — recording a transaction
 * changes products.current_stock via the apply_stock_transaction RPC,
 * so the product caches must be refreshed alongside the transaction
 * caches for the UI to reflect the new stock level.
 */
export function useCreateStockTransaction(): UseMutationResult
  StockTransaction,
  Error,
  CreateStockTransactionInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStockTransactionInput) =>
      createStockTransaction(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(data.product_id),
      });
    },
  });
}