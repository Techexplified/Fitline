/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import UnitToggle from "../UnitToggle/UnitToggle";
import styles from "./SizeChartTable.module.css";

const isNumeric = (val) => {
  if (typeof val === 'number') return true;
  if (!val || typeof val !== 'string') return false;
  if (val.trim() === '') return false;
  return !isNaN(Number(val));
};

function EditableHeader({ name, columns, onRename, onRemove, isNew, onClearNew }) {
  const [value, setValue] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(name);
  }, [name]);

  useEffect(() => {
    if (isNew && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      onClearNew();
    }
  }, [isNew, onClearNew]);

  const handleCommit = () => {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === name || columns.includes(trimmed)) {
      setValue(name); // Revert
      return;
    }
    onRename(name, trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setValue(name); // Revert
      e.target.blur();
    }
  };

  return (
    <div className={styles.headerContent}>
      <input
        ref={inputRef}
        type="text"
        className={styles.headerInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
      />
      <button 
        type="button" 
        className={styles.removeColBtn} 
        onClick={onRemove}
        title={`Remove ${name}`}
      >
        &times;
      </button>
    </div>
  );
}

export default function SizeChartTable({
  columns,
  rows,
  unit,
  onChange,
  onAddSize,
  onAddMeasurement,
  onRemoveColumn,
  onRenameColumn,
  newlyAddedCol,
  onClearNewlyAddedCol,
  onRemoveRow,
  onChangeUnit
}) {
  const getDisplayValue = (val) => {
    if (val === undefined || val === null) return "";
    if (unit === "inches" && isNumeric(val)) {
      return (Number(val) / 2.54).toFixed(1).replace(/\.0$/, "");
    }
    return val;
  };

  const handleCellChange = (rowIndex, colName, rawValue) => {
    const updatedRows = [...rows];
    let storedValue = rawValue;
    
    if (unit === "inches" && isNumeric(rawValue)) {
      storedValue = Number(rawValue) * 2.54;
    } else if (isNumeric(rawValue)) {
      storedValue = Number(rawValue);
    }
    
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      values: {
        ...updatedRows[rowIndex].values,
        [colName]: storedValue
      }
    };
    
    onChange(updatedRows);
  };

  const handleSizeChange = (rowIndex, rawValue) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      size: rawValue
    };
    onChange(updatedRows);
  };

  const handleAddMeasurement = () => {
    onAddMeasurement();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableControls}>
        <div className={styles.actionButtons}>
          <button type="button" className={styles.addButton} onClick={onAddSize}>
            + Add size
          </button>
          <button type="button" className={styles.addButton} onClick={handleAddMeasurement}>
            + Add measurement
          </button>
        </div>
        <UnitToggle value={unit} onChange={onChangeUnit} />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.stickyColumn}`}>Size</th>
              {columns.map((col) => (
                <th key={col} className={styles.th}>
                  <EditableHeader
                    name={col}
                    columns={columns}
                    onRename={onRenameColumn}
                    onRemove={() => onRemoveColumn(col)}
                    isNew={newlyAddedCol === col}
                    onClearNew={onClearNewlyAddedCol}
                  />
                </th>
              ))}
              <th className={styles.thAction}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                <td className={`${styles.td} ${styles.stickyColumn}`}>
                  <input
                    type="text"
                    className={styles.cellInput}
                    value={row.size}
                    onChange={(e) => handleSizeChange(rowIndex, e.target.value)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col} className={styles.td}>
                    <input
                      type="text"
                      className={styles.cellInput}
                      value={getDisplayValue(row.values[col])}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                    />
                  </td>
                ))}
                <td className={styles.tdAction}>
                  <button 
                    type="button" 
                    className={styles.removeRowBtn} 
                    onClick={() => onRemoveRow(rowIndex)}
                    title="Remove size row"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.helperText}>
        Ranges like <span className={styles.badge}>86–91</span> are supported. The first column stays pinned when the table scrolls sideways.
      </div>
    </div>
  );
}
