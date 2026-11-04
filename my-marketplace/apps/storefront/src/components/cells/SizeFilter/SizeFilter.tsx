"use client"
import { Chip } from "@/components/atoms"
import { Accordion } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"

const licenseOptions = [
  "Standard",
  "Commercial",
  "Open Source",
  "Remote 1-1",
  "v1.0",
  "v2.0",
]

export const SizeFilter = () => {
  const { updateFilters, isFilterActive } = useFilters("license")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }

  return (
    <Accordion heading="Bản quyền / Loại gói" data-testid="filter-license">
      <ul className="grid grid-cols-2 mt-2 gap-2" data-testid="filter-license-options">
        {licenseOptions.map((option) => (
          <li key={option}>
            <Chip
              selected={isFilterActive(option)}
              onSelect={() => selectHandler(option)}
              value={option}
              className="w-full !justify-center !py-2 !font-normal"
              data-testid={`filter-license-chip-${option.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}
