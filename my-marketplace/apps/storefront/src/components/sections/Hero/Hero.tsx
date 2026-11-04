import Image from "next/image"

import tailwindConfig from "../../../../tailwind.config"
import { ArrowRightIcon } from "@/icons"
import Link from "next/link"

type HeroProps = {
  image: string
  heading: string
  paragraph: string
  buttons: { label: string; path: string }[]
}

export const Hero = ({ image, heading, paragraph, buttons }: HeroProps) => {
  return (
    <section className="w-full flex container mx-auto px-4 lg:px-8 mt-4 lg:mt-8 flex-col lg:flex-row gap-4 lg:gap-0 text-primary">
      <div className="w-full lg:w-1/2 order-2 lg:order-1 rounded-sm overflow-hidden flex">
        <Image
          src={decodeURIComponent(image)}
          width={700}
          height={600}
          alt={`Hero banner - ${heading}`}
          className="w-full h-full object-cover rounded-sm"
          priority
          fetchPriority="high"
          quality={80}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      <div className="w-full lg:w-1/2 lg:order-2 flex flex-col justify-between">
        <div className="border rounded-sm w-full px-6 flex items-end h-[calc(100%-144px)] min-h-[320px]">
          <div>
            <h2 className="font-bold mb-6 uppercase display-md max-w-[652px] text-3xl md:text-4xl lg:text-5xl leading-tight">
              {heading}
            </h2>
            <p className="text-base md:text-lg mb-8 text-secondary">{paragraph}</p>
          </div>
        </div>
        {buttons.length > 0 && (
          <div className="h-[72px] lg:h-[144px] flex font-bold uppercase mt-auto">
            {buttons.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className="group flex border rounded-sm h-full w-1/2 bg-content hover:bg-action hover:text-tertiary transition-all duration-300 p-6 justify-between items-end"
                aria-label={label}
                title={label}
              >
                <span>
                  <span className="group-hover:inline-flex hidden">#</span>
                  {label}
                </span>

                <ArrowRightIcon
                  color={tailwindConfig.theme.extend.backgroundColor.primary}
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
