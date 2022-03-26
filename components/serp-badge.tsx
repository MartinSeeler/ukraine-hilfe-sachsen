import {
  HashtagIcon,
  LocationMarkerIcon,
  TagIcon,
} from "@heroicons/react/outline";
import React, { FC } from "react";

const SerpBadge: FC<{
  value: string;
  colors: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}> = (props) => {
  return (
    <span
      className={
        "inline-flex items-center text-xs font-medium space-x-1 " + props.colors
      }
      title=""
    >
      <props.icon className="h-4 w-4" aria-hidden="true" />
      <p>{props.value}</p>
    </span>
  );
};

export const GeoSerpBadge: FC<{ value: string }> = ({ value }) => {
  return (
    <SerpBadge
      value={value}
      //   colors="bg-amber-100 text-amber-800"
      colors="text-amber-600"
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
      icon={HashtagIcon}
    />
  );
};

export default SerpBadge;
