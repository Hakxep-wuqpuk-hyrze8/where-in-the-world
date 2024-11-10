"use client"

import { Button } from '@/components/ui/button';
import useDebounce from '@/hooks/use-debounce';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useGetAllCountry } from '../api/use-get-all-country';
import { useGetCountryByName } from '../api/use-get-country-by-name';
import CountryCard from './country-card';
import PaginationBar from './pagination-bar';

export default function CountryTable() {
  const FIELDSQUERY = "name,capital,population,region,flags,cca3";
  const PERPAGE = 12;

  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const region = searchParams.get('region')
  const pageIdParam = useParams().pageId as string;
  const page = pageIdParam ? parseInt(pageIdParam, 10) : 1;

  const queryParams = Object.fromEntries(searchParams.entries());

  const isSearched = !!name;
  const debouncedName = useDebounce(name, 1000);

  const { data: allCountryQuery } = useGetAllCountry(FIELDSQUERY, !isSearched);
  const { data: countryQuery } = useGetCountryByName(debouncedName || "", FIELDSQUERY, isSearched);

  let filteredCountry: CountryType[] | undefined;
  if (!debouncedName) {
    filteredCountry = allCountryQuery?.data;
  } else {
    filteredCountry = countryQuery?.data;
  }

  if (region && filteredCountry) {
    filteredCountry = filteredCountry.filter((country) => country.region === region);
  }

  const totalItems = filteredCountry?.length || 0;
  const totalPages = Math.ceil(totalItems / PERPAGE);
  const paginatedData = filteredCountry?.slice((page - 1) * PERPAGE, page * PERPAGE);

  return (
    <div>
      <div className="grid grid-cols-4 gap-8">
        {paginatedData?.map((data) => {
          return (
            <CountryCard key={data.cca3} code={data.cca3} name={data.name.common} image={data.flags.svg} region={data.region} capital={data.capital} population={data.population} imageAlt={data.flags.alt} />
          )
        })}
      </div>

      <PaginationBar currentPage={page} totalPages={totalPages} queryParams={queryParams} />
    </div>
  )
}