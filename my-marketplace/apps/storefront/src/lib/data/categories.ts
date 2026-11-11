import { HttpTypes } from '@medusajs/types';

import { sdk } from '@/lib/client';
import { CACHE_TAGS, getGlobalCacheOptions } from './cache-tags';

interface CategoriesProps {
  query?: Record<string, unknown>;
}

// Product Taxonomy 1.0 for Digital & AI Products
export const AI_CATEGORY_TAXONOMY: Record<
  string,
  {
    name: string;
    subcategories: { handle: string; name: string; description?: string }[];
  }
> = {
  'tu-dong-hoa-workflow': {
    name: 'Tự động hóa & Workflow',
    subcategories: [
      {
        handle: 'n8n-workflows',
        name: 'n8n Workflows',
        description: 'Kịch bản n8n tự động hóa doanh nghiệp & AI Agent',
      },
      {
        handle: 'dify-agents',
        name: 'Dify Agents & Workflows',
        description: 'Ứng dụng & Agent thông minh trên nền tảng Dify',
      },
      {
        handle: 'make-blueprints',
        name: 'Make.com Blueprints',
        description: 'Kịch bản tích hợp đa kênh Make / Zapier',
      },
      {
        handle: 'chatbot-voicebot',
        name: 'Chatbot & Voicebot Flows',
        description: 'Luồng trợ lý ảo tư vấn & CSKH đa kênh',
      },
    ],
  },
  'ma-nguon-boilerplates': {
    name: 'Mã nguồn & Boilerplates',
    subcategories: [
      {
        handle: 'nextjs-ai-saas',
        name: 'Next.js AI SaaS Boilerplates',
        description: 'Khung ứng dụng AI SaaS đầy đủ thanh toán & auth',
      },
      {
        handle: 'fastapi-python-rag',
        name: 'FastAPI & Python RAG Kits',
        description: 'Backend AI hiệu năng cao, vector database',
      },
      {
        handle: 'scripts-automation',
        name: 'Scripts & Automation Tools',
        description: 'Tool cào dữ liệu, xử lý ảnh & video tự động',
      },
      {
        handle: 'apis-microservices',
        name: 'AI APIs & Microservices',
        description: 'Cổng dịch vụ AI độc lập, dễ tích hợp',
      },
    ],
  },
  'phan-mem-tien-ich-so': {
    name: 'Phần mềm & Tiện ích số',
    subcategories: [
      {
        handle: 'chrome-extensions',
        name: 'Chrome Extensions',
        description: 'Tiện ích mở rộng trình duyệt tăng năng suất',
      },
      {
        handle: 'plugins-addons',
        name: 'Plugins & Add-ons',
        description: 'Plugin Figma, Notion, Google Workspace',
      },
      {
        handle: 'micro-saas',
        name: 'Micro SaaS Web Apps',
        description: 'Ứng dụng web chuyên biệt giải quyết bài toán cụ thể',
      },
      {
        handle: 'desktop-tools',
        name: 'Desktop Tools & Utilities',
        description: 'Công cụ chạy offline, xử lý dữ liệu bảo mật',
      },
    ],
  },
  'goi-tri-thuc-prompt-ai': {
    name: 'Gói tri thức & Prompt AI',
    subcategories: [
      {
        handle: 'prompts-ky-thuat',
        name: 'Prompts Kỹ thuật & Coding',
        description: 'System prompt chuyên sâu cho Claude & GPT',
      },
      {
        handle: 'prompts-marketing',
        name: 'Prompts Marketing & Content',
        description: 'Kịch bản content, SEO, quảng cáo tự động',
      },
      {
        handle: 'rag-datasets',
        name: 'RAG Knowledge Datasets',
        description: 'Bộ dữ liệu tri thức sạch đã vector hóa',
      },
      {
        handle: 'ai-personas',
        name: 'AI Personas & Fine-tuning',
        description: 'Bộ tính cách chuyên gia & dữ liệu mẫu',
      },
    ],
  },
  'dich-vu-cai-dat-chuyen-mon': {
    name: 'Dịch vụ cài đặt chuyên môn',
    subcategories: [
      {
        handle: 'cai-dat-1-1',
        name: 'Cài đặt & Triển khai 1-1',
        description: 'Hỗ trợ setup qua UltraViewer / AnyDesk',
      },
      {
        handle: 'custom-workflows',
        name: 'Tùy biến Workflow Doanh nghiệp',
        description: 'Thiết kế luồng tự động hóa theo yêu cầu',
      },
      {
        handle: 'dao-tao-chuyen-giao',
        name: 'Đào tạo & Chuyển giao AI',
        description: 'Khóa huấn luyện nội bộ cho đội ngũ',
      },
      {
        handle: 'bao-tri-toi-uu',
        name: 'Bảo trì & Tối ưu Hệ thống AI',
        description: 'Giám sát vận hành, tối ưu chi phí token API',
      },
    ],
  },
};

// Legacy fashion demo categories to filter out
const LEGACY_CATEGORY_HANDLES = new Set([
  'sandals',
  'sneakers',
  'boots',
  'sport',
  'accessories',
  'slides',
  'flip-flops',
  'clogs',
  'low-top',
  'high-top',
  'retro',
  'chelsea-boots',
  'winter-boots',
  'work-boots',
  'football',
  'running',
  'basketball',
  'bags',
  'headwear',
  'wallets',
  'clothing',
  'footwear',
  'menswear',
  'womenswear',
]);

const buildStandardAiCategories = (): {
  parentCategories: HttpTypes.StoreProductCategory[];
  categories: HttpTypes.StoreProductCategory[];
} => {
  const parents: HttpTypes.StoreProductCategory[] = [];
  const allSubcategories: HttpTypes.StoreProductCategory[] = [];

  let pRank = 0;
  for (const [parentHandle, meta] of Object.entries(AI_CATEGORY_TAXONOMY)) {
    const parentId = `pcat_${parentHandle.replace(/-/g, '_')}`;
    const children: HttpTypes.StoreProductCategory[] = meta.subcategories.map(
      (sub, cRank) => {
        const childId = `cat_${sub.handle.replace(/-/g, '_')}`;
        const childCat = {
          id: childId,
          name: sub.name,
          handle: sub.handle,
          description: sub.description || '',
          is_active: true,
          is_internal: false,
          rank: cRank,
          parent_category_id: parentId,
          parent_category: null,
          category_children: [],
          products: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          external_id: null,
          metadata: null,
        } as unknown as HttpTypes.StoreProductCategory;
        allSubcategories.push(childCat);
        return childCat;
      }
    );

    const parentCat = {
      id: parentId,
      name: meta.name,
      handle: parentHandle,
      description: meta.name,
      is_active: true,
      is_internal: false,
      rank: pRank++,
      parent_category_id: null,
      parent_category: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      external_id: null,
      metadata: null,
      category_children: children,
      products: [],
    } as unknown as HttpTypes.StoreProductCategory;

    parents.push(parentCat);
  }

  return {
    parentCategories: parents,
    categories: allSubcategories,
  };
};

export const listCategories = async ({ query }: Partial<CategoriesProps> = {}) => {
  const limit = query?.limit || 100;

  let rawCategories: HttpTypes.StoreProductCategory[] = [];
  try {
    const res = (await (sdk.store.productCategories
      .query({
        fields:
          'id,handle,name,rank,metadata,parent_category_id,description,*category_children',
        include_descendants_tree: true,
        include_ancestors_tree: true,
        limit,
        ...query,
        fetchOptions: {
          cache: 'force-cache',
          next: getGlobalCacheOptions(CACHE_TAGS.categories),
        },
      } as never) as unknown as Promise<{
      product_categories: HttpTypes.StoreProductCategory[];
    }>)) as { product_categories: HttpTypes.StoreProductCategory[] };
    rawCategories = res?.product_categories || [];
  } catch {
    rawCategories = [];
  }

  // Filter out legacy fashion/shoe categories
  const filteredFromDb = rawCategories.filter((cat) => {
    const handle = (cat.handle || '').toLowerCase();
    const name = (cat.name || '').toLowerCase();
    return (
      !LEGACY_CATEGORY_HANDLES.has(handle) &&
      !LEGACY_CATEGORY_HANDLES.has(name)
    );
  });

  const standard = buildStandardAiCategories();

  // If DB categories are empty or do not contain AI categories, use the full standard taxonomy
  if (filteredFromDb.length === 0) {
    return standard;
  }

  // If DB has AI parent categories, merge standard subcategories if DB subcategories are missing
  const parentCategories: HttpTypes.StoreProductCategory[] = [];
  const allSubcategories: HttpTypes.StoreProductCategory[] = [];

  for (const stdParent of standard.parentCategories) {
    const dbParent = filteredFromDb.find(
      (c) => c.handle === stdParent.handle && !c.parent_category_id
    );

    if (dbParent) {
      const dbChildren = filteredFromDb.filter(
        (c) => c.parent_category_id === dbParent.id
      );

      const resolvedChildren =
        dbChildren.length > 0
          ? dbChildren
          : (stdParent.category_children || []).map((ch) => ({
              ...ch,
              parent_category_id: dbParent.id,
            }));

      parentCategories.push({
        ...dbParent,
        name: stdParent.name,
        category_children: resolvedChildren,
      });
      allSubcategories.push(...resolvedChildren);
    } else {
      parentCategories.push(stdParent);
      if (stdParent.category_children) {
        allSubcategories.push(...stdParent.category_children);
      }
    }
  }

  return {
    parentCategories,
    categories: allSubcategories,
  };
};

export const getCategoryByHandle = async (categoryHandle: string) => {
  if (LEGACY_CATEGORY_HANDLES.has(categoryHandle.toLowerCase())) {
    return null;
  }

  try {
    const res = (await (sdk.store.productCategories
      .query({
        fields: 'id,name,handle,parent_category_id,*category_children',
        handle: categoryHandle,
        include_descendants_tree: true,
        fetchOptions: {
          cache: 'force-cache',
          next: getGlobalCacheOptions(
            CACHE_TAGS.categories,
            CACHE_TAGS.category(categoryHandle)
          ),
        },
      } as never) as unknown as Promise<HttpTypes.StoreProductCategoryListResponse>)) as HttpTypes.StoreProductCategoryListResponse;

    const cat = res?.product_categories?.[0] ?? null;
    if (cat && !LEGACY_CATEGORY_HANDLES.has((cat.handle || '').toLowerCase())) {
      if (
        !cat.parent_category_id &&
        (!cat.category_children || cat.category_children.length === 0)
      ) {
        const taxonomyEntry = AI_CATEGORY_TAXONOMY[cat.handle];
        if (taxonomyEntry) {
          return {
            ...cat,
            name: taxonomyEntry.name,
            category_children: taxonomyEntry.subcategories.map((sub, idx) => ({
              id: `cat_${sub.handle.replace(/-/g, '_')}`,
              name: sub.name,
              handle: sub.handle,
              description: sub.description || '',
              is_active: true,
              is_internal: false,
              rank: idx,
              parent_category_id: cat.id,
              parent_category: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
              external_id: null,
              metadata: null,
              category_children: [],
              products: [],
            })),
          } as unknown as HttpTypes.StoreProductCategory;
        }
      }
      return cat;
    }
  } catch {
    // ignore
  }

  const standard = buildStandardAiCategories();
  const parent = standard.parentCategories.find((c) => c.handle === categoryHandle);
  if (parent) return parent;

  const child = standard.categories.find((c) => c.handle === categoryHandle);
  if (child) return child;

  return null;
};

// Medusa's `/store/products?category_id=` filters by the exact category only —
// it does not walk into descendants. To make a parent category page list every
// product beneath it, collect the whole subtree of ids and pass them all.
export const collectCategorySubtreeIds = (
  category: Pick<HttpTypes.StoreProductCategory, 'id' | 'category_children'>
): string[] => {
  const ids = [category.id];
  for (const child of category.category_children ?? []) {
    ids.push(...collectCategorySubtreeIds(child));
  }
  return ids;
};
