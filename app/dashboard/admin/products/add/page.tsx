import { roleRequired } from "@/lib/core/sessions"
import { AddProductForm } from "@/components/admin/AddProductForm"

export const metadata = {
  title: "Add Product — Admin",
}

export default async function AddProductPage() {
  await roleRequired("admin")
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <AddProductForm />
      </div>
    </main>
  )
}
