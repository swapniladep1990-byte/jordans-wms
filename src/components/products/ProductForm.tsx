```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

interface ProductFormProps {
  initialValues?: Partial<Product>;
  onSuccess?(): void;
  onCancel?(): void;
}

/**
 * Version 1 treats categories and suppliers as fixed constants rather
 * than master-data tables. The selected label is stored directly in
 * `category_id` / `supplier_id` as plain text. There is no
 * categories/suppliers lookup module in this version.
 */
const CATEGORY_OPTIONS = [
  "Commercial Downlights",
  "Industrial Fixtures",
  "Track Systems",
  "Office Panels",
  "Outdoor & Facade",
  "Architectural Profiles",
] as const;

const SUPPLIER_OPTIONS = [
  "Jordans Lighting",
  "Philips",
  "Havells",
  "Crompton",
  "Wipro",
] as const;

const UNIT_OPTIONS = ["Nos", "Box", "Meter", "Kg", "Roll", "Set"] as const;

type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
type SupplierOption = (typeof SUPPLIER_OPTIONS)[number];
type UnitOption = (typeof UNIT_OPTIONS)[number];

const productFormSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  barcode: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS, {
    errorMap: () => ({ message: "Category is required" }),
  }),
  supplier: z.enum(SUPPLIER_OPTIONS, {
    errorMap: () => ({ message: "Supplier is required" }),
  }),
  location: z.string().optional(),
  minimum_stock: z.coerce
    .number({ invalid_type_error: "Minimum stock must be a number" })
    .min(0, "Minimum stock must be 0 or greater"),
  unit: z.enum(UNIT_OPTIONS, {
    errorMap: () => ({ message: "Unit is required" }),
  }),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

function toOptionalString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toCategoryOption(
  value: string | null | undefined
): CategoryOption | undefined {
  return (CATEGORY_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as CategoryOption)
    : undefined;
}

function toSupplierOption(
  value: string | null | undefined
): SupplierOption | undefined {
  return (SUPPLIER_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as SupplierOption)
    : undefined;
}

function toUnitOption(value: string | null | undefined): UnitOption {
  return (UNIT_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as UnitOption)
    : "Nos";
}

function buildCreatePayload(values: ProductFormValues): CreateProductInput {
  return {
    product_name: values.product_name.trim(),
    barcode: toOptionalString(values.barcode) ?? null,
    category_id: values.category,
    supplier_id: values.supplier,
    location: toOptionalString(values.location) ?? null,
    minimum_stock: values.minimum_stock,
    unit: values.unit,
    description: toOptionalString(values.description) ?? null,
  };
}

function buildUpdatePayload(
  id: string,
  values: ProductFormValues
): UpdateProductInput {
  return {
    id,
    product_name: values.product_name.trim(),
    barcode: toOptionalString(values.barcode) ?? null,
    category_id: values.category,
    supplier_id: values.supplier,
    location: toOptionalString(values.location) ?? null,
    minimum_stock: values.minimum_stock,
    unit: values.unit,
    description: toOptionalString(values.description) ?? null,
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

export default function ProductForm({
  initialValues,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const isEditMode = Boolean(initialValues?.id);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialValues?.image_url ?? null
  );
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      product_name: initialValues?.product_name ?? "",
      barcode: initialValues?.barcode ?? "",
      category: toCategoryOption(initialValues?.category_id),
      supplier: toSupplierOption(initialValues?.supplier_id),
      location: initialValues?.location ?? "",
      minimum_stock: initialValues?.minimum_stock ?? 0,
      unit: toUnitOption(initialValues?.unit),
      description: initialValues?.description ?? "",
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error ?? updateMutation.error;

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  }

  function handleImageClear() {
    setSelectedImageName(null);
    setImagePreviewUrl(initialValues?.image_url ?? null);
  }

  async function onSubmit(values: ProductFormValues) {
    if (isEditMode && initialValues?.id) {
      await updateMutation.mutateAsync(
        buildUpdatePayload(initialValues.id, values),
        { onSuccess: () => onSuccess?.() }
      );
      return;
    }

    await createMutation.mutateAsync(buildCreatePayload(values), {
      onSuccess: () => onSuccess?.(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6"
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-100">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {isEditMode
            ? "Update the details for this product."
            : "Fill in the details to add a new product."}
        </p>
      </div>

      {submitError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {submitError.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        {/* Product Name */}
        <div>
          <FieldLabel htmlFor="product_name" required>
            Product Name
          </FieldLabel>
          <input
            id="product_name"
            type="text"
            placeholder="e.g. LED Panel Light 24W"
            className={inputClass}
            disabled={isSubmitting}
            {...register("product_name")}
          />
          <FieldError message={errors.product_name?.message} />
        </div>

        {/* SKU (read-only, generated by the database) */}
        <div>
          <FieldLabel htmlFor="sku">SKU</FieldLabel>
          <input
            id="sku"
            type="text"
            readOnly
            disabled
            value={initialValues?.sku ?? ""}
            placeholder="Generated automatically when the product is saved."
            className={`${inputClass} cursor-not-allowed text-slate-500`}
          />
          <p className="mt-1 text-xs text-slate-500">
            Generated automatically when the product is saved.
          </p>
        </div>

        {/* Barcode */}
        <div>
          <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
          <input
            id="barcode"
            type="text"
            placeholder="Leave blank if not available"
            className={inputClass}
            disabled={isSubmitting}
            {...register("barcode")}
          />
          <FieldError message={errors.barcode?.message} />
        </div>

        {/* Category */}
        <div>
          <FieldLabel htmlFor="category" required>
            Category
          </FieldLabel>
          <select
            id="category"
            className={selectClass}
            disabled={isSubmitting}
            defaultValue=""
            {...register("category")}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </div>

        {/* Supplier */}
        <div>
          <FieldLabel htmlFor="supplier" required>
            Supplier
          </FieldLabel>
          <select
            id="supplier"
            className={selectClass}
            disabled={isSubmitting}
            defaultValue=""
            {...register("supplier")}
          >
            <option value="" disabled>
              Select a supplier
            </option>
            {SUPPLIER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.supplier?.message} />
        </div>

        {/* Rack / Shelf */}
        <div>
          <FieldLabel htmlFor="location">Rack / Shelf</FieldLabel>
          <input
            id="location"
            type="text"
            placeholder="e.g. A-01, B-03"
            className={inputClass}
            disabled={isSubmitting}
            {...register("location")}
          />
          <FieldError message={errors.location?.message} />
        </div>

        {/* Minimum Stock */}
        <div>
          <FieldLabel htmlFor="minimum_stock" required>
            Minimum Stock
          </FieldLabel>
          <input
            id="minimum_stock"
            type="number"
            min={0}
            step={1}
            className={inputClass}
            disabled={isSubmitting}
            {...register("minimum_stock")}
          />
          <FieldError message={errors.minimum_stock?.message} />
        </div>

        {/* Unit */}
        <div>
          <FieldLabel htmlFor="unit" required>
            Unit
          </FieldLabel>
          <select
            id="unit"
            className={selectClass}
            disabled={isSubmitting}
            defaultValue=""
            {...register("unit")}
          >
            <option value="" disabled>
              Select a unit
            </option>
            {UNIT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.unit?.message} />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <textarea
            id="description"
            rows={4}
            placeholder="Additional details about this product"
            className={`${inputClass} resize-y`}
            disabled={isSubmitting}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Product Image (UI only, storage wired later) */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="product_image">Product Image</FieldLabel>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-700 bg-slate-950">
              {imagePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreviewUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-6 w-6 text-slate-600" />
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="product_image"
                className="inline-flex cursor-pointer items-center rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                Choose Image
              </label>
              <input
                id="product_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="hidden"
              />

              {selectedImageName && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span className="truncate">{selectedImageName}</span>
                  <button
                    type="button"
                    onClick={handleImageClear}
                    className="text-slate-500 hover:text-slate-300"
                    aria-label="Remove selected image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Image upload UI only — storage integration will be added
                later.
              </p>
            </div>
          </div>
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
          Save Product
        </button>
      </div>
    </form>
  );
}
```