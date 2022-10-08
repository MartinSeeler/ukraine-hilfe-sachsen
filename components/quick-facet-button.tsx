import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import { pathOr, prop, sortBy } from "ramda";
import React, { FC, Fragment, useContext, useEffect, useState } from "react";
import SearchContext from "../context/search-context";
import { ValueFacetEntry } from "./value-facet";

const QuickFacetButton: FC<{
  facetKey: string;
  facetName: string;
  bgColor: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}> = (props) => {
  const { t } = useTranslation();

  const { response, activeValFilters, onResetFacetByKey } =
    useContext(SearchContext);

  const [currentValues, setCurrentValues] = useState<string[]>(
    activeValFilters[props.facetKey] || []
  );
  const [open, setOpen] = useState(false);

  const [facetValues, setFacetValues] = useState(
    sortBy(
      prop("value"),
      pathOr<{ value: string; count: number }[]>(
        [],
        ["facets", props.facetKey, 0, "data"],
        response
      )
    )
  );

  useEffect(() => {
    setFacetValues(
      sortBy(
        prop("value"),
        pathOr<{ value: string; count: number }[]>(
          [],
          ["facets", props.facetKey, 0, "data"],
          response
        )
      )
    );
  }, [response]);

  useEffect(() => {
    setCurrentValues(activeValFilters[props.facetKey] || []);
    setOpen(false);
  }, [activeValFilters, props.facetKey]);

  return (
    <button
      type="button"
      disabled={currentValues.length === 0 && facetValues.length === 0}
      className={
        "disabled:cursor-not-allowed disabled:opacity-50 group p-2 w-full flex items-center justify-between rounded-full border border-gray-300 shadow-sm space-x-3 text-left focus:outline-none " +
        (currentValues.length > 0 ? props.bgColor : "bg-white hover:bg-gray-50")
      }
      onClick={() => {
        if (currentValues.length > 0) {
          onResetFacetByKey(props.facetKey);
        } else {
          setOpen(true);
        }
      }}
    >
      <span className="flex items-center flex-1 min-w-0 space-x-3">
        <span className="flex-shrink-0 block">
          <props.icon
            className={
              "ml-1 h-5 w-5 " +
              (currentValues.length > 0
                ? "text-white text-opacity-75 group-hover:text-opacity-100"
                : "text-gray-400 group-hover:text-gray-500")
            }
          />
        </span>
        <span className="flex-1 block min-w-0">
          {currentValues.length > 0 ? (
            <span className="block text-sm font-medium text-white truncate">
              {t(
                `facet_${props.facetKey}_value_${currentValues[0]}`,
                currentValues[0]
              )}
              {currentValues.length > 1 && (
                <span className="text-xs">
                  {` + ${currentValues.length - 1}`}
                </span>
              )}
            </span>
          ) : (
            <span className="block text-sm font-medium text-gray-500 truncate">
              {t(`facet_${props.facetKey}_title`, props.facetName)}
            </span>
          )}
        </span>
      </span>
      <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6">
        {currentValues.length > 0 ? (
          <TrashIcon
            className="w-5 h-5 text-white text-opacity-75 group-hover:text-opacity-100"
            aria-hidden="true"
          />
        ) : (
          <PlusIcon
            className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        )}
      </span>
      <Transition.Root
        show={open}
        as={Fragment}
        key={`dialog-facet-${props.facetKey}`}
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:align-middle sm:w-sm sm:max-w-sm">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="pl-4 mt-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {t(`facet_${props.facetKey}_title`, props.facetName)}
                    </Dialog.Title>
                  </div>
                </div>
                <ul className="w-full pt-4">
                  {facetValues.map(
                    (option: { value: string; count: number }) => (
                      <ValueFacetEntry
                        key={
                          props.facetKey +
                          "-" +
                          option.value +
                          "-" +
                          option.count +
                          "-"
                        }
                        facetKey={props.facetKey}
                        facetValue={option.value}
                        count={option.count}
                        selected={false}
                      />
                    )
                  )}
                </ul>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </button>
  );
};

export default QuickFacetButton;
