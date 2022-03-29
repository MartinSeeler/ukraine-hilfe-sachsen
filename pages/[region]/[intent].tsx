import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { region: "Dresden", intent: "Spenden" }, locale: "de" },
      { params: { region: "Dresden", intent: "Informationen" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log("context", context);
  return {
    // redirect: {
    //   destination: `/?valfilter.region_country_city=${
    //     context.params!.region
    //   }&valfilter.intents_level_one=${context.params!.intent}`,
    //   statusCode: 301,
    // },
    props: {},
  };
};

const GetTest = () => {
  return <div>GetTest</div>;
};

export default GetTest;
