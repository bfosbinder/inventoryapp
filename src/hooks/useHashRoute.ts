import { useEffect, useMemo, useState } from 'react';
import type { RouteName } from '../state/types';

type RouteInfo = {
  route: RouteName;
  params: Record<string, string>;
  navigate: (route: RouteName, params?: Record<string, string>) => void;
};

const LAST_ROUTE_KEY = 'lastRoute';

function parseHash(): { route: RouteName; params: Record<string, string> } {
  const h = window.location.hash.replace(/^#/, '');
  const [path, query] = h.split('?');
  const route = (path || 'scan') as RouteName;
  const params = Object.fromEntries(new URLSearchParams(query || ''));
  return { route: (['scan', 'inventory', 'parts', 'pick'].includes(route) ? route : 'scan') as RouteName, params };
}

export function useHashRoute(): RouteInfo {
  const [state, setState] = useState(parseHash());

  useEffect(() => {
    const onHash = () => {
      const next = parseHash();
      setState(next);
      localStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(next));
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) {
      const saved = localStorage.getItem(LAST_ROUTE_KEY);
      if (saved) {
        const { route, params } = JSON.parse(saved);
        const qs = new URLSearchParams(params).toString();
        window.location.hash = `#${route}${qs ? `?${qs}` : ''}`;
      } else {
        window.location.hash = '#scan';
      }
    } else {
      onHash();
    }
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (route: RouteName, params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    window.location.hash = `#${route}${qs ? `?${qs}` : ''}`;
  };

  return useMemo(() => ({ route: state.route, params: state.params, navigate }), [state.route, state.params]);
}
