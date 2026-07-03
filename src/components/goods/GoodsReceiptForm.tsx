"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCreateStockTransaction } from "@/hooks/useTransactions";
import type { CreateStockTransactionInput } from "@/types/transaction";

interface GoodsReceiptFormProps {
  onSuccess?(): void;
  onCancel?(): void;
}

const goodsReceiptFormSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive("Quantity must be greater than 0"),
  reference_number: z.string().optional(),
  remarks: z.string().optional(),
  performed_by: z.string().optional(),
});

type GoodsReceiptFormValues = z.infer<typeof goodsReceiptFormSchema>;

function toOptionalString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildPayload(
  values: GoodsReceiptFormValues
): CreateStockTransactionInput {
  return {
    product_id: values.product_id,
    transaction_type: "GOODS_RECEIPT",
    quantity: values.quantity,
    reference_number: toOptionalString(values.reference_number) ?? null,
    remarks: toOptionalString(values.remarks) ?? null,
    performed_by: toOptionalString(values.performed_by) ?? null,
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-slate-300"
    >
      {children}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-slate-500 disabled:opacity-60";

const selectClass = `${inputClass} appearance-none`;

export default function GoodsReceiptForm({
  onSuccess,
  onCancel,
}: GoodsReceiptFormProps) {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useProducts();

  const createTransactionMutation = useCreateStockTransaction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoodsReceiptFormValues>({
    resolver: zodResolver(goodsReceiptFormSchema),
    defaultValues: {
      product_id: "",
      quantity: 1,
      reference_number: "",
      remarks: "",
      performed_by: "",
    },
  });

  const isSubmitting = createTransactionMutation.isPending;
  const submitError = createTransactionMutation.error;

  async function onSubmit(values: GoodsReceiptFormValues) {
    try {
      await createTransactionMutation.mutateAsync(buildPayload(values));
      toast.success("Goods receipt recorded successfully.");
      reset();
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to record goods receipt.";
      toast.error(message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6"
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">
          Record Goods Receipt
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Add received stock for a product. This will update inventory
          immediately.
        </p>
      </div>

      {submitError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {submitError.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {/* Product */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="product_id" required>
            Product
          </FieldLabel>
          <select
            id="product_id"
            className={selectClass}
            disabled={isSubmitting || isLoadingProducts || isProductsError}
            defaultValue=""
            {...register("product_id")}
          >
            <option value="" disabled>
              {isLoadingProducts
                ? "Loading products..."
                : isProductsError
                  ? "Failed to load products"
                  : "Select a product"}
            </option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.product_name} ({product.sku})
              </option>
            ))}
          </select>
          <FieldError message={errors.product_id?.message} />
        </div>

        {/* Quantity */}
        <div>
          <FieldLabel htmlFor="quantity" required>
            Quantity
          </FieldLabel>
          <input
            id="quantity"
            type="number"
            min={1}
            step={1}
            className={inputClass}
            disabled={isSubmitting}
            {...register("quantity")}
          />
          <FieldError message={errors.quantity?.message} />
        </div>

        {/* Reference Number */}
        <div>
          <FieldLabel htmlFor="reference_number">Reference Number</FieldLabel>
          <input
            id="reference_number"
            type="text"
            placeholder="e.g. PO-2026-0143"
            className={inputClass}
            disabled={isSubmitting}
            {...register("reference_number")}
          />
          <FieldError message={errors.reference_number?.message} />
        </div>

        {/* Performed By */}
        <div>
          <FieldLabel htmlFor="performed_by">Performed By</FieldLabel>
          <input
            id="performed_by"
            type="text"
            placeholder="e.g. Warehouse staff name"
            className={inputClass}
            disabled={isSubmitting}
            {...register("performed_by")}
          />
          <FieldError message={errors.performed_by?.message} />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
          <textarea
            id="remarks"
            rows={3}
            placeholder="Additional notes about this receipt"
            className={`${inputClass} resize-y`}
            disabled={isSubmitting}
            {...register("remarks")}
          />
          <FieldError message={errors.remarks?.message} />
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Receipt
        </button>
      </div>
    </form>
  );
}