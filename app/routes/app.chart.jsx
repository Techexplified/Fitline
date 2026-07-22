/* global process */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import SetupLayout from "../components/SetupLayout/SetupLayout";
import TemplatePicker from "../components/TemplatePicker/TemplatePicker";
import SizeChartTable from "../components/SizeChartTable/SizeChartTable";
import styles from "../components/app.chart.module.css";

const templates = [
  {
    id: "apparel",
    label: "Apparel",
    subtitle: "tops & tees",
    icon: "shirt",
    columns: ["Chest", "Waist", "Length"],
    rows: [
      { size: "XS", values: { Chest: 86, Waist: 71, Length: 66 } },
      { size: "S",  values: { Chest: 91, Waist: 76, Length: 68 } },
      { size: "M",  values: { Chest: 97, Waist: 81, Length: 70 } },
      { size: "L",  values: { Chest: 104, Waist: 86, Length: 72 } },
      { size: "XL", values: { Chest: 112, Waist: 94, Length: 74 } },
    ],
  },
  {
    id: "footwear",
    label: "Footwear",
    subtitle: "US / EU / cm",
    icon: "shoe",
    columns: ["US", "EU", "Foot length"],
    rows: [
      { size: "6",  values: { US: 6, EU: 39, "Foot length": 24.1 } },
      { size: "7",  values: { US: 7, EU: 40, "Foot length": 24.8 } },
      { size: "8",  values: { US: 8, EU: 41, "Foot length": 25.4 } },
      { size: "9",  values: { US: 9, EU: 42, "Foot length": 26.0 } },
      { size: "10", values: { US: 10, EU: 43, "Foot length": 26.7 } },
    ],
  },
  {
    id: "rings",
    label: "Rings",
    subtitle: "inner diameter",
    icon: "ring",
    columns: ["Inner diameter (mm)", "US size"],
    rows: [
      { size: "5", values: { "Inner diameter (mm)": 15.7, "US size": 5 } },
      { size: "6", values: { "Inner diameter (mm)": 16.5, "US size": 6 } },
      { size: "7", values: { "Inner diameter (mm)": 17.3, "US size": 7 } },
      { size: "8", values: { "Inner diameter (mm)": 18.1, "US size": 8 } },
      { size: "9", values: { "Inner diameter (mm)": 18.9, "US size": 9 } },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    subtitle: "by age",
    icon: "kids",
    columns: ["Height", "Chest", "Age"],
    rows: [
      { size: "2T", values: { Height: 86, Chest: 53, Age: "2 yrs" } },
      { size: "3T", values: { Height: 94, Chest: 55, Age: "3 yrs" } },
      { size: "4T", values: { Height: 102, Chest: 57, Age: "4 yrs" } },
      { size: "5",  values: { Height: 110, Chest: 59, Age: "5 yrs" } },
      { size: "6",  values: { Height: 116, Chest: 61, Age: "6 yrs" } },
    ],
  },
  {
    id: "intimates",
    label: "Intimates",
    subtitle: "band & cup",
    icon: "intimates",
    columns: ["Band", "Bust", "Cup"],
    rows: [
      { size: "32", values: { Band: 71, Bust: 84, Cup: "B" } },
      { size: "34", values: { Band: 76, Bust: 89, Cup: "B" } },
      { size: "36", values: { Band: 81, Bust: 94, Cup: "C" } },
      { size: "38", values: { Band: 86, Bust: 99, Cup: "C" } },
      { size: "40", values: { Band: 91, Bust: 104, Cup: "D" } },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    subtitle: "your own product",
    icon: "custom",
    columns: ["Measurement 1"],
    rows: [
      { size: "Size 1", values: { "Measurement 1": 0 } },
    ],
  },
];

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    throw error;
  }
  return null;
};

export default function BuildChart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplateId, setSelectedTemplateId] = useState("apparel");
  const [unit, setUnit] = useState("cm");
  const [hasEdits, setHasEdits] = useState(false);
  const [customTemplateName, setCustomTemplateName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [newlyAddedCol, setNewlyAddedCol] = useState(null);
  
  // Clone initial data from default apparel template
  const [chartData, setChartData] = useState(() => {
    const apparel = templates.find((t) => t.id === "apparel");
    return {
      columns: [...apparel.columns],
      rows: JSON.parse(JSON.stringify(apparel.rows)),
    };
  });

  const handleSelectTemplate = (id) => {
    if (id === selectedTemplateId) return;

    if (hasEdits) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Switching templates will overwrite your edits. Are you sure you want to proceed?"
      );
      if (!confirmSwitch) return;
    }

    if (id === "custom") {
      setCustomTemplateName("");
    }
    setNameError(false);
    setNewlyAddedCol(null);

    const tpl = templates.find((t) => t.id === id);
    setSelectedTemplateId(id);
    setChartData({
      columns: [...tpl.columns],
      rows: JSON.parse(JSON.stringify(tpl.rows)),
    });
    setHasEdits(false);
  };

  const handleTableChange = (newRows) => {
    setChartData((prev) => ({ ...prev, rows: newRows }));
    setHasEdits(true);
  };

  const handleAddSize = () => {
    const defaultValues = {};
    chartData.columns.forEach((col) => {
      defaultValues[col] = 0;
    });
    const newRow = {
      size: "",
      values: defaultValues,
    };
    setChartData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
    setHasEdits(true);
  };

  const handleAddMeasurement = () => {
    let newColName = "Measurement";
    let counter = 1;
    while (chartData.columns.includes(newColName)) {
      counter += 1;
      newColName = `Measurement ${counter}`;
    }

    const updatedColumns = [...chartData.columns, newColName];
    const updatedRows = chartData.rows.map((row) => ({
      ...row,
      values: {
        ...row.values,
        [newColName]: 0,
      },
    }));
    setChartData({
      columns: updatedColumns,
      rows: updatedRows,
    });
    setHasEdits(true);
    setNewlyAddedCol(newColName);
  };

  const handleRenameColumn = (oldName, newName) => {
    if (!newName || newName === oldName || chartData.columns.includes(newName)) {
      return;
    }
    const updatedColumns = chartData.columns.map((c) => (c === oldName ? newName : c));
    const updatedRows = chartData.rows.map((row) => {
      const newValues = { ...row.values };
      newValues[newName] = newValues[oldName];
      delete newValues[oldName];
      return { ...row, values: newValues };
    });
    setChartData({ columns: updatedColumns, rows: updatedRows });
    setHasEdits(true);
  };

  const handleRemoveColumn = (colName) => {
    const updatedColumns = chartData.columns.filter((c) => c !== colName);
    const updatedRows = chartData.rows.map((row) => {
      const newValues = { ...row.values };
      delete newValues[colName];
      return {
        ...row,
        values: newValues,
      };
    });
    setChartData({
      columns: updatedColumns,
      rows: updatedRows,
    });
    setHasEdits(true);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedRows = chartData.rows.filter((_, idx) => idx !== rowIndex);
    setChartData((prev) => ({
      ...prev,
      rows: updatedRows,
    }));
    setHasEdits(true);
  };

  const handleBack = () => {
    navigate("/app/chooseprod");
  };

  const handleContinue = () => {
    if (selectedTemplateId === "custom" && customTemplateName.trim() === "") {
      setNameError(true);
      return;
    }

    const resolvedTemplateLabel =
      selectedTemplateId === "custom"
        ? (customTemplateName.trim() || "Custom")
        : templates.find((t) => t.id === selectedTemplateId).label;

    navigate("/app/display", {
      state: {
        ...location.state,
        chart: {
          templateLabel: resolvedTemplateLabel,
          sizeCount: chartData.rows.length,
          measurementCount: chartData.columns.length,
        },
        chartData,
        resolvedTemplateLabel,
        selectedTemplateId,
        unit,
      }
    });
  };

  return (
    <SetupLayout
      currentStep={2}
      totalSteps={4}
      title="Build the chart"
      description="Pick a starting template, then edit any cell. Switch units at any time — every value converts."
      onBack={handleBack}
      onContinue={handleContinue}
    >
      <div className={styles.pickerSection}>
        <h3 className={styles.pickerLabel}>Templates</h3>
        <TemplatePicker
          templates={templates}
          selectedId={selectedTemplateId}
          onSelect={handleSelectTemplate}
          customName={customTemplateName}
          onCustomNameChange={(val) => {
            setCustomTemplateName(val);
            if (val.trim() !== "") {
              setNameError(false);
            }
          }}
          nameError={nameError}
        />
      </div>

      <div className={styles.tableSection}>
        <SizeChartTable
          columns={chartData.columns}
          rows={chartData.rows}
          unit={unit}
          onChange={handleTableChange}
          onAddSize={handleAddSize}
          onAddMeasurement={handleAddMeasurement}
          onRemoveColumn={handleRemoveColumn}
          onRenameColumn={handleRenameColumn}
          newlyAddedCol={newlyAddedCol}
          onClearNewlyAddedCol={() => setNewlyAddedCol(null)}
          onRemoveRow={handleRemoveRow}
          onChangeUnit={setUnit}
        />
      </div>
    </SetupLayout>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
