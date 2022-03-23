import { HeartIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="mt-8 justify-center text-base text-gray-400 flex items-center space-x-2">
          <span>Built with</span>
          <HeartIcon
            className="inline-block h-5 w-5 text-red-500"
            aria-hidden="true"
          />
          <span>
            by{" "}
            <a
              href="https://avantgarde-labs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-blue-600"
            >
              Avantgarde Labs GmbH
            </a>
          </span>
        </p>
        <nav className="mt-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/impressum">
              <a className="text-base text-gray-500 hover:text-gray-900">
                Impressum
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
