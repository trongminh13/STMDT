import { StepProgressBar } from "@/components/cells/StepProgressBar/StepProgressBar"
import { parcelStatuses, steps } from "@/lib/helpers/parcel-statuses"
import { isDigitalCart } from "@/lib/helpers/digital-cart"

export const OrderParcelStatus = ({ order }: { order: any }) => {
  const isDigital = isDigitalCart(order)
  const currentStep = parcelStatuses(order.fulfillment_status)

  if (isDigital) {
    const isCaptured = order.payment_status === "captured"
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-primary">Hình thức nhận hàng:</span>
          <span className="text-secondary">Bàn giao số trực tuyến (Cloudflare R2 & Zalo OA)</span>
        </div>
        <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
          {isCaptured ? "Bản quyền & File sẵn sàng" : "Chờ kích hoạt VietQR"}
        </span>
      </div>
    )
  }

  return (
    <div>
      <StepProgressBar steps={steps} currentStep={currentStep} />
    </div>
  )
}
