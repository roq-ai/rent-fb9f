const mapping: Record<string, string> = {
  cars: 'car',
  companies: 'company',
  rentals: 'rental',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
