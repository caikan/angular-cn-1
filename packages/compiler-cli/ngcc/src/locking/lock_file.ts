/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import module from 'module';

import {AbsoluteFsPath, PathManipulation} from '../../../src/ngtsc/file_system';

export function getLockFilePath(fs: PathManipulation) {
  // This is an interop allowing for the unlocking script to be determined in both
  // a CommonJS module, or an ES module which does not come with `require` by default.
  const requireFn =
      typeof require !== 'undefined' ? require : module.createRequire(__ESM_IMPORT_META_URL__);
  // The lock file location is resolved based on the location of the `ngcc` entry-point as this
  // allows us to have a consistent position for the lock file to reside. We are unable to rely
  // on `__dirname` (or equivalent) as this code is being bundled and different entry-points
  // will have dedicated bundles where the lock file location would differ then.
  const ngccEntryPointFile = requireFn.resolve('@angular/compiler-cli/package.json');
  return fs.resolve(ngccEntryPointFile, '../../../.ngcc_lock_file');
}

export interface LockFile {
  path: AbsoluteFsPath;
  /**
   * Write a lock file to disk containing the PID of the current process.
   *
   * 将锁定文件写入包含当前进程的 PID 的磁盘。
   *
   */
  write(): void;

  /**
   * Read the PID, of the process holding the lock, from the lock-file.
   *
   * 从 lock-file 中读取持有锁的进程的 PID。
   *
   * It is feasible that the lock-file was removed between the call to `write()` that effectively
   * checks for existence and this attempt to read the file. If so then this method should just
   * gracefully return `"{unknown}"`.
   *
   * 在有效检查是否存在的 `write()`
   * 调用与读取文件的尝试之间删除锁定文件是可行的。如果是这样，那么此方法应该只是优雅地返回
   * `"{unknown}"` 。
   *
   */
  read(): string;

  /**
   * Remove the lock file from disk, whether or not it exists.
   *
   * 从磁盘中删除锁定文件，无论它是否存在。
   *
   */
  remove(): void;
}
