import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "./ui/theme-toggle";
import { Dispatch, SetStateAction, useState } from "react";
import { filtersType } from "@/lib/types";
import { Input } from "./ui/input";

function SearchBar({
  setSearchQuery,
  searchQuery,
}: {
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
}) {
  "use client";
  return (
    <div>
      <Input
        type="search"
        placeholder="What are you looking for?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

function TodosSelect({
  setFilterBy,
}: {
  setFilterBy: Dispatch<SetStateAction<filtersType>>;
}) {
  const options = ["all", "complete", "incomplete"];

  return (
    <Select
      onValueChange={(value) => setFilterBy(value as filtersType)}
      defaultValue={options[0]}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="status" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const Navbar = ({
  setFilterBy,
  setSearchQuery,
  searchQuery,
}: {
  setFilterBy: Dispatch<SetStateAction<filtersType>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
}) => {
  return (
    <header>
      <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      <TodosSelect setFilterBy={setFilterBy} />
      <ModeToggle />
    </header>
  );
};

export default Navbar;
