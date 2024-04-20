import React, {useState, useEffect} from "react";

const MemeFilter = ({ onFilterChange, onSortChange, visible }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [creationDateBefore, setCreationDateBefore] = useState(new Date().toISOString().split('T')[0]);

  // Update local state instead of filtering immediately
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchTerm") {
      setSearchTerm(value);
    } else if (name === "creationDateBefore") {
      setCreationDateBefore(value);
    }
  };

  // Update local state for sort
  const handleSortChange = (e) => {
    setSortValue(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    onFilterChange('searchTerm', searchTerm);
    onFilterChange('creationDateBefore', creationDateBefore);
    onSortChange(sortValue);
  };


  return (
      <div className={`fixed top-20 left-0 right-0 join z-30 flex justify-center ${!visible ? 'translate-y-[-100vh] transition-transform duration-500' : ''}`}>
        <div>
          <div>
            <input 
              className="input input-bordered join-item" 
              placeholder="Search" 
              name="searchTerm"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <select 
          className="select select-bordered join-item" 
          value={sortValue}
          onChange={handleSortChange}>
          <option disabled value="">Sort</option>
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
              value={creationDateBefore}
              onChange={handleInputChange}
            />
        <div className="indicator">
          <button className="btn join-item" onClick={handleSearch}>Search</button>
        </div>
      </div>
  );
};

MemeFilter.defaultProps = {
  onFilterChange: () => {},
  onSortChange: () => {},
  visible: true
};

export default MemeFilter;
