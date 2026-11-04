'use client';

import { Input } from '@/components/atoms';
import {
  Accordion,
  FilterCheckboxOption,
} from '@/components/molecules';
import useFilters from '@/hooks/useFilters';
import { SearchIcon } from '@/icons';
import { useEffect, useState } from 'react';

const brandFilters = [
  { label: 'n8n Automation', amount: 5 },
  { label: 'DeepSeek LLM', amount: 3 },
  { label: 'Zalo Official Account', amount: 2 },
  { label: 'Next.js 15 Fullstack', amount: 2 },
  { label: 'Dify Agentic AI', amount: 2 },
  { label: 'Cloudflare R2', amount: 1 },
  { label: 'Make.com', amount: 1 },
  { label: 'OpenAI GPT-4o', amount: 2 },
];

export const BrandFilter = () => {
  const [brandsSearch, setBrandSearch] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState(brandFilters);
  const { updateFilters, isFilterActive } =
    useFilters('brand');

  useEffect(() => {
    if (!brandFilters) {
      setFilteredOptions(brandFilters);
    } else {
      setFilteredOptions(
        brandFilters.filter(({ label }) =>
          label
            .toLowerCase()
            .includes(brandsSearch.toLowerCase())
        )
      );
    }
  }, [brandsSearch]);

  const selectHandler = (option: string) => {
    updateFilters(option);
  };

  const searchBrandsHandler = (value: string) => {
    setBrandSearch(value);
  };

  return (
    <Accordion heading='Nền tảng / AI Model'>
      <Input
        placeholder='Tìm kiếm công nghệ...'
        icon={<SearchIcon size={20} />}
        value={brandsSearch}
        onChange={(e) =>
          searchBrandsHandler(e.target.value)
        }
      />
      <ul className='px-4 mt-4'>
        {filteredOptions.map(({ label, amount }) => (
          <li key={label} className='mb-4'>
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={!Boolean(amount)}
              onCheck={selectHandler}
              label={label}
              amount={amount}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  );
};
