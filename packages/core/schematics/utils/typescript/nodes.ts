/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

/**
 * Checks whether the given TypeScript node has the specified modifier set.
 *
 * 检查给定的 TypeScript 节点是否具有指定的修饰符集。
 *
 */
export function hasModifier(node: ts.Node, modifierKind: ts.SyntaxKind) {
  return !!node.modifiers && node.modifiers.some(m => m.kind === modifierKind);
}

/**
 * Find the closest parent node of a particular kind.
 *
 * 查找特定类型的最近的父节点。
 *
 */
export function closestNode<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T|null {
  let current: ts.Node = node;

  while (current && !ts.isSourceFile(current)) {
    if (current.kind === kind) {
      return current as T;
    }
    current = current.parent;
  }

  return null;
}

/**
 * Checks whether a particular node is part of a null check. E.g. given:
 * `foo.bar ? foo.bar.value : null` the null check would be `foo.bar`.
 *
 * 检查特定节点是否是 null 检查的一部分。例如给定： `foo.bar ? foo.bar.value : null` 的 null
 * 检查将是 `foo.bar` 。
 *
 */
export function isNullCheck(node: ts.Node): boolean {
  if (!node.parent) {
    return false;
  }

  // `foo.bar && foo.bar.value` where `node` is `foo.bar`.
  if (ts.isBinaryExpression(node.parent) && node.parent.left === node) {
    return true;
  }

  // `foo.bar && foo.bar.parent && foo.bar.parent.value`
  // where `node` is `foo.bar`.
  if (node.parent.parent && ts.isBinaryExpression(node.parent.parent) &&
      node.parent.parent.left === node.parent) {
    return true;
  }

  // `if (foo.bar) {...}` where `node` is `foo.bar`.
  if (ts.isIfStatement(node.parent) && node.parent.expression === node) {
    return true;
  }

  // `foo.bar ? foo.bar.value : null` where `node` is `foo.bar`.
  if (ts.isConditionalExpression(node.parent) && node.parent.condition === node) {
    return true;
  }

  return false;
}

/**
 * Checks whether a property access is safe (e.g. `foo.parent?.value`).
 *
 * 检查属性访问是否安全（例如 `foo.parent?.value`）。
 *
 */
export function isSafeAccess(node: ts.Node): boolean {
  return node.parent != null && ts.isPropertyAccessExpression(node.parent) &&
      node.parent.expression === node && node.parent.questionDotToken != null;
}
