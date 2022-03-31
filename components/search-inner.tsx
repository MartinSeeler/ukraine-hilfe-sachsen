import { Dialog, Transition } from "@headlessui/react";
import {
  LocationMarkerIcon,
  MapIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/outline";
import {
  PlusIcon,
  SupportIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { isEmpty } from "ramda";
import { isEmptyString } from "ramda-adjunct";
import { FC, Fragment, useContext, useState } from "react";
import SearchContext from "../context/search-context";
import DesktopFacetBlock from "./desktop-facet-block";
import Footer from "./footer";
import LanguageTabs from "./language-tabs";
import MobileFacetsBlock from "./mobile-facets-block";
import QuickFacetButton from "./quick-facet-button";
import SearchInput from "./search-input";
import SerpHits from "./serp-hits";
import SocialSeoTags from "./social-seo-tags";

const SearchInner: FC = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { t } = useTranslation();
  const { onReset, activeValFilters, query, searchResults } =
    useContext(SearchContext);
  return (
    <div className="">
      <SocialSeoTags />
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {t("filters_more", "Mehr Filter")}
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <MobileFacetsBlock />
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        <div className="max-w-2xl mx-auto px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <LanguageTabs />
        </div>
        <main className="max-w-2xl mx-auto px-4 py-5 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="pb-10 sm:flex sm:items-center sm:justify-between">
            <div className="">
              <Link href="/">
                <h1 className="text-3xl inline-flex md:text-4xl font-extrabold tracking-tight text-gray-900 hover:underline hover:underline-offset-2 hover:cursor-pointer">
                  {t("homepage_title", "Ukraine Hilfe Sachsen")}
                </h1>
              </Link>
              <p className="mt-4 text-base text-gray-500">
                {t("homepage_subtitle", "Lorem ipsum ich bin ein Sub Title")}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 block md:inline-flex">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc2jeO49sgXrGloTRddNv9j_3A6no0tggN47QTy82c6um2fdw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center md:inline-flex whitespace-nowrap items-center px-6 py-2 md:py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SupportIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                {t("action_submit_link", "Link einreichen")}
              </a>
            </div>
          </div>

          <SearchInput />
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <QuickFacetButton
              facetKey={"who"}
              facetName={"Ich bin..."}
              bgColor="bg-blue-600"
              icon={UserIcon}
            />
            <QuickFacetButton
              facetKey={"region_country_city"}
              facetName={"Region / Stadt"}
              bgColor="bg-amber-500"
              icon={LocationMarkerIcon}
            />
            <QuickFacetButton
              facetKey={"what"}
              facetName={"Ich möchte..."}
              bgColor="bg-green-600"
              icon={TagIcon}
            />
          </div>
          <span className="pt-5 flex gap-x-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex flex-1 items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
            >
              <span className="flex flex-grow">
                {t("filters_more", "Mehr Filter")}
              </span>
              <span className="flex-shrink-0 h-6 w-6 inline-flex items-center justify-end">
                <PlusIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={isEmptyString(query) && isEmpty(activeValFilters)}
              className="disabled:cursor-not-allowed disabled:opacity-50 flex flex-1 items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none"
            >
              <span className="flex flex-grow">
                {t("filters_reset", "Filter zurücksetzen")}
              </span>
              <span className="flex-shrink-0 h-6 w-6 inline-flex items-center justify-end">
                <TrashIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </button>
          </span>
          <div className="pt-6 lg:pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
            <DesktopFacetBlock />
            <SerpHits />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SearchInner;
