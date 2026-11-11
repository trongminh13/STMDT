import { OrderParcels } from "@/components/organisms/OrderParcels/OrderParcels"
import { OrderTotals } from "@/components/organisms/OrderTotals/OrderTotals"
import { DigitalAssetDelivery } from "@/components/organisms/DigitalAssetDelivery/DigitalAssetDelivery"

export const OrderDetailsSection = ({ orderGroup }: { orderGroup: any }) => {
  return (
    <div className="space-y-6">
      {/* Master Digital Asset Hub - Tải tệp số & Thanh toán VietQR tập trung */}
      <DigitalAssetDelivery orderGroup={orderGroup} />
      <OrderParcels orders={orderGroup.orders} />
      <OrderTotals orderGroup={orderGroup} />
    </div>
  )
}
