import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getIssueById, getComments, addComment } from "../api";

function IssueDetails({ orgs, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getIssueById(id).then(setIssue);
    getComments(id).then(setComments);
  }, [id]);

  const handleAddComment = async () => {
    if (!text.trim()) return alert("Empty comment");

    await addComment({
      issue_id: Number(id),
      user_id: user.id,
      text,
    });

    setText("");
    getComments(id).then(setComments);
  };

  if (!issue) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  const getOrgName = (id) => {
    const org = orgs.find((o) => o.id === id);
    return org ? org.name : "Unknown";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      {/* ISSUE CARD */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h2>{issue.title}</h2>

        <p style={{ marginTop: "10px" }}>{issue.description}</p>

        {/* IMAGE */}
        {issue.image && (
          <img
            src={`http://127.0.0.1:8000/${issue.image}`}
            alt="issue"
            style={{
              width: "100%",
              maxWidth: "500px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          />
        )}

        <p style={{ marginTop: "10px" }}>
          <strong>Organization:</strong>{" "}
          {getOrgName(issue.organization_id)}
        </p>

        {/* STATUS */}
        <p
          style={{
            fontWeight: "bold",
            color:
              issue.status === "resolved"
                ? "green"
                : issue.status === "in_progress"
                ? "blue"
                : "orange",
          }}
        >
          Status: {issue.status}
        </p>
        <p>
  <strong>Priority:</strong>{" "}
  <span
    style={{
      color:
        issue.priority === "high"
          ? "red"
          : issue.priority === "medium"
          ? "orange"
          : "green",
      fontWeight: "bold",
    }}
  >
    {issue.priority}
  </span>
</p>

        {/* TIME */}
        {issue.created_at && (
          <p style={{ fontSize: "12px", color: "gray" }}>
            Reported on:{" "}
            {new Date(issue.created_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* COMMENTS */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Comments</h3>

        {/* ADD COMMENT */}
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleAddComment}
          style={{ marginTop: "10px" }}
        >
          Post Comment
        </button>

        {/* COMMENT LIST */}
        <div style={{ marginTop: "20px" }}>
          {comments.length === 0 ? (
            <p style={{ color: "gray" }}>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                {/* USER LABEL */}
                <p style={{ fontWeight: "bold" }}>
                  {c.user_id === user.id ? "You" : "User " + c.user_id}
                </p>

                <p>{c.text}</p>

                <small style={{ color: "gray" }}>
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueDetails;