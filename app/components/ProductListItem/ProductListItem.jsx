/* eslint-disable react/prop-types */
import styles from "./ProductListItem.module.css";

function ShirtIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={styles.placeholderIcon}
    >
      <path d="M6 2L3 5v3a3 3 0 0 0 3 3h1v11h10V11h1a3 3 0 0 0 3-3V5l-3-3H6z" />
      <path d="M10 2a2 2 0 0 0 4 0" />
    </svg>
  );
}

export default function ProductListItem({ product, selected, onToggle }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currencyCode || "USD",
  }).format(parseFloat(product.price) || 0);

  return (
    <div 
      className={styles.row} 
      onClick={() => onToggle(product.id)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(product.id);
        }
      }}
    >
      {/* Custom styled checkbox matching black/gray theme */}
      <div className={`${styles.checkboxOuter} ${selected ? styles.checkboxSelected : ""}`}>
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className={styles.checkboxIcon}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Image Thumbnail */}
      <div className={styles.thumbnail}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className={styles.thumbnailImage} 
          />
        ) : (
          <ShirtIcon />
        )}
      </div>

      {/* Info column */}
      <div className={styles.info}>
        <span className={styles.title}>{product.title}</span>
        <span className={styles.metaText}>
          {product.productType} &middot; {product.variantCount} sizes
        </span>
      </div>

      {/* Price */}
      <span className={styles.price}>{formattedPrice}</span>
    </div>
  );
}
