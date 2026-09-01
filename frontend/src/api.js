const BASE_URL = "https://civicfix-ks7w.onrender.com";

// 🔐 GET TOKEN HEADER
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) return {}; // ✅ prevent undefined token error

  return {
    Authorization: `Bearer ${token}`,
  };
};

// 🔄 SAFE JSON HANDLER (VERY IMPORTANT)
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return { error: "Invalid response from server" };
  }
};

// ---------------- AUTH ----------------

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ---------------- ISSUES ----------------

// ✅ CREATE ISSUE
export const createIssue = async (formData) => {
  const res = await fetch(`${BASE_URL}/issues`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // ✅ safe
    },
    body: formData,
  });

  return safeJson(res);
};

// ✅ GET ALL
export const getIssues = async () => {
  const res = await fetch(`${BASE_URL}/issues`, {
    headers: getAuthHeaders(),
  });

  return safeJson(res);
};

// ✅ USER ISSUES
export const getUserIssues = async (user_id) => {
  if (!user_id) return []; // ✅ prevent undefined call

  const res = await fetch(`${BASE_URL}/issues/user/${user_id}`, {
    headers: getAuthHeaders(),
  });

  const data = await safeJson(res);
  return Array.isArray(data) ? data : []; // ✅ fix filter crash
};

// ✅ ORG ISSUES
export const getOrgIssues = async (org_id) => {
  if (!org_id) return []; // ✅ prevent undefined call

  const res = await fetch(`${BASE_URL}/issues/org/${org_id}`, {
    headers: getAuthHeaders(),
  });

  const data = await safeJson(res);
  return Array.isArray(data) ? data : [];
};

// ✅ ORGANIZATIONS
export const getOrganizations = async () => {
  const res = await fetch(`${BASE_URL}/organizations`, {
    headers: getAuthHeaders(),
  });

  return safeJson(res);
};

// ✅ UPDATE STATUS
export const updateIssueStatus = async (id, status) => {
  const res = await fetch(
    `${BASE_URL}/issues/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  return safeJson(res);
};

// ✅ GET SINGLE ISSUE
export const getIssueById = async (id) => {
  const res = await fetch(`${BASE_URL}/issues/${id}`, {
    headers: getAuthHeaders(),
  });

  return safeJson(res);
};

// ---------------- NOTIFICATIONS ----------------

export const getNotifications = async (user_id) => {
  if (!user_id) return []; // ✅ prevent undefined error

  const res = await fetch(`${BASE_URL}/notifications/${user_id}`, {
    headers: getAuthHeaders(),
  });

  const data = await safeJson(res);
  return Array.isArray(data) ? data : [];
};

// ---------------- COMMENTS ----------------

export const getComments = async (issue_id) => {
  if (!issue_id) return [];

  const res = await fetch(`${BASE_URL}/comments/${issue_id}`, {
    headers: getAuthHeaders(),
  });

  const data = await safeJson(res);
  return Array.isArray(data) ? data : [];
};

export const addComment = async (data) => {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  return safeJson(res);
};

// ---------------- ADMIN ----------------

export const getAdminStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });

  return safeJson(res);
};