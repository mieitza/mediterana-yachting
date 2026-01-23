"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function YachtFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";
  const currentGuests = searchParams.get("guests") || "";
  const currentLength = searchParams.get("length") || "";

  const hasFilters = currentType !== "all" || currentGuests || currentLength;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-bg-surface rounded-lg">
      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-muted">Type:</span>
        <Select
          value={currentType}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="motor">Motor Yacht</SelectItem>
            <SelectItem value="sailing">Sailing Yacht</SelectItem>
            <SelectItem value="catamaran">Catamaran</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guests Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-muted">Guests:</span>
        <Select
          value={currentGuests}
          onValueChange={(value) => handleFilterChange("guests", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="6">6+</SelectItem>
            <SelectItem value="8">8+</SelectItem>
            <SelectItem value="10">10+</SelectItem>
            <SelectItem value="12">12+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-muted">Length:</span>
        <Select
          value={currentLength}
          onValueChange={(value) => handleFilterChange("length", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="20">20m+</SelectItem>
            <SelectItem value="30">30m+</SelectItem>
            <SelectItem value="40">40m+</SelectItem>
            <SelectItem value="50">50m+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
