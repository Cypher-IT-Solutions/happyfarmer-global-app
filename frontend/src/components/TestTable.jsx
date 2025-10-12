import React, { useEffect, useState } from "react";
export default function TestTable() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/testtable")
      .then((res) => res.json())
      .then(setRows);
  }, []);
  return (
    <div>
      <h2>Test Table Data</h2>
      <ul>
        {rows.map((r) => (
          <li key={r.id}>{r.value}</li>
        ))}
      </ul>
    </div>
  );
}
