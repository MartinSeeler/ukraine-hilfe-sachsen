import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { hasPath } from "ramda";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import SearchContext from "../context/search-context";

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export const ValueFacetEntry: FC<{
  facetKey: string;
  facetValue: string;
  count: number;
  selected: boolean;
}> = ({ facetKey: facetId, facetValue: value, count, selected }) => {
  const { t } = useTranslation();
  // const { onValueFacetClick } = useSearchQueryParams();

  return (
    <li
      className={
        "w-full flex relative px-4 py-2 cursor-pointer group " +
        (selected ? "bg-blue-50" : "bg-white hover:bg-gray-50")
      }
      // onClick={() => onValueFacetClick(facetId, value)}
    >
      {selected && (
        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600" />
      )}
      <span
        className={"truncate sm:text-sm " + (selected ? "text-blue-600" : "")}
      >
        {t(`facet_${facetId}_value_${value}`, value)}
      </span>
      <span
        className={classNames(
          selected
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
          "ml-auto inline-block py-0.5 px-3 sm:text-xs rounded-full"
        )}
      >
        {count}
      </span>
    </li>
  );
};

export const DesktopValueFacet: FC<{
  facetId: string;
  facetName: string;
  entries: { value: string; count: number }[];
}> = ({ facetId, facetName, entries }) => {
  const { t } = useTranslation();
  const { activeValFilters } = useContext(SearchContext);
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-10 divide-y divide-gray-200">
      <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700 text-sm">
        {t(`facet_${facetId}_title`, facetName)}
      </div>
      <ul className="">
        {entries.map((option: { value: string; count: number }) => (
          <ValueFacetEntry
            key={
              facetId +
              "-" +
              option.value +
              "-" +
              option.count +
              "-" +
              (activeValFilters[facetId]?.includes(option.value) ?? false)
            }
            facetKey={facetId}
            facetValue={option.value}
            count={option.count}
            selected={
              activeValFilters[facetId]?.includes(option.value) ?? false
            }
          />
        ))}
      </ul>
    </div>
  );
};

export const MobileValueFacet: FC<{
  facetId: string;
  facetName: string;
  entries: { value: string; count: number }[];
}> = ({ facetId, facetName, entries }) => {
  const { t } = useTranslation();
  return (
    <Disclosure as="div" className="border-t border-gray-200 pt-4 pb-4">
      {({ open }) => (
        <fieldset>
          <legend className="w-full px-2">
            <Disclosure.Button className="w-full p-2 flex items-center justify-between text-gray-400 hover:text-gray-500">
              <span className="text-sm font-medium text-gray-900">
                {t(`facet_${facetId}_title`, facetName)}
              </span>
              <span className="ml-6 h-7 flex items-center">
                <ChevronDownIcon
                  className={classNames(
                    open ? "-rotate-180" : "rotate-0",
                    "h-5 w-5 transform"
                  )}
                  aria-hidden="true"
                />
              </span>
            </Disclosure.Button>
          </legend>
          <Disclosure.Panel className="pt-4 pb-2">
            <ul className="">
              {entries.map((option: { value: string; count: number }) => (
                <ValueFacetEntry
                  key={
                    facetId + "-" + option.value + "-" + option.count + "-"
                    // paramValues.includes(option.value)
                  }
                  facetKey={facetId}
                  facetValue={option.value}
                  count={option.count}
                  selected={false}
                  // selected={paramValues.includes(option.value)}
                />
              ))}
            </ul>
          </Disclosure.Panel>
        </fieldset>
      )}
    </Disclosure>
  );
};
