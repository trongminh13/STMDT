import { Brand } from '@/types/brands';
import { BrandCard } from '@/components/organisms';
import { Carousel } from '@/components/cells';

const brands: Brand[] = [
  {
    id: 1,
    name: 'n8n Automation',
    logo: '/images/brands/n8n.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 2,
    name: 'Zalo Official Account',
    logo: '/images/brands/zalo-oa.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 3,
    name: 'DeepSeek-V3 LLM',
    logo: '/images/brands/deepseek.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 4,
    name: 'OpenAI GPT-4o',
    logo: '/images/brands/openai.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 5,
    name: 'Dify Agentic AI',
    logo: '/images/brands/dify.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 6,
    name: 'Make.com Integration',
    logo: '/images/brands/make.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 7,
    name: 'Cloudflare R2 Storage',
    logo: '/images/brands/cloudflare.svg',
    href: '/categories/tu-dong-hoa-workflow',
  },
  {
    id: 8,
    name: 'Next.js 15 Fullstack',
    logo: '/images/brands/nextjs.svg',
    href: '/categories/ma-nguon-boilerplates',
  },
];

export function HomePopularBrandsSection() {
  return (
    <section className='bg-action w-full py-10'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='heading-lg text-tertiary'>
            HỆ SINH THÁI &amp; AI MODELS HỖ TRỢ
          </h2>
        </div>
        <Carousel
          variant='dark'
          items={brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        />
      </div>
    </section>
  );
}
