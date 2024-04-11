import React, {useState, useEffect} from "react";

const MemeFilter = ({ onFilterChange, visible }) => {

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
      <div className={`fixed top-20 left-0 right-0 join z-30 flex justify-center ${!visible ? 'translate-y-[-100vh] transition-transform duration-500' : ''}`}>
        <div>
          <div>
            <input className="input input-bordered join-item" placeholder="Search"/>
          </div>
        </div>
        <select className="select select-bordered join-item">
          <option disabled selected>Sort</option>
          <option value="creationDateDesc">Date ↘</option>
          <option value="creationDateAsc">Date ↖</option>
          <option value="votesDesc">Votes ↘</option>
          <option value="votesAsc">Votes ↖</option>
        </select>
        <input
              type="date"
              id="filterBefore"
              name="creationDateBefore"
              className="input input-bordered join-item"
              onChange={handleFilterChange}
            />
        <div className="indicator">
          <button className="btn join-item" onClick={handleFilterChange}>Search</button>
        </div>
      </div>
  );
};

export default MemeFilter;
