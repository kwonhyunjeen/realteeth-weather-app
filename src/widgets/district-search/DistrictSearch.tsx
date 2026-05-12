import { type ReactNode, useMemo, useState } from 'react';

import { type KoreaDistrict, searchKoreaDistricts } from '@/entities/location';

export type DistrictSearchProps = {
  children: ReactNode;
  onSelect: (value: KoreaDistrict['id']) => void;
};

const MAX_RESULT_COUNT = 20;

export const DistrictSearch = ({ children, onSelect }: DistrictSearchProps) => {
  const [query, setQuery] = useState('');
  const districts = useMemo(() => searchKoreaDistricts(query).slice(0, MAX_RESULT_COUNT), [query]);
  const showsSearchResults = !!query.trim();

  return (
    <section className="flex h-full flex-col">
      <div className="p-4 pb-0">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">지역 검색</span>
          <input
            type="search"
            value={query}
            onBlur={() => setQuery('')}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="시, 구, 동 검색"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        {showsSearchResults ? (
          <>
            {districts.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">검색 결과가 없습니다.</p>}
            <ul className="space-y-1 px-4">
              {districts.map((district) => (
                <li key={district.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      // input blur 이벤트를 방지하기 위해 필요
                      event.preventDefault();
                    }}
                    onClick={() => {
                      onSelect(district.id);
                      setQuery('');
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                  >
                    <span className="block font-medium text-slate-900">{district.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{district.fullName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          children
        )}
      </div>
    </section>
  );
};
