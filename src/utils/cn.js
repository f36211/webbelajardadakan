/**
 * Class name utility — combines tailwind classes, mirrors shadcn's cn()
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
