import { HashtagIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import { useTranslation } from "next-i18next";
import React, { FC } from "react";

const SerpBadge: FC<{
  value: string;
  colors: string;
  facetId: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}> = (props) => {
  const { t } = useTranslation();
  return (
    <span
      className={
        "inline-flex items-center text-xs font-medium space-x-1 " + props.colors
      }
    >
      <props.icon className="h-4 w-4" aria-hidden="true" />
      <p>{t(`facet_${props.facetId}_value_${props.value}`, props.value)}</p>
    </span>
  );
};

export const GeoSerpBadge: FC<{ value: string }> = ({ value }) => {
  return (
    <SerpBadge
      value={value}
      //   colors="bg-amber-100 text-amber-800"
      colors="text-amber-600"
      facetId="region_country_city"
      icon={LocationMarkerIcon}
    />
  );
};

export const IntentSerpBadge: FC<{ value: string }> = ({ value }) => {
  return (
    <SerpBadge
      value={value}
      //   colors="bg-green-100 text-green-800"
      colors="text-green-600"
      facetId="what"
      icon={HashtagIcon}
    />
  );
};

export default SerpBadge;
