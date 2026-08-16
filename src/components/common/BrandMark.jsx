/**
 * Simplistic "R" brand mark for RaisingIndia.
 * Orange accent square with a clean white R — matches the site's orange/navy palette.
 */
export default function BrandMark({ className = 'w-9 h-9' }) {
  return (
    <div
      className={`${className} rounded-xl shadow-md bg-accent flex items-center justify-center`}
      aria-label="RaisingIndia"
    >
      <span className="font-display font-black text-white leading-none text-[1.35em]">
        R
      </span>
    </div>
  );
}