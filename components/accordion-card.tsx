'use client';

import { memo, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import styles from './price-row.module.css';

interface AccordionCardProps {
  id: string;
  index: number;
  title: string;
  price: string;
  description?: string;
  accentColor: string;
  bookHref: string;
  bookLabel: string;
  isLast: boolean;
}

export const AccordionCard = memo(function AccordionCard({
  id,
  index,
  title,
  price,
  description,
  accentColor,
  bookHref,
  bookLabel,
  isLast,
}: AccordionCardProps) {
  const [open, setOpen] = useState(false);
  const contentId = `${id}-description`;
  const canExpand = Boolean(description);
  // Descriptions are only sanitized when opened, never on scroll or search.
  const safeDescription = useMemo(() => open && description ? DOMPurify.sanitize(description) : '', [open, description]);

  return (
    <article id={id} className={`${styles.item} ${isLast ? styles.last : ""}`} data-open={open || undefined}>
      <div className={styles.row}>
        <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
        <div className={styles.title}>
          {canExpand ? <button type="button" onClick={() => setOpen(prev => !prev)} aria-expanded={open} aria-controls={contentId} className={styles.titleButton}>
            <h3>{title}</h3><ChevronDown size={16} strokeWidth={1.5} className={styles.chevron} style={{ color: accentColor }} aria-hidden="true" />
          </button> : <h3>{title}</h3>}
        </div>
        <div className={styles.value}><Price value={price} /></div>
        <Link href={bookHref} prefetch={false} aria-label={`${bookLabel}: ${title}`} className={styles.book}><span>{bookLabel}</span><ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" /></Link>
      </div>
      {open && canExpand && <div id={contentId} className={styles.description}><div dangerouslySetInnerHTML={{ __html: safeDescription }} /></div>}
    </article>
  );
});

function Price({ value }: { value: string }) {
  if (!value) return null;

  const match = value.match(
    /^(.*?)((?:\d[\d\s.,]*)(?:\s*[-–—]\s*\d[\d\s.,]*)?)\s*(₼|AZN)?\s*(.*)$/i
  );
  if (!match) return <>{value}</>;
  const [, prefix, number, , suffix] = match;

  if (!number) return <>{value}</>;

  return (
    <>
      {prefix}
      {number}
      <span style={{ fontFamily: "system-ui, Arial, sans-serif" }}> ₼</span>
      {suffix}
    </>
  );
}

