/* eslint-disable react/prop-types */
import styles from "./SizeChartReadOnlyTable.module.css";

export default function SizeChartReadOnlyTable({ chartData, highlightedRowIndex = -1 }) {
  if (!chartData) return null;

  const { unit, rowLabelHeader, columns, rows } = chartData;

  return (
    <div className={styles.container}>
      <p className={styles.unitCaption}>
        Measurements in {unit === "cm" ? "centimetres" : "inches"}
      </p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>{rowLabelHeader}</th>
              {columns.map((col) => (
                <th key={col} className={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isHighlighted = idx === highlightedRowIndex;
              const rowClassName = `${styles.tr} ${isHighlighted ? styles.trHighlighted : ""}`;
              return (
                <tr key={row.label || idx} className={rowClassName}>
                  <td className={`${styles.td} ${styles.rowLabel}`}>{row.label}</td>
                  {columns.map((col) => (
                    <td key={col} className={styles.td}>{row.values[col]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
