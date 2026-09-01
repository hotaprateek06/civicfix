import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import {
  createIssue,
  getUserIssues,
  getOrgIssues,
  getOrganizations,
  updateIssueStatus,
} from "../api";

function Dashboard({ user, logout }) {
  const [issue, setIssue] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    priority: "medium",

    // ✅ NEW
    latitude: "",
    longitude: "",
  });

  const [issues, setIssues] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (!user || !user.id) return;

    getOrganizations().then(setOrgs);

    const fetchIssues =
      user.role === "user"
        ? getUserIssues(user.id)
        : getOrgIssues(user.id);

    fetchIssues.then((data) => {
      setIssues(Array.isArray(data) ? data : []);
    });
  }, [user]);

  // ---------------- LOCATION ----------------
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIssue({
          ...issue,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        alert("Location captured ✅");
      },
      () => {
        alert("Location permission denied ❌");
      }
    );
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setIssue({
      ...issue,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    const { title, description, location, category } = issue;

    if (!title || !description || !location || !category) {
      alert("All fields are required");
      return;
    }

    if (title.length < 5 || description.length < 10) {
      alert("Title or description too short");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("user_id", user.id);
    formData.append("priority", issue.priority);

    // ✅ SEND LAT/LNG
    formData.append("latitude", issue.latitude);
    formData.append("longitude", issue.longitude);

    if (image) {
      formData.append("file", image);
    }

    const res = await createIssue(formData);
    alert(res.message || res.error);

    // RESET
    setIssue({
      title: "",
      description: "",
      location: "",
      category: "",
      priority: "medium",
      latitude: "",
      longitude: "",
    });

    setImage(null);

    // REFRESH
    const data =
      user.role === "user"
        ? await getUserIssues(user.id)
        : await getOrgIssues(user.id);

    setIssues(Array.isArray(data) ? data : []);
  };

  const handleStatusChange = async (id, status) => {
    const res = await updateIssueStatus(id, status);
    alert(res.message || res.error);

    const data = await getOrgIssues(user.id);
    setIssues(Array.isArray(data) ? data : []);
  };

  // ---------------- FILTER ----------------
  const filteredIssues = issues
    .filter((item) =>
      filter === "all" ? true : item.status === filter
    )
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

  // ---------------- UI ----------------
  return (
    <>
      <Navbar user={user} logout={logout} />

      <div className="container">
        <div className="card">
          <h2>Dashboard</h2>
          <p>Welcome, <strong>{user.name}</strong></p>
          <p>Role: {user.role}</p>
        </div>

        {/* CREATE ISSUE */}
        {user.role === "user" && (
          <div className="card">
            <h3>Create Issue</h3>

            <input
              name="title"
              placeholder="Title"
              value={issue.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={issue.description}
              onChange={handleChange}
            />

            <select
              name="category"
              value={issue.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="electric">Electric</option>
              <option value="water">Water</option>
              <option value="road">Road</option>
            </select>

            <input
              name="location"
              placeholder="Enter city"
              value={issue.location}
              onChange={handleChange}
            />

            <select
              name="priority"
              value={issue.priority}
              onChange={handleChange}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            {/* ✅ LOCATION BUTTON */}
            <button onClick={getLocation}>
              📍 Use My Location
            </button>

            {issue.latitude && (
              <p style={{ fontSize: "12px", color: "green" }}>
                Location captured ✔
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}

            <button onClick={handleCreate}>Submit Issue</button>
          </div>
        )}

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER */}
        <div style={{ margin: "15px 0" }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("in_progress")}>In Progress</button>
          <button onClick={() => setFilter("resolved")}>Resolved</button>
        </div>

        {/* LIST */}
        <h3>Issues</h3>

        {filteredIssues.length === 0 ? (
          <p>No issues found</p>
        ) : (
          filteredIssues.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => navigate(`/issue/${item.id}`)}
            >
              <h4>{item.title}</h4>
              <p>{item.description}</p>

              <p>
                <strong>Priority:</strong>{" "}
                <span
                  style={{
                    color:
                      item.priority === "high"
                        ? "red"
                        : item.priority === "medium"
                        ? "orange"
                        : "green",
                  }}
                >
                  {item.priority}
                </span>
              </p>

              <p><strong>Location:</strong> {item.location}</p>

              {/* ✅ VIEW MAP */}
              {item.latitude && item.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  📍 View Exact Location
                </a>
              )}

              <p><strong>Status:</strong> {item.status}</p>

              {/* ORG BUTTONS */}
              {user.role === "organization" && (
                <div style={{ marginTop: "10px" }}>
                  {item.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item.id, "in_progress");
                      }}
                    >
                      🚀 Start Solving
                    </button>
                  )}

                  {item.status === "in_progress" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item.id, "resolved");
                      }}
                    >
                      ✅ Mark Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Dashboard;