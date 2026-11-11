import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/atoms"
import AddressSelect from "@/components/cells/AddressSelect/AddressSelect"
import CountrySelect from "@/components/cells/CountrySelect/CountrySelect"
import { usePathname } from "next/navigation"
import { isDigitalCart } from "@/lib/helpers/digital-cart"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const pathname = usePathname()
  const isDigital = isDigitalCart(cart)

  const locale = pathname.split("/")[1]
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || (isDigital ? "Kỹ thuật số / Trực tuyến" : ""),
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || (isDigital ? "100000" : ""),
    "shipping_address.city": cart?.shipping_address?.city || (isDigital ? "Hà Nội" : ""),
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || locale || "vn",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && a.country_code === locale
      ),
    [customer?.addresses]
  )

  // Create a stable reference that only changes when address data actually changes
  const addressSnapshot = useMemo(
    () =>
      JSON.stringify({
        shipping_address: cart?.shipping_address,
        email: cart?.email || customer?.email,
      }),
    [
      cart?.shipping_address?.first_name,
      cart?.shipping_address?.last_name,
      cart?.shipping_address?.address_1,
      cart?.shipping_address?.company,
      cart?.shipping_address?.postal_code,
      cart?.shipping_address?.city,
      cart?.shipping_address?.country_code,
      cart?.shipping_address?.province,
      cart?.shipping_address?.phone,
      cart?.email,
      customer?.email,
    ]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || locale,
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    if (cart?.shipping_address) {
      setFormAddress(cart.shipping_address, cart.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [addressSnapshot])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && !isDigital && (
        <Container className="mb-6 flex flex-col gap-y-4 p-0">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
            <AddressSelect
              addresses={addressesInRegion || []}
              addressInput={
                mapKeys(formData, (_, key) =>
                  key.replace("shipping_address.", "")
                ) as HttpTypes.StoreCartAddress
              }
              onSelect={setFormAddress}
            />
          </div>
        </Container>
      )}

      {isDigital && (
        <div className="mb-4 rounded-md border border-[#1E5FBF]/30 bg-[#1E5FBF]/5 p-3 text-sm text-[#18181B]">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-[#1E5FBF]">Bàn giao tài nguyên kỹ thuật số:</span>
          </div>
          <p className="text-xs text-[#18181B]/80 leading-relaxed">
            Mã nguồn, workflow n8n và presigned URL tải từ Cloudflare R2 sẽ được gửi tự động đến Email và Zalo sau khi xác nhận thanh toán. Vui lòng cung cấp đúng Email và Số điện thoại.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          label={isDigital ? "Họ và tên đệm" : "First name"}
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label={isDigital ? "Tên" : "Last name"}
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <Input
          label={isDigital ? "Email nhận bản quyền & file tải" : "Email"}
          name="email"
          type="email"
          title="Nhập email chính xác để nhận link tải và bản quyền."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label={isDigital ? "Số điện thoại / Zalo hỗ trợ" : "Phone"}
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          placeholder="0912345678"
          data-testid="shipping-phone-input"
        />
      </div>

      {isDigital ? (
        <>
          <input
            type="hidden"
            name="shipping_address.address_1"
            value={formData["shipping_address.address_1"] || "Kỹ thuật số / Trực tuyến"}
          />
          <input
            type="hidden"
            name="shipping_address.city"
            value={formData["shipping_address.city"] || "Hà Nội"}
          />
          <input
            type="hidden"
            name="shipping_address.postal_code"
            value={formData["shipping_address.postal_code"] || "100000"}
          />
          <input
            type="hidden"
            name="shipping_address.country_code"
            value={formData["shipping_address.country_code"] || locale || "vn"}
          />
          <input
            type="hidden"
            name="shipping_address.company"
            value={formData["shipping_address.company"] || ""}
          />
          <input
            type="hidden"
            name="shipping_address.province"
            value={formData["shipping_address.province"] || ""}
          />
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Address"
            name="shipping_address.address_1"
            autoComplete="address-line1"
            value={formData["shipping_address.address_1"]}
            onChange={handleChange}
            required
            data-testid="shipping-address-input"
          />
          <Input
            label="Company"
            name="shipping_address.company"
            value={formData["shipping_address.company"]}
            onChange={handleChange}
            autoComplete="organization"
            data-testid="shipping-company-input"
          />
          <Input
            label="Postal code"
            name="shipping_address.postal_code"
            autoComplete="postal-code"
            value={formData["shipping_address.postal_code"]}
            onChange={handleChange}
            required
            data-testid="shipping-postal-code-input"
          />
          <Input
            label="City"
            name="shipping_address.city"
            autoComplete="address-level2"
            value={formData["shipping_address.city"]}
            onChange={handleChange}
            required
            data-testid="shipping-city-input"
          />
          <CountrySelect
            name="shipping_address.country_code"
            autoComplete="country"
            region={cart?.region}
            value={formData["shipping_address.country_code"]}
            onChange={handleChange}
            required
            data-testid="shipping-country-select"
          />
          <Input
            label="State / Province"
            name="shipping_address.province"
            autoComplete="address-level1"
            value={formData["shipping_address.province"]}
            onChange={handleChange}
            data-testid="shipping-province-input"
          />
        </div>
      )}
    </>
  )
}

export default ShippingAddress
