import Link from "next/link";

const styles = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  marker: "bg-marker text-ink hover:bg-marker-soft",
  quiet: "bg-white text-ink border border-ink/25 hover:border-ink",
  danger: "bg-white text-redpen border border-redpen/40 hover:border-redpen",
};

export function Button({ variant = "primary", href, className = "", children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}
