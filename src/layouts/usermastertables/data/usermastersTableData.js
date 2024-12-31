import { useEffect, useState } from "react";
import axios from "axios"; // To make API requests
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types"; // Import PropTypes
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";

export default function usermastersTableData() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/usermaster")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5001/usermaster/${userId}`)
        .then(() => {
          setUsers(users.filter((user) => user.userid !== userId));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const handleEdit = (userId) => {
    navigate(`/usermaster/edit/${userId}`);
  };

  const Role = ({ role }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {role}
      </MDTypography>
    </MDBox>
  );

  Role.propTypes = {
    role: PropTypes.string.isRequired,
  };

  const Status = ({ isactive }) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={isactive ? "Active" : "Inactive"}
        color={isactive ? "success" : "dark"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  Status.propTypes = {
    isactive: PropTypes.bool.isRequired,
  };

  const columns = [
    { Header: "User ID", accessor: "userid", align: "left" },
    { Header: "Username", accessor: "username", align: "left" },
    { Header: "First Name", accessor: "user_firstname", align: "left" },
    { Header: "Last Name", accessor: "user_lastname", align: "left" },
    { Header: "Email", accessor: "user_email", align: "left" },
    { Header: "Role", accessor: "role", align: "left" },
    { Header: "Status", accessor: "isactive", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = users.map((user) => ({
    userid: user.userid,
    username: user.username,
    user_firstname: user.user_firstname,
    user_lastname: user.user_lastname,
    user_email: user.user_email,
    role: <Role role={user.role} />,
    isactive: <Status isactive={user.isactive} />,
    action: (
      <MDBox display="flex" justifyContent="center" gap={2}>
        <MDTypography
          component="button"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleEdit(user.userid)}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            borderRadius: "4px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          <FaEdit style={{ marginRight: "5px" }} />
          Edit
        </MDTypography>
        <MDTypography
          component="button"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleDelete(user.userid)}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            borderRadius: "4px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          <FaTrash style={{ marginRight: "5px" }} />
          Delete
        </MDTypography>
      </MDBox>
    ),
  }));

  return { columns, rows };
}
