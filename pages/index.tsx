import { Dialog, Transition } from "@headlessui/react";
import {
  PlusIcon,
  SupportIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next/types";
import { pathOr } from "ramda";
import { FC, Fragment, useState } from "react";
import Footer from "../components/footer";
import LanguageTabs from "../components/language-tabs";
import SearchInput from "../components/search-input";
import SocialSeoTags from "../components/social-seo-tags";
import { SearchContextProvider } from "../context/search-context";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18next = await serverSideTranslations(locale || "de", ["translation"]);
  return {
    props: { ...i18next },
  };
};

const SearchInner: FC = (props) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="">
      <SocialSeoTags
        totalHits={pathOr(
          0,
          ["info", "meta", "page", "total_results"],
          {} //searchResponse
        )}
      />
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

                {/* Filters */}
                {/* <form className="mt-4">
                  {filters.map((section) => (
                    <MobileValueFacet
                      key={section.name}
                      entries={
                        searchResponse.info?.facets[section.id][0]?.data || []
                      }
                      facetId={section.id}
                      facetName={section.name}
                    />
                  ))}
                </form> */}
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
              <h1
                className="text-3xl inline-flex md:text-4xl font-extrabold tracking-tight text-gray-900 hover:underline hover:underline-offset-2 hover:cursor-pointer"
                // onClick={onReset}
              >
                {t("homepage_title", "Ukraine Hilfe Sachsen")}
              </h1>
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
            {/* <QuickFacetButton
              facetKey={"intents_who"}
              facetName={"Ich bin..."}
              bgColor="bg-blue-600"
              icon={UserIcon}
            />
            <QuickFacetButton
              facetKey={"region_country_city"}
              facetName={"Region / Stadt"}
              bgColor="bg-amber-500"
              icon={MapIcon}
            />
            <QuickFacetButton
              facetKey={"intents_level_one"}
              facetName={"Ich möchte..."}
              bgColor="bg-green-600"
              icon={TagIcon}
            /> */}
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
              // onClick={onReset}
              // disabled={isMatchAllQuery}
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
            <aside>
              <h2 className="sr-only">{t("filters_title", "Filter")}</h2>

              <div className="hidden lg:block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  {t("filters_more", "Mehr Filter")}
                </span>
                {/* {filters.map((section) => (
                  <DesktopValueFacet
                    key={section.name}
                    entries={
                      searchResponse.info?.facets[section.id][0]?.data || []
                    }
                    facetId={section.id}
                    facetName={section.name}
                  />
                ))} */}
              </div>
            </aside>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const Search: FC = () => {
  return (
    <SearchContextProvider>
      <SearchInner />
    </SearchContextProvider>
  );
};

export default Search;
