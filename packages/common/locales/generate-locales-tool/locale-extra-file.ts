/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {removeDuplicates} from './array-deduplication';
import {CldrLocaleData} from './cldr-data';
import {getDayPeriodRules, getDayPeriodsNoAmPm} from './day-periods';
import {fileHeader} from './file-header';
import {stringify} from './object-stringify';

/**
 * Generate the contents for the extra data file
 *
 * 生成额外数据文件的内容
 *
 */
export function generateLocaleExtra(locale: string, localeData: CldrLocaleData) {
  return `${fileHeader}
const u = undefined;

export default ${generateLocaleExtraDataArrayCode(locale, localeData)};
`;
}

/**
 * Generates the "extra" locale data array (in JS-code as a string) for the given locale.
 *
 * 为给定的区域设置生成“额外的”区域设置数据数组（在 JS 代码中为字符串）。
 *
 * The array follows the data and indices as specified in the `ExtraLocaleDataIndex`
 * enum from `packages/core/src/i18n/locale_data_api.ts`.
 *
 * 该数组遵循 `packages/core/src/i18n/locale_data_api.ts` 的 `ExtraLocaleDataIndex` 枚举中指定的数据和索引。
 *
 * Extra data currently consists of day period names and rules. The non-extra locale
 * data by default only contains the universal `AM/PM` day period names.
 *
 * 额外数据当前由日期间名称和规则组成。默认情况下，非额外区域设置数据仅包含通用的 `AM/PM` 日期间名称。
 *
 * NOTE: Instances of `undefined` in the array have been replaced with the `u` identifier.
 *       This identifier is used to shorten the generated code of unprocessed locale files.
 *
 * 收集日期间规则和延长的日期间数据。
 *
 */
export function generateLocaleExtraDataArrayCode(locale: string, localeData: CldrLocaleData) {
  const dayPeriods = getDayPeriodsNoAmPm(localeData);
  const dayPeriodRules = getDayPeriodRules(localeData);

  // The JSON data for some locales may include `dayPeriods` for which no rule is defined in
  // `dayPeriodRules`. Ignore `dayPeriods` keys that lack a corresponding rule.
  //
  // As of CLDR v41, `hi-Latn` is the only locale that is affected by this issue and it is currently
  // not clear whether it is a bug on intended behavior. This is being tracked in
  // https://unicode-org.atlassian.net/browse/CLDR-15563.
  //
  // TODO(gkalpak): If this turns out to be a bug and is fixed in CLDR, restore the previous logic
  //                of expecting the exact same keys in `dayPeriods` and `dayPeriodRules`.
  const dayPeriodKeys =
      Object.keys(dayPeriods.format.narrow).filter(key => dayPeriodRules.hasOwnProperty(key));

  let dayPeriodsSupplemental: any[] = [];

  if (dayPeriodKeys.length) {
    if (dayPeriodKeys.length !== Object.keys(dayPeriodRules).length) {
      throw new Error(`Error: locale ${locale} has an incorrect number of day period rules`);
    }

    const dayPeriodsFormat = removeDuplicates([
      getValuesForKeys(dayPeriodKeys, dayPeriods.format.narrow),
      getValuesForKeys(dayPeriodKeys, dayPeriods.format.abbreviated),
      getValuesForKeys(dayPeriodKeys, dayPeriods.format.wide),
    ]);

    const dayPeriodsStandalone = removeDuplicates([
      getValuesForKeys(dayPeriodKeys, dayPeriods['stand-alone'].narrow),
      getValuesForKeys(dayPeriodKeys, dayPeriods['stand-alone'].abbreviated),
      getValuesForKeys(dayPeriodKeys, dayPeriods['stand-alone'].wide),
    ]);

    const rules = getValuesForKeys(dayPeriodKeys, dayPeriodRules);
    dayPeriodsSupplemental = [...removeDuplicates([dayPeriodsFormat, dayPeriodsStandalone]), rules];
  }

  return stringify(dayPeriodsSupplemental).replace(/undefined/g, 'u');
}

function getValuesForKeys<T>(keys: string[], obj: Record<string, T>): T[] {
  return keys.map(key => obj[key]);
}
