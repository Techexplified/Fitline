/* eslint-disable react/prop-types */
import { useState } from "react";
import ProductListItem from "../ProductListItem/ProductListItem";
import styles from "./ProductPicker.module.css";

function SearchIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={styles.searchIcon}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function ProductPicker({ 
  products = [], 
  selectedIds = [], 
  onToggleProduct, 
  onToggleSelectAll 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side filtering by title (case-insensitive substring match)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if all currently filtered products are selected
  const allFilteredSelected = 
    filteredProducts.length > 0 && 
    filteredProducts.every((product) => selectedIds.includes(product.id));

  const handleSelectAllClick = () => {
    // Pass whether they are all currently selected and the array of filtered IDs
    onToggleSelectAll(allFilteredSelected, filteredProducts.map((p) => p.id));
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div 
          className={styles.selectAllWrapper} 
          onClick={handleSelectAllClick}
          role="checkbox"
          aria-checked={allFilteredSelected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelectAllClick();
            }
          }}
        >
          <div className={`${styles.checkboxOuter} ${allFilteredSelected ? styles.checkboxSelected : ""}`}>
            {allFilteredSelected && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className={styles.checkboxIcon}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className={styles.selectAllLabel}>Select all</span>
        </div>
      </div>

      {/* Product List */}
      <div className={styles.list}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              selected={selectedIds.includes(product.id)}
              onToggle={onToggleProduct}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            No products found matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          {selectedIds.length} of {products.length} products selected
        </p>
      </div>
    </div>
  );
}
