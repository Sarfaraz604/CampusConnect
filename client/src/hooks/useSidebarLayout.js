import { useEffect } from 'react';

/**
 * Adds .has-sidebar to <body>, plus either .sidebar-expanded or .sidebar-collapsed.
 * Removes them on unmount so other pages are unaffected.
 *
 * @param {boolean} [defaultExpanded=true] - Whether to default to expanded or collapsed
 */
export function useSidebarLayout(defaultExpanded = true) {
  useEffect(() => {
    // 1. Add .has-sidebar always
    document.body.classList.add('has-sidebar');

    // 2. Toggle expanded/collapsed
    if (defaultExpanded) {
      document.body.classList.add('sidebar-expanded');
      document.body.classList.remove('sidebar-collapsed');
    } else {
      document.body.classList.add('sidebar-collapsed');
      document.body.classList.remove('sidebar-expanded');
    }

    // 3. Clean up on unmount
    return () => {
      document.body.classList.remove('has-sidebar');
      document.body.classList.remove('sidebar-expanded');
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [defaultExpanded]);
}
