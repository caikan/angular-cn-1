/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CldrData} from '../cldr-data';
import {generateBaseCurrenciesFile} from '../locale-base-currencies';

import {BASE_LOCALE} from './base-locale';

/**
 * Generates the base currencies file and prints it to the stdout.
 *
 * 生成基础货币文件并将其打印到标准输出。
 *
 */
function main() {
  const cldrData = new CldrData();
  const baseLocaleData = cldrData.getLocaleData(BASE_LOCALE)!;

  process.stdout.write(generateBaseCurrenciesFile(baseLocaleData));
}

if (require.main === module) {
  main();
}
