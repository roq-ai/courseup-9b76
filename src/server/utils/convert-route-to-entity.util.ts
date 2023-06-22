const mapping: Record<string, string> = {
  courses: 'course',
  'health-coaches': 'health_coach',
  providers: 'provider',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
