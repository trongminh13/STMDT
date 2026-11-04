import { authenticate } from "@medusajs/framework/http"
import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      method: ["GET"],
      matcher: "/store/orders/:id/digital-assets",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
      ],
    },
    {
      method: ["POST"],
      matcher: "/store/orders/:id/payos-payment",
      middlewares: [
        authenticate("customer", ["session", "bearer"], {
          allowUnauthenticated: true,
        }),
      ],
    },
  ],
})
