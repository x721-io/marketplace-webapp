import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type FilterItem = {
  key: string;
  values: string[];
};

function useQueryFilters(defaultFilters: FilterItem[] = []) {
  const [filters, setFilters] = useState<FilterItem[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const keys = Array.from(searchParams.keys());
    if (keys.length === 0) {
      setFilters(defaultFilters);
      return;
    }
    const filters: FilterItem[] = keys
      .filter((key) => {
        const value = searchParams.get(key);
        return value != null;
      })
      .map((key) => ({
        key,
        values: searchParams.get(key)!.split(",").filter(Boolean),
      }));
    setFilters(filters);
  }, []);

  const addFilterItems = (
    items: { item: FilterItem; type: "single" | "mutiple" }[]
  ) => {
    const currentFilters = structuredClone(filters);
    items.forEach((item) => {
      const index = currentFilters.findIndex(
        (ele) => ele.key === item.item.key
      );
      if (index === -1) {
        currentFilters.push(item.item);
      } else {
        const filter = currentFilters[index];
        if (item.type === "single") {
          currentFilters[index] = item.item;
        } else {
          item.item.values.forEach((val) => {
            const valueIndex = filter.values.indexOf(val);
            if (valueIndex !== -1) {
              filter.values.splice(valueIndex, 1);
            } else {
              filter.values.push(val);
            }
          });
        }
      }
    });
    const searchParams = new URLSearchParams(window.location.search);
    currentFilters.forEach((filter) => {
      if (filter.values.length > 0) {
        searchParams.set(filter.key, filter.values.join(","));
      } else {
        if (!searchParams.has(filter.key)) {
          return;
        }
        searchParams.delete(filter.key);
      }
    });
    setFilters(currentFilters);
    console.log({ currentFilters });
    window.history.replaceState(null, "", "?" + searchParams.toString());
  };

  const getFilterBykey = (key: string) => {
    return filters.find((ele) => ele.key === key);
  };

  const removeFilterItems = (keys: string[]) => {
    let currentFilters = structuredClone(filters);
    const searchParams = new URLSearchParams(window.location.search);
    keys.forEach((key) => {
      searchParams.delete(key);
      currentFilters = currentFilters.filter((filter) => filter.key !== key);
    });
    setFilters(currentFilters);
    window.history.replaceState(null, "", "?" + searchParams.toString());
  };

  return {
    filters,
    addFilterItems,
    removeFilterItems,
    getFilterBykey,
  };
}

export default useQueryFilters;
