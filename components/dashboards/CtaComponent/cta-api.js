export const getCta = async () => {
  const response = await fetch("/api/cta");
  if (!response.ok) {
    throw new Error("Failed to fetch cta");
  }
  return await response.json();
};

export const createCta = async (data) => {
  const response = await fetch("/api/cta/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to create cta:", errorData);
    throw new Error("Failed to create cta");
  }

  return await response.json();
};

export const updateCta = async (id, data) => {
  const response = await fetch(`/api/cta/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update cta");
  }
  return await response.json();
};

export const deleteCta = async (id) => {
  const response = await fetch(`/api/cta/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete cta");
  }
  return await response.json();
};
