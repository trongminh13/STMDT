import Image from "next/image"

import tailwindConfig from "../../../../tailwind.config"
import { ArrowRightIcon } from "@/icons"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

type HeroProps = {
  image: string
  heading: string
  paragraph: string
  buttons: { label: string; path: string }[]
}

export const Hero = ({ image, heading, paragraph, buttons }: HeroProps) => {
  return (
    <section className="w-full flex container mt-4 lg:mt-6 flex-col text-primary">
      {/* Cột 1: Ảnh Banner trực quan (Tạm thời comment ẩn theo yêu cầu) */}
      {/*
      <div className="w-full lg:w-1/2 flex">
        <Image
          src={decodeURIComponent(image)}
          width={700}
          height={600}
          alt={`Hero banner - ${heading}`}
          className="w-full h-auto object-cover rounded-sm border border-secondary/20 shadow-sm"
          priority
          fetchPriority="high"
          quality={85}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      */}

      {/* Cột 2: Khung Nội dung & Nút Bấm đặt sát bên trái theo yêu cầu */}
      <div className="w-full max-w-3xl lg:max-w-4xl flex flex-col justify-between">
        <div className="border border-b-0 border-secondary/30 rounded-t-sm w-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between flex-1 min-h-[260px] bg-primary">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 text-xs font-medium uppercase tracking-wider mb-4 text-secondary">
              <span className="w-2 h-2 rounded-full bg-positive inline-block animate-pulse" />
              Sàn Thương Mại Điện Tử AI & Hàng Số
            </div>
            <h1 className="font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-3xl xl:text-4xl leading-tight">
              {heading}
            </h1>
          </div>
          <p className="text-base lg:text-lg text-secondary mt-4 mb-2 max-w-xl">
            {paragraph}
          </p>
        </div>

        {buttons.length > 0 && (
          <div className="h-[64px] lg:h-[72px] flex font-bold uppercase">
            {buttons.map(({ label, path }, idx) => (
              <LocalizedClientLink
                key={path}
                href={path}
                className={`group flex border border-secondary/30 ${
                  idx === 0 ? "rounded-bl-sm border-r-0" : "rounded-br-sm"
                } h-full w-1/2 bg-content hover:bg-action hover:text-tertiary transition-all duration-300 px-6 py-4 justify-between items-center text-sm lg:text-base`}
                aria-label={label}
                title={label}
              >
                <span>
                  <span className="group-hover:inline-flex hidden mr-1">#</span>
                  {label}
                </span>

                <ArrowRightIcon
                  color={tailwindConfig.theme.extend.backgroundColor.primary}
                  aria-hidden
                />
              </LocalizedClientLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
