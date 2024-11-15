"use client"

import { ChangeEvent } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Input } from "../../../components/ui/input";
import { useQueryState, parseAsString } from "nuqs";

declare type SearchCountryInputProps = {
  onClickHandler?: (value: string) => void;
};

export default function SearchCountryInput({ onClickHandler }: SearchCountryInputProps) {
  const [name, setName] = useQueryState(
    "name",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true, history: 'push' })
  )

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (onClickHandler) onClickHandler(e.target.value);
  }
  return (
    <div className="flex items-center justify-center gap-x-2 bg-white shadow-md px-4 select-none dark:bg-darkBlue dark:text-white">
      <IoSearchSharp className="size-6 text-muted-foreground dark:text-white" />
      <Input
        type="text"
        className="text-darkGray dark:bg-darkBlue dark:text-white"
        value={name}
        onChange={(e) => onChangeHandler(e)}
        placeholder="Search for a country..."
      />
    </div>
  )
}
