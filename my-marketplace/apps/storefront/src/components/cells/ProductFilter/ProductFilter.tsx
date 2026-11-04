'use client';

import {
  Accordion,
  FilterCheckboxOption,
} from '@/components/molecules';
import useFilters from '@/hooks/useFilters';

const filters = [
  { label: 'Tự Động Hóa & Workflow (AUT)', amount: 5 },
  { label: 'Mã Nguồn & Boilerplates (COD)', amount: 3 },
  { label: 'Phần Mềm & Tiện Ích Số (SFT)', amount: 3 },
  { label: 'Gói Tri Thức & Prompt AI (AIC)', amount: 2 },
  { label: 'Dịch Vụ Cài Đặt Chuyên Môn (PRO)', amount: 2 },
];

export const ProductFilter = () => {
  const { updateFilters, isFilterActive } =
    useFilters('product');

  const selectHandler = (option: string) => {
    updateFilters(option);
  };

  return (
    <Accordion heading='Danh mục sản phẩm'>
      <ul className='px-4'>
        {filters.map(({ label, amount }) => (
          <li key={label} className='mb-4'>
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!amount)}
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
