import { ChevronRight, MapPin } from 'lucide-react';

import type { KoreaDistrict } from '@/entities/location';

export type DistrictSearchResultsProps = {
  districts: KoreaDistrict[];
  variant?: 'desktop' | 'mobile';
  onSelect: (value: KoreaDistrict['id']) => void;
};

export const DistrictSearchResults = ({ districts, variant = 'desktop', onSelect }: DistrictSearchResultsProps) => {
  if (districts.length === 0) {
    return variant === 'mobile' ? (
      <div className="py-20 text-center text-slate-500">
        <p className="mb-1 text-lg font-medium">검색 결과가 없습니다.</p>
        <p className="text-sm">정확한 시, 군, 구 명칭을 입력해주세요.</p>
      </div>
    ) : (
      <p className="py-10 text-center text-sm text-slate-500">검색 결과가 없습니다.</p>
    );
  }

  return (
    <div className={variant === 'mobile' ? undefined : 'space-y-1'}>
      {districts.map((district) => (
        <button
          key={district.id}
          type="button"
          onClick={() => onSelect(district.id)}
          className={
            variant === 'mobile'
              ? 'flex w-full items-center justify-between rounded-2xl border-b border-white/5 px-5 py-4 text-left transition-colors last:border-none hover:bg-white/10'
              : 'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none'
          }
        >
          <span className="flex min-w-0 items-center gap-3">
            <MapPin size={variant === 'mobile' ? 20 : 18} className="shrink-0 text-slate-500" />
            <span className="min-w-0">
              <span className={variant === 'mobile' ? 'block font-bold' : 'block text-sm font-medium text-white'}>
                {district.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{district.fullName}</span>
            </span>
          </span>
          <ChevronRight size={variant === 'mobile' ? 18 : 16} className="ml-auto shrink-0 text-slate-600" />
        </button>
      ))}
    </div>
  );
};
