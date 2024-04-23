import React, {useState, useEffect} from "react";
import { useMemeContext } from "../../contexts/memeContext";

const MemeFilter = ({ visible }) => {
  const { fetchMemes, lastParams } = useMemeContext();
  const [searchTerm, setSearchTerm] = useState(lastParams.filters?.keyword || "");
  const [sortValue, setSortValue] = useState(lastParams.sorting || "");
  const [creationDateBefore, setCreationDateBefore] = useState(lastParams.filters?.creationDateBefore || new Date().toISOString().split('T')[0]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "searchTerm":
        setSearchTerm(value);
        break;
      case "creationDateBefore":
        setCreationDateBefore(value);
        break;
      default:
        break;
    }
  };

  const handleSortChange = (e) => {
    setSortValue(e.target.value);
  };

  const handleSearch = (event) => {
    fetchMemes({ filters: { keyword: searchTerm, creationDateBefore: creationDateBefore}, sorting: sortValue, append: false });
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

export default MemeFilter;
