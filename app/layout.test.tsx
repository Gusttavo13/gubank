import { Children, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders only head and body as direct children of html', () => {
    const layout = RootLayout({ children: <main>GuBank</main> });
    const directChildren = Children.toArray(layout.props.children);
    const childTags = directChildren.map((child) =>
      isValidElement(child) && typeof child.type === 'string' ? child.type : 'component',
    );
    const head = directChildren[0];
    const headChildren = isValidElement(head) ? Children.toArray(head.props.children) : [];

    expect(childTags).toEqual(['head', 'body']);
    expect(
      headChildren.some(
        (child) =>
          isValidElement(child) &&
          child.props.src === 'https://sdk.legitimuz.dev/v1/websdk.iife.js',
      ),
    ).toBe(true);
  });
});
