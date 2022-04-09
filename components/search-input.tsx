import { SearchIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import React, { FC, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SearchContext from "../context/search-context";

type FormData = {
  query: string;
};

const SearchInput: FC = () => {
  const { t } = useTranslation();
  const { query, updateQuery } = useContext(SearchContext);
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      query,
    },
  });

  useEffect(() => {
    setValue("query", query);
  }, [query, setValue]);

  const onSubmit = handleSubmit((data: FormData) => {
    updateQuery(data.query);
  });

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        {t("searchbar_title", "Wonach suchst du?")}
      </label>
      <form className="mt-1 flex rounded-md shadow-sm" onSubmit={onSubmit}>
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            {...register("query")}
            autoComplete="off"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
            placeholder={t(
              "searchbar_placeholder",
              "Zum Beispiel 'Unterkunft in Dresden'..."
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setValue("query", "");
            updateQuery("");
          }}
          className="-ml-px hidden relative md:inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <XIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
        </button>
        <button
          type="submit"
          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {/* <SortAscendingIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          /> */}
          <span>{t("searchbar_searchbutton", "Suchen")}</span>
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
