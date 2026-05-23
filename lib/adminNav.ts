export const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/subjects', label: 'Subjects' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/transactions', label: 'Transactions' },
] as const;

export const SUBSCRIBER_NAV = [
  { href: '/subscriber/dashboard', label: 'Dashboard' },
  { href: '/subscriber/users', label: 'Users' },
  { href: '/subscriber/reviews', label: 'Reviews' },
  { href: '/subscriber/transactions', label: 'Transactions' },
  { href: '/subscriber/analytics', label: 'Analytics' },
] as const;
