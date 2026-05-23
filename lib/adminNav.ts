export const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/subjects', label: 'Subjects' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/transactions', label: 'Transactions' },
  { href: '/admin/profile', label: 'Profile' },
] as const;

export const SUBSCRIBER_NAV = [
  { href: '/subscriber/dashboard', label: 'Dashboard' },
  { href: '/subscriber/users', label: 'Users' },
  { href: '/subscriber/reviews', label: 'Reviews' },
  { href: '/subscriber/transactions', label: 'Transactions' },
  { href: '/subscriber/profile', label: 'Profile' },
] as const;

export const USER_NAV = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/reviews', label: 'Reviews' },
  { href: '/user/transactions', label: 'Transactions' },
  { href: '/user/profile', label: 'Profile' },
] as const;
