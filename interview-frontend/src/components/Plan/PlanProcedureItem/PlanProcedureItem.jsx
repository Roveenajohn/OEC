import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { assignUserToProcedure, getAssignedUsers, removeUser, removeAllUsers } from '../../../api/api';

const PlanProcedureItem = ({ procedure, users, planId }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Load assigned users on mount or when plan/procedure changes
  useEffect(() => {
    if (planId && procedure.procedureId) {
      getAssignedUsers(planId, procedure.procedureId)
        .then((assignedUsers) => {
          // assignedUsers = [{ userId, name }]
          const selected = assignedUsers.map((u) => ({
            label: u.name,
            value: u.userId,
          }));
          setSelectedUsers(selected);
        })
        .catch(() => {
          setSelectedUsers([]);
        });
    }
  }, [planId, procedure.procedureId]);

  // Handle user selection changes
  const handleAssignUserToProcedure = async (selectedOptions) => {
    // Find users removed from selection
    const removedUsers = selectedUsers.filter(
      (su) => !selectedOptions?.some((o) => o.value === su.value)
    );

    // Find newly added users
    const addedUsers = selectedOptions?.filter(
      (o) => !selectedUsers.some((su) => su.value === o.value)
    );

    // Remove unselected users from backend
    for (const user of removedUsers) {
      await removeUser(planId, procedure.procedureId, user.value);
    }

    // Add newly selected users to backend
    for (const user of addedUsers) {
      await assignUserToProcedure(planId, procedure.procedureId, user.value);
    }

    setSelectedUsers(selectedOptions || []);
  };

  // Optional: Clear all users button handler
  const handleClearAllUsers = async () => {
    await removeAllUsers(planId, procedure.procedureId);
    setSelectedUsers([]);
  };

  return (
    <div className="py-2">
      <div>{procedure.procedureTitle}</div>
      <ReactSelect
        className="mt-2"
        placeholder="Select User to Assign"
        isMulti={true}
        options={users}
        value={selectedUsers}
        onChange={handleAssignUserToProcedure}
      />
      {selectedUsers.length > 0 && (
        <button
          className="btn btn-sm btn-danger mt-2"
          onClick={handleClearAllUsers}
        >
          Remove All Users
        </button>
      )}
    </div>
  );
};

export default PlanProcedureItem;
