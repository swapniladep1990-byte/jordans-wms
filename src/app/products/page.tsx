"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import type { ProductFilters } from "@/types/product";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filters: ProductFilters = searchTerm
    ? { search: searchTerm }
    : {};

  function handleAddProductClick() {
    setIsAddModalOpen(true);
  }

  function handleModalClose() {
    setIsAddModalOpen(false);
  }

  function handleFormSuccess() {
    setIsAddModalOpen(false);
    toast.success("Product saved successfully.");
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-100">Products</h1>

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
              placeholder="Search by name, SKU, or barcode"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-slate-500 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={handleAddProductClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <ProductTable filters={filters} />

      {isAddModalOpen && (
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

            <ProductForm
              onSuccess={handleFormSuccess}
              onCancel={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}