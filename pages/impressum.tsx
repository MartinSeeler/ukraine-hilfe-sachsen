import { FC } from "react";

const Impressum: FC = () => {
  return (
    <>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
              Legal
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Impressum
            </p>
            <h3 className="pt-12 text-base font-semibold text-gray-600 tracking-wide uppercase mt-6">
              Haftungsauschluss
            </h3>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
              Haftung für die Inhalte externer Links. Für den Inhalt der
              verlinkten Seiten sind ausschließlich deren Betreiber
              verantwortlich.
            </p>
          </div>
          <div className="mt-24 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-medium text-warm-gray-900">
                Anschrift
              </h3>
              <p className="mt-2 text-base text-gray-500 font-normal">
                <span className="block">Avantgarde Labs GmbH</span>
                <span className="block">Theresienstraße 9</span>
                <span className="block">01097 Dresden</span>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-warm-gray-900">
                Kontakt
              </h3>
              <p className="mt-2 text-base text-gray-500 font-normal">
                <span className="block">
                  <span className="font-semibold mr-1">Telefon</span>
                  +49 (0)351 215 908 34
                </span>
                <span className="block">
                  <b className="mr-1">Fax</b>+49 (0)322 241 803 84
                </span>
                <span className="block">
                  <b className="mr-1">E-Mail</b>
                  <a
                    href="mailto:info@avantgarde-labs.de"
                    className="underline underline-offset-2 hover:text-blue-600"
                  >
                    info@avantgarde-labs.de
                  </a>
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-warm-gray-900">
                Geschäftsführer
              </h3>
              <p className="mt-2 text-base text-gray-500 font-normal">
                <span className="block">Robert Glaß</span>
                <span className="block">Torsten Hartmann</span>
                <span className="block">Sandy Lucka</span>
                <span className="block">Sven Rega</span>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-warm-gray-900">
                Registergericht
              </h3>
              <p className="mt-2 text-base text-gray-500 font-normal">
                <span className="block">Amtsgericht Dresden</span>
                <span className="block">HRB 31215</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Impressum;
