/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable} from 'rxjs';

import {EventEmitter} from '../event_emitter';
import {arrayEquals, flatten} from '../util/array_utils';

function symbolIterator<T>(this: QueryList<T>): Iterator<T> {
  // @ts-expect-error accessing a private member
  return this._results[Symbol.iterator]();
}

/**
 * An unmodifiable list of items that Angular keeps up to date when the state
 * of the application changes.
 *
 * 一个不可修改的条目列表，当应用状态变化时，Angular 会保证它是最新的。
 *
 * The type of object that {@link ViewChildren}, {@link ContentChildren}, and {@link QueryList}
 * provide.
 *
 * {@link ViewChildren}、{@link ContentChildren} 和 {@link QueryList} 所提供对象的类型。
 *
 * Implements an iterable interface, therefore it can be used in both ES6
 * javascript `for (var i of items)` loops as well as in Angular templates with
 * `*ngFor="let i of myList"`.
 *
 * 实现一个可迭代接口，因此它可以用于 ES6 JavaScript 的 `for (var i of items)` 循环，和 Angular
 * 模板中的 `*ngFor="let i of myList"`。
 *
 * Changes can be observed by subscribing to the changes `Observable`.
 *
 * 可以通过订阅 `changes` 这个 `Observable` 来监听这些变化。
 *
 * NOTE: In the future this class will implement an `Observable` interface.
 *
 * 注意：将来此类将会实现 `Observable` 接口。
 *
 * @usageNotes
 *
 * ### Example
 *
 * ### 例子
 *
 * ```typescript
 * @Component ({...})
 * class Container {
 * @ViewChildren (Item) items:QueryList<Item>;
 * }
 * ```
 *
 * @publicApi
 */
export class QueryList<T> implements Iterable<T> {
  public readonly dirty = true;
  private _results: Array<T> = [];
  private _changesDetected: boolean = false;
  private _changes: EventEmitter<QueryList<T>>|null = null;

  readonly length: number = 0;
  readonly first: T = undefined!;
  readonly last: T = undefined!;

  /**
   * Returns `Observable` of `QueryList` notifying the subscriber of changes.
   *
   * 返回 `QueryList` 的 `Observable` ，通知订阅者更改。
   *
   */
  get changes(): Observable<any> {
    return this._changes || (this._changes = new EventEmitter());
  }

  /**
   * @param emitDistinctChangesOnly Whether `QueryList.changes` should fire only when actual change
   *     has occurred. Or if it should fire when query is recomputed. (recomputing could resolve in
   *     the same result)
   *
   * `QueryList.changes` 是否仅在发生实际更改时才触发。或者如果它应该在重新计算查询时触发。
   *（重新计算可以解决相同的结果）
   *
   */
  constructor(private _emitDistinctChangesOnly: boolean = false) {
    // This function should be declared on the prototype, but doing so there will cause the class
    // declaration to have side-effects and become not tree-shakable. For this reason we do it in
    // the constructor.
    // [Symbol.iterator](): Iterator<T> { ... }
    const proto = QueryList.prototype;
    if (!proto[Symbol.iterator]) proto[Symbol.iterator] = symbolIterator;
  }

  /**
   * Returns the QueryList entry at `index`.
   *
   * 返回位于 `index` 处的 QueryList 条目。
   *
   */
  get(index: number): T|undefined {
    return this._results[index];
  }

  /**
   * See
   * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
   *
   * 参见
   * [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
   */
  map<U>(fn: (item: T, index: number, array: T[]) => U): U[] {
    return this._results.map(fn);
  }

  /**
   * See
   * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
   *
   * 参见
   * [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
   */
  filter<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S): S[];
  filter(predicate: (value: T, index: number, array: readonly T[]) => unknown): T[];
  filter(fn: (item: T, index: number, array: T[]) => boolean): T[] {
    return this._results.filter(fn);
  }

  /**
   * See
   * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
   *
   * 参见
   * [Array.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
   */
  find(fn: (item: T, index: number, array: T[]) => boolean): T|undefined {
    return this._results.find(fn);
  }

  /**
   * See
   * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
   *
   * 参见
   * [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
   */
  reduce<U>(fn: (prevValue: U, curValue: T, curIndex: number, array: T[]) => U, init: U): U {
    return this._results.reduce(fn, init);
  }

  /**
   * See
   * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
   *
   * 参见
   * [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
   */
  forEach(fn: (item: T, index: number, array: T[]) => void): void {
    this._results.forEach(fn);
  }

  /**
   * See
   * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
   *
   * 参见
   * [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
   */
  some(fn: (value: T, index: number, array: T[]) => boolean): boolean {
    return this._results.some(fn);
  }

  /**
   * Returns a copy of the internal results list as an Array.
   *
   * 以数组形式返回内部结果列表的副本。
   *
   */
  toArray(): T[] {
    return this._results.slice();
  }

  toString(): string {
    return this._results.toString();
  }

  /**
   * Updates the stored data of the query list, and resets the `dirty` flag to `false`, so that
   * on change detection, it will not notify of changes to the queries, unless a new change
   * occurs.
   *
   * 更新查询列表中存储的数据，并将 `dirty` 标志重置为
   * `false`，以便当检测到变更时，除非发生新变更，否则不会通知这些查询的变更。
   *
   * @param resultsTree The query results to store
   *
   * 要存储的查询结果
   * @param identityAccessor Optional function for extracting stable object identity from a value
   *    in the array. This function is executed for each element of the query result list while
   *    comparing current query list with the new one (provided as a first argument of the `reset`
   *    function) to detect if the lists are different. If the function is not provided, elements
   *    are compared as is (without any pre-processing).
   *
   * 从数组中的值提取稳定对象标识的可选函数。此函数会为查询结果列表的每个元素执行，同时将当前查询列表与新查询列表（作为
   * `reset`
   * 函数的第一个参数提供）进行比较以检测列表是否不同。如果未提供此函数，则会按原样比较元素（不进行任何预处理）。
   *
   */
  reset(resultsTree: Array<T|any[]>, identityAccessor?: (value: T) => unknown): void {
    // Cast to `QueryListInternal` so that we can mutate fields which are readonly for the usage of
    // QueryList (but not for QueryList itself.)
    const self = this as QueryListInternal<T>;
    (self as {dirty: boolean}).dirty = false;
    const newResultFlat = flatten(resultsTree);
    if (this._changesDetected = !arrayEquals(self._results, newResultFlat, identityAccessor)) {
      self._results = newResultFlat;
      self.length = newResultFlat.length;
      self.last = newResultFlat[this.length - 1];
      self.first = newResultFlat[0];
    }
  }

  /**
   * Triggers a change event by emitting on the `changes` {@link EventEmitter}.
   *
   * 通过发出 `changes` {@link EventEmitter} 来触发变更事件。
   *
   */
  notifyOnChanges(): void {
    if (this._changes && (this._changesDetected || !this._emitDistinctChangesOnly))
      this._changes.emit(this);
  }

  /**
   * internal
   *
   * 内部
   *
   */
  setDirty() {
    (this as {dirty: boolean}).dirty = true;
  }

  /**
   * internal
   *
   * 内部
   *
   */
  destroy(): void {
    (this.changes as EventEmitter<any>).complete();
    (this.changes as EventEmitter<any>).unsubscribe();
  }

  // The implementation of `Symbol.iterator` should be declared here, but this would cause
  // tree-shaking issues with `QueryList. So instead, it's added in the constructor (see comments
  // there) and this declaration is left here to ensure that TypeScript considers QueryList to
  // implement the Iterable interface. This is required for template type-checking of NgFor loops
  // over QueryLists to work correctly, since QueryList must be assignable to NgIterable.
  [Symbol.iterator]!: () => Iterator<T>;
}

/**
 * Internal set of APIs used by the framework. (not to be made public)
 *
 * 框架使用的内部 API 集。（不公开）
 *
 */
interface QueryListInternal<T> extends QueryList<T> {
  reset(a: any[]): void;
  notifyOnChanges(): void;
  length: number;
  last: T;
  first: T;
}
