const api_url = "http://localhost:10010";

export const startPlan = async () => {
    const url = `${api_url}/Plan`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) throw new Error("Failed to create plan");

    return await response.json();
};

export const addProcedureToPlan = async (planId, procedureId) => {
    const url = `${api_url}/Plan/AddProcedureToPlan`;
    var command = { planId: planId, procedureId: procedureId };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });

    if (!response.ok) throw new Error("Failed to create plan");

    return true;
};

export const getProcedures = async () => {
    const url = `${api_url}/Procedures`;
    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get procedures");

    return await response.json();
};

export const getPlanProcedures = async (planId) => {
    const url = `${api_url}/PlanProcedure?$filter=planId eq ${planId}&$expand=procedure`;
    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get plan procedures");

    return await response.json();
};

export const getUsers = async () => {
    const url = `${api_url}/Users`;
    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Failed to get users");

    return await response.json();
};
// Assign a user to a procedure
export async function assignUserToProcedure(planId, procedureId, userId) {
  return fetch(`${api_url}/PlanProcedureUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, procedureId, userId }),
  });
}

// Get assigned users for a procedure in a plan
export async function getAssignedUsers(planId, procedureId) {
  const res = await fetch(`${api_url}/PlanProcedureUsers/${planId}/${procedureId}`);
  if (!res.ok) throw new Error('Failed to fetch assigned users');
  return res.json();
}

// Remove a single user from a procedure
export async function removeUser(planId, procedureId, userId) {
  return fetch(`${api_url}/PlanProcedureUsers/${planId}/${procedureId}/${userId}`, {
    method: 'DELETE',
  });
}

// Remove all users from a procedure
export async function removeAllUsers(planId, procedureId) {
  return fetch(`${api_url}/PlanProcedureUsers/${planId}/${procedureId}`, {
    method: 'DELETE',
  });
}


