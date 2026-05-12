import { Search, X } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';

import { type KoreaDistrict, searchKoreaDistricts } from '@/entities/location';

import { DistrictSearchResults } from './DistrictSearchResults';

export type DistrictSearchProps = {
  children: ReactNode;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSelect: (value: KoreaDistrict['id']) => void;
};

export const DistrictSearch = ({ children, editing, onEditingChange, onSelect }: DistrictSearchProps) => {
  const [query, setQuery] = useState('');
  const districts = useMemo(() => searchKoreaDistricts(query).slice(0, 20), [query]);
  const showsSearchResults = !!query.trim();

  const selectDistrict = (districtId: KoreaDistrict['id']) => {
    onSelect(districtId);
    setQuery('');
  };

  return (
    <section className="flex h-full flex-col p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Weather</h1>
        <button type="button" onClick={() => onEditingChange(!editing)} className="text-sm font-medium text-blue-400">
          {editing ? '완료' : '편집'}
        </button>
      </header>

      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="도시 또는 구 검색"
          className="w-full rounded-xl border border-white/5 bg-slate-800/50 px-10 py-2.5 text-sm text-white transition-colors placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="-m-6 min-h-0 flex-1 scrollbar-none overflow-y-auto p-6 pb-10">
        {showsSearchResults ? <DistrictSearchResults districts={districts} onSelect={selectDistrict} /> : children}
      </div>
    </section>
  );
};
