import OrderDetails from "@/components/organisms/OrderDefails/OrderDetails"
import OrderShipping from "@/components/organisms/OrderDefails/OrderShipping"
import OrderTotals from "@/components/organisms/OrderDefails/OrderTotals"
import OrderItems from "@/components/organisms/OrderItems/OrderItems"
import { DigitalAssetDelivery } from "@/components/organisms/DigitalAssetDelivery/DigitalAssetDelivery"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

export const OrderConfirmedSection = ({
  order,
}: {
  order: HttpTypes.StoreOrder
}) => {
  return (
    <div className="py-6">
      <div className="content-container flex flex-col justify-center items-center gap-y-6 max-w-4xl h-full w-full mx-auto">
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-component border rounded-sm w-full py-8 px-6 text-center"
          data-testid="order-complete-container"
        >
          <div className="text-center w-full">
            <Heading
              level="h1"
              className="flex flex-col gap-y-2 text-primary text-3xl mb-3 uppercase"
            >
              <span>Cảm ơn bạn đã tin tưởng Đại Việt AI!</span>
              <span className="text-xl font-normal text-secondary">Đơn hàng của bạn đã được khởi tạo thành công.</span>
            </Heading>

            <Text className="text-secondary text-sm">
              Thông tin xác nhận đơn hàng và biên lai điện tử đã được gửi tới email{" "}
              <span
                className="text-primary font-semibold"
                data-testid="order-email"
              >
                {order.email}
              </span>
              .
            </Text>
          </div>
        </div>

        {/* Widget Giao nhận tài sản số & Hỗ trợ kỹ thuật 1-1 */}
        <DigitalAssetDelivery orderId={order.id} paymentStatus={order.payment_status} />
      </div>
    </div>
  )
}
