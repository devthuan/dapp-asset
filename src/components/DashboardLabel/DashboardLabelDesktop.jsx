import React from "react";
import "./DashboardLabel.css";

function DashboardLabelDesktop({ onAddClick }) {
  // const [showForm, setShowForm] = useState(false);

  // const handleAddClick = () => {
  //   setShowForm(true);
  // };

  // const handleCloseForm = () => {
  //   setShowForm(false);
  // };

  return (
    <>
      <div className="dashboard-label-desktop">
        <div className="bar-group">
          <div className="bar bar-long" />
          <div className="bar bar-short" />
        </div>
        <div className="text">DASHBOARD</div>
        {/* <button className="plus-button" onClick={handleAddClick}>
          +
        </button> */}
        <button className="plus-button" onClick={onAddClick}>
          +
        </button>
      </div>
      {/* {showForm && <AssetForm onClose={handleCloseForm} />} */}
    </>
  );
}

export default DashboardLabelDesktop;
