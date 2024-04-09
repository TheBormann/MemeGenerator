import React from "react";

const MemeFilter = ({ onSortChange, onFilterChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="p-4 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <label className="mr-2" htmlFor="sort">
            Sort by:
          </label>
          <select
            id="sort"
            className="p-2 border rounded-md"
            onChange={handleSortChange}
          >
            <option value="creationDateDesc">Creation Date (New->Late)</option>
            <option value="creationDateAsc">Creation Date (Late->New)</option>
            <option value="votesDesc">Votes (Descending)</option>
            <option value="votesAsc">Votes (Ascending)</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="mr-2" htmlFor="filterBefore">
              Creation Date Before:
            </label>
            <input
              type="date"
              id="filterBefore"
              name="creationDateBefore"
              className="p-2 border rounded-md"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center">
            <label className="mr-2" htmlFor="filterAfter">
              Creation Date After:
            </label>
            <input
              type="date"
              id="filterAfter"
              name="creationDateAfter"
              className="p-2 border rounded-md"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center">
            <label className="mr-2" htmlFor="filterVotes">
              Votes:
            </label>
            <input
              type="number"
              id="filterVotes"
              name="votes"
              className="p-2 border rounded-md"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center">
            <label className="mr-2" htmlFor="filterKeyword">
              Keyword:
            </label>
            <input
              type="text"
              id="filterKeyword"
              name="keyword"
              className="p-2 border rounded-md"
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeFilter;
