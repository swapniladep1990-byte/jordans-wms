```typescript
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/products.service";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "@/types/product";

/**
 * Stable query key factory for the products domain. Every hook reads,
 * writes, and invalidates through these so key shape never drifts
 * between call sites.
 */
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters = {}) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Fetch a list of products, optionally filtered/sorted.
 */
export function useProducts(
  filters: ProductFilters = {}
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
}

/**
 * Fetch a single product by id. Disabled until a valid id is provided,
 * so components can call this before an id is known without triggering
 * an invalid request.
 */
export function useProduct(
  id: string | undefined
): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("useProduct: id is required");
      }
      return getProduct(id);
    },
    enabled: Boolean(id),
  });
}

/**
 * Create a product. On success, invalidates product lists so the new
 * product appears on next render.
 */
export function useCreateProduct(): UseMutationResult
  Product,
  Error,
  CreateProductInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Update a product. On success, invalidates product lists and the
 * updated product's own detail cache.
 */
export function useUpdateProduct(): UseMutationResult
  Product,
  Error,
  UpdateProductInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProduct(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(data.id),
      });
    },
  });
}

/**
 * Delete a product. On success, invalidates product lists and removes
 * the deleted product's detail cache so a stale detail view can't linger.
 */
export function useDeleteProduct(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
```