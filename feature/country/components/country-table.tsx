import { useSearchParams } from 'next/navigation';
import CountryCard from './country-card';
import PaginationBar from './pagination-bar';
import Image from 'next/image';
import { getAllCountries, getCountriesByName } from '../query';
import { TOTAL_CARD_PER_PAGE } from '@/lib/constants';

export default async function CountryTable() {
  const FIELDSQUERY = "name,capital,population,region,flags,cca3";
  const searchParams = useSearchParams()
  const queryParams = Object.fromEntries(searchParams.entries());
  const name = queryParams["name"];
  const region = queryParams["region"];
  const pageQuery = queryParams["page"];
  const page = pageQuery ? parseInt(pageQuery, 10) : 1;

  let countries: Array<CountryType>

  if (name) {
    countries = await getCountriesByName(name, FIELDSQUERY);
  } else {
    countries = await getAllCountries(FIELDSQUERY);
  }

  if (region && countries && Array.isArray(countries)) {
    countries = countries.filter((country) => country.region === region);
  }

  const totalItems = countries?.length || 0;
  const totalPages = Math.ceil(totalItems / TOTAL_CARD_PER_PAGE);
  const paginatedData = Array.isArray(countries)
    ? countries.slice((page - 1) * TOTAL_CARD_PER_PAGE, page * TOTAL_CARD_PER_PAGE)
    : null;

  if (!paginatedData || paginatedData.length === 0) {
    return (
      <div className="h-full w-full flex flex-col gap-y-8 items-center justify-center">
        <Image src="/nodata.svg" alt="No Data" width="210" height="240" className="object-cover" />
        <p className="text-xl font-bold text-red-500">No Country Found!</p>
      </div>
    );
  }

  return (
    <div className="size-full">
      <div className="grid grid-cols-4 gap-8">
        {paginatedData?.map((data) => {
          return (
            <CountryCard key={data.cca3} code={data.cca3} name={data.name.official} image={data.flags.svg} region={data.region} capital={data.capital} population={data.population} imageAlt={data.flags.alt} />
          )
        })}
      </div>

      <PaginationBar currentPage={page} totalPages={totalPages} queryParams={queryParams} />
    </div>
  )
}
