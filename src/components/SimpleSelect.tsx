import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type SimpleSelectItem = {
  label: string;
  value: string;
};

export interface SimpleSelectProps {
  options: SimpleSelectItem[];
  onChange: (value: string) => void;
  value: string;
  initialValue?: string;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options,
  onChange,
  value,
  initialValue = "Selecione uma opção",
}) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value)}
      defaultValue={initialValue}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={initialValue} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
