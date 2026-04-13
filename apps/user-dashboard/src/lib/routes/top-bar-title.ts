import { adminNavItems, userNavItems } from '@/lib/tools/constants';

const allNavItems = [...adminNavItems, ...userNavItems];

const toReadableTitle = (value: string) => {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};

export const getTopBarTitle = (pathname: string) => {
  const bestMatch = allNavItems
    .filter(
      (item) =>
        pathname === item.url ||
        pathname.startsWith(`${item.url}/`) ||
        pathname.startsWith(`${item.url}?`)
    )
    .sort((first, second) => second.url.length - first.url.length)[0];

  if (bestMatch) {
    return bestMatch.name;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return 'Dashboard';
  }

  for (let index = segments.length - 1; index >= 0; index--) {
    const segment = segments[index];
    const isLikelyDynamic =
      /^\d+$/.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment);

    if (!isLikelyDynamic) {
      return toReadableTitle(segment);
    }
  }

  return 'Dashboard';
};
