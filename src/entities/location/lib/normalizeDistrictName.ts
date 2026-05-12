import { disassemble } from 'es-hangul';

export const normalizeDistrictName = (value: string) =>
  disassemble(
    value
      .trim()
      .replaceAll(/[\s_]+/g, '')
      .toLowerCase(),
  );
