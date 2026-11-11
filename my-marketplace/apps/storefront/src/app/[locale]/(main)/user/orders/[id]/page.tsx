import { UserNavigation } from "@/components/molecules"
import { retrieveCustomer } from "@/lib/data/customer"
import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { ArrowLeftIcon } from "@/icons"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { retrieveOrderGroup } from "@/lib/data/orders"
import { OrderDetailsSection } from "@/components/sections/OrderDetailsSection/OrderDetailsSection"

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await retrieveCustomer()
  const orderGroup = (await retrieveOrderGroup(id).catch(() => null)) as any

  if (!orderGroup) {
    if (!user) return redirect("/login")
    return notFound()
  }

  const isGuest = !user

  // Chế độ dành cho khách vãng lai (Guest Checkout) — không ép redirect về /login
  if (isGuest) {
    return (
      <main className="container max-w-4xl py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
          <div>
            <h1 className="heading-md uppercase text-primary">
              Order set #{orderGroup.display_id}
            </h1>
            <p className="label-md text-secondary mt-1">
              Order date:{" "}
              <span className="text-primary font-medium">
                {format(orderGroup.created_at || "", "yyyy-MM-dd")}
              </span>
            </p>
          </div>
          <LocalizedClientLink href="/">
            <Button variant="tonal" className="label-md uppercase">
              Về trang chủ
            </Button>
          </LocalizedClientLink>
        </div>
        <OrderDetailsSection orderGroup={orderGroup} />
      </main>
    )
  }

  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3">
          <LocalizedClientLink href="/user/orders">
            <Button
              variant="tonal"
              className="label-md text-action-on-secondary uppercase flex items-center gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              All orders
            </Button>
          </LocalizedClientLink>
          <div className="sm:flex items-center justify-between">
            <h1 className="heading-md uppercase my-8">
              Order set #{orderGroup.display_id}
            </h1>
            <p className="label-md text-secondary">
              Order date:{" "}
              <span className="text-primary">
                {format(orderGroup.created_at || "", "yyyy-MM-dd")}
              </span>
            </p>
          </div>
          <OrderDetailsSection orderGroup={orderGroup} />
        </div>
      </div>
    </main>
  )
}
