export type NavItem = { to: string; label: string };

export const aboutMenu: NavItem[] = [
  { to: '/about', label: 'About us' },
  { to: '/purpose', label: 'Purpose' },
  { to: '/vision', label: 'Vision' },
  { to: '/mission', label: 'Mission' },
];

export const primaryNav: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/curriculum', label: 'Curriculum' },
  { to: '/creative', label: 'Creative' },
  { to: '/math', label: 'Math' },
  { to: '/admin', label: 'Admin' },
];

