import { extendTailwindMerge } from 'tailwind-merge';

export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      h: ['h-lh'],
      'min-h': ['min-h-lh'],
      'max-h': ['max-h-lh'],
    },
  },
});
