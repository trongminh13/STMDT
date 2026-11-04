import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-primary container mx-auto px-4 lg:px-8 mb-8" data-testid="footer">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="p-6 border rounded-sm" data-testid="footer-customer-services">
          <h2 className="heading-sm text-primary mb-3 uppercase">
            Hỗ Trợ Khách Hàng
          </h2>
          <nav className="space-y-3" aria-label="Customer services navigation">
            {footerLinks.customerServices.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border rounded-sm" data-testid="footer-about">
          <h2 className="heading-sm text-primary mb-3 uppercase">Về Đại Việt AI</h2>
          <nav className="space-y-3" aria-label="About navigation">
            {footerLinks.about.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border rounded-sm" data-testid="footer-connect">
          <h2 className="heading-sm text-primary mb-3 uppercase">Kết Nối &amp; Cộng Đồng</h2>
          <nav className="space-y-3" aria-label="Social media navigation">
            {footerLinks.connect.map(({ label, path }) => (
              <a
                aria-label={`Go to ${label} page`}
                title={`Go to ${label} page`}
                key={label}
                href={path}
                className="block label-md"
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="py-6 border rounded-sm mt-4 bg-component" data-testid="footer-copyright">
        <p className="text-md text-secondary text-center">
          © 2026 Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số &amp; AI. Nền tảng chuyên biệt cho Workflow, Mã nguồn &amp; Dịch vụ AI thực chiến.
        </p>
      </div>
    </footer>
  )
}
