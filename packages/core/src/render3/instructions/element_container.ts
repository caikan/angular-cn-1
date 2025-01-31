/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {assertEqual, assertIndexInRange} from '../../util/assert';
import {assertHasParent} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {TAttributes, TElementContainerNode, TNodeType} from '../interfaces/node';
import {isContentQueryHost, isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TView} from '../interfaces/view';
import {assertTNodeType} from '../node_assert';
import {appendChild} from '../node_manipulation';
import {getBindingIndex, getCurrentTNode, getLView, getTView, isCurrentTNodeParent, setCurrentTNode, setCurrentTNodeAsNotParent} from '../state';
import {computeStaticStyling} from '../styling/static_styling';
import {getConstant} from '../util/view_utils';

import {createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData} from './shared';

function elementContainerStartFirstCreatePass(
    index: number, tView: TView, lView: LView, attrsIndex?: number|null,
    localRefsIndex?: number): TElementContainerNode {
  ngDevMode && ngDevMode.firstCreatePass++;

  const tViewConsts = tView.consts;
  const attrs = getConstant<TAttributes>(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, index, TNodeType.ElementContainer, 'ng-container', attrs);

  // While ng-container doesn't necessarily support styling, we use the style context to identify
  // and execute directives on the ng-container.
  if (attrs !== null) {
    computeStaticStyling(tNode, attrs, true);
  }

  const localRefs = getConstant<string[]>(tViewConsts, localRefsIndex);
  resolveDirectives(tView, lView, tNode, localRefs);

  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }

  return tNode;
}

/**
 * Creates a logical container for other nodes (<ng-container>) backed by a comment node in the DOM.
 * The instruction must later be followed by `elementContainerEnd()` call.
 *
 * 为其他节点创建逻辑容器 (<ng-container>) 由 DOM 中的注释节点支持。该指令稍后必须跟
 * `elementContainerEnd()` 调用。
 *
 * @param index Index of the element in the LView array
 *
 * LView 数组中元素的索引
 *
 * @param attrsIndex Index of the container attributes in the `consts` array.
 *
 * 容器属性在 `consts` 数组中的索引。
 *
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 *
 * 容器的本地引用在 `consts` 数组中的索引。
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * Even if this instruction accepts a set of attributes no actual attribute values are propagated to
 * the DOM (as a comment node can't have attributes). Attributes are here only for directive
 * matching purposes and setting initial inputs of directives.
 *
 * 即使此指令接受一组属性，也不会将实际的属性值传播到
 * DOM（因为注释节点不能有属性）。属性在这里仅用于指令匹配和设置指令的初始输入。
 *
 * @codeGenApi
 */
export function ɵɵelementContainerStart(
    index: number, attrsIndex?: number|null,
    localRefsIndex?: number): typeof ɵɵelementContainerStart {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;

  ngDevMode && assertIndexInRange(lView, adjustedIndex);
  ngDevMode &&
      assertEqual(
          getBindingIndex(), tView.bindingStartIndex,
          'element containers should be created before any bindings');

  const tNode = tView.firstCreatePass ?
      elementContainerStartFirstCreatePass(
          adjustedIndex, tView, lView, attrsIndex, localRefsIndex) :
      tView.data[adjustedIndex] as TElementContainerNode;
  setCurrentTNode(tNode, true);

  ngDevMode && ngDevMode.rendererCreateComment++;
  const native = lView[adjustedIndex] =
      lView[RENDERER].createComment(ngDevMode ? 'ng-container' : '');
  appendChild(tView, lView, native, tNode);
  attachPatchData(native, lView);

  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }

  if (localRefsIndex != null) {
    saveResolvedLocalsInData(lView, tNode);
  }

  return ɵɵelementContainerStart;
}

/**
 * Mark the end of the <ng-container>.
 *
 * 标记<ng-container>.
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * @codeGenApi
 */
export function ɵɵelementContainerEnd(): typeof ɵɵelementContainerEnd {
  let currentTNode = getCurrentTNode()!;
  const tView = getTView();
  if (isCurrentTNodeParent()) {
    setCurrentTNodeAsNotParent();
  } else {
    ngDevMode && assertHasParent(currentTNode);
    currentTNode = currentTNode.parent!;
    setCurrentTNode(currentTNode, false);
  }

  ngDevMode && assertTNodeType(currentTNode, TNodeType.ElementContainer);

  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, currentTNode);
    if (isContentQueryHost(currentTNode)) {
      tView.queries!.elementEnd(currentTNode);
    }
  }
  return ɵɵelementContainerEnd;
}

/**
 * Creates an empty logical container using {@link elementContainerStart}
 * and {@link elementContainerEnd}
 *
 * 使用 {@link elementContainerStart} 和 {@link elementContainerEnd} 创建一个空的逻辑容器
 *
 * @param index Index of the element in the LView array
 *
 * LView 数组中元素的索引
 *
 * @param attrsIndex Index of the container attributes in the `consts` array.
 *
 * 容器属性在 `consts` 数组中的索引。
 *
 * @param localRefsIndex Index of the container's local references in the `consts` array.
 *
 * 容器的本地引用在 `consts` 数组中的索引。
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * @codeGenApi
 */
export function ɵɵelementContainer(
    index: number, attrsIndex?: number|null, localRefsIndex?: number): typeof ɵɵelementContainer {
  ɵɵelementContainerStart(index, attrsIndex, localRefsIndex);
  ɵɵelementContainerEnd();
  return ɵɵelementContainer;
}
