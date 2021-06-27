import React from "react";
import Navigation from "../../components/Navigation/Navigation";
import ReportsList2 from "../../components/Reports/ReportsList2";

function Reports() {
  return (
    <div>
      <Navigation currentPage={"reports"} />
      <ReportsList2 />
    </div>
  );
}

export default Reports;
