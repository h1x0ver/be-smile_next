import styles from "./page-heading.module.css";

export default function PageHeading({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <h1 className={styles.title} data-compact={compact || undefined}>
      <span className={styles.bracket} aria-hidden="true">[</span>
      <span className={styles.label}>{children}</span>
      <span className={styles.bracket} aria-hidden="true">]</span>
    </h1>
  );
}
