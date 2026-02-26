import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

const AdminPage = () => {
  const [categories, setCategories] = useState([
  "adventure",
  "resorts",
  "scenery",
  "games",
  "restaurant"
]);
  const [filters, setFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [baseData, setBaseData] = useState({
    placeName: "",
    description: "",
    city: "",
    state: "",
    country: "",
    categoryId: "",
    locationUrl: ""
  });
  const [categoryData, setCategoryData] = useState({});
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/locations/categories")
//       .then(res => setCategories(res.data.categories))
//       .catch(err => console.error(err));
//   }, []);

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    const res = await axios.get(`http://localhost:5000/api/locations/filters/${category}`);
    setFilters(res.data.filters);

    // Reset dynamic fields
    const dynamic = {};
    res.data.filters.forEach(f => dynamic[f] = "");
    setCategoryData(dynamic);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   await axios.post("http://localhost:5000/api/locations/add-location", {
  //     baseData: {
  //       ...baseData,
  //       categoryName: selectedCategory
  //     },
  //     categoryData
  //   });

  //   setMessage("✨ Location Added Successfully");
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  // Add baseData
  Object.keys(baseData).forEach(key => {
    formData.append(key, baseData[key]);
  });

  formData.append("categoryName", selectedCategory);

  // Add categoryData
  formData.append("categoryData", JSON.stringify(categoryData));

  // Add images
  for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }

  await axios.post(
    "http://localhost:5000/api/locations/add-location",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  setMessage("✨ Location Added Successfully");
};

  return (
    <div className="admin-wrapper">
      <div className="glass-panel admin-card">
        <h1 className="text-gradient-hyper">Add New Location</h1>

        <form onSubmit={handleSubmit} className="admin-form">

          {/* CATEGORY */}
          <select
            className="admin-input"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* BASIC FIELDS */}
          <input
            className="admin-input"
            placeholder="Place Name"
            onChange={(e) => setBaseData({...baseData, placeName: e.target.value})}
            required
          />
          <textarea
            className="admin-input"
            placeholder="Description"
            onChange={(e) => setBaseData({...baseData, description: e.target.value})}
            required
          />
          <input
            className="admin-input"
            placeholder="City"
            onChange={(e) => setBaseData({...baseData, city: e.target.value})}
          />
          <input
            className="admin-input"
            placeholder="State"
            onChange={(e) => setBaseData({...baseData, state: e.target.value})}
          />
          <input
            className="admin-input"
            placeholder="Country"
            onChange={(e) => setBaseData({...baseData, country: e.target.value})}
          />
          <input
            className="admin-input"
            placeholder="Category ID"
            type="number"
            onChange={(e) => setBaseData({...baseData, categoryId: e.target.value})}
          />
          <input
            className="admin-input"
            placeholder="Google Maps Link"
            onChange={(e) => setBaseData({...baseData, locationUrl: e.target.value})}
          />

          {/* DYNAMIC FILTER FIELDS */}
          {filters.map(filter => (
            <input
              key={filter}
              className="admin-input"
              placeholder={filter}
              onChange={(e) =>
                setCategoryData({...categoryData, [filter]: e.target.value})
              }
            />
          ))}

          <input
          type="file"
          multiple
          className="admin-input"
          onChange={(e) => setImages(e.target.files)}
        />

          <button className="admin-submit">
            Add Location
          </button>

        </form>

        {message && <p className="admin-message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminPage;