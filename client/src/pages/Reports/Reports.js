import React from "react";
import Navigation from "../../components/Navigation/Navigation";
import ReportsList from "../../components/Reports/ReportsList";

function Reports() {
  return (
    <div>
      <Navigation currentPage={"reports"} />
      <ReportsList />
    </div>
  );
}

export default Reports;
