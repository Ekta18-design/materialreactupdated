import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For navigation and fetching userId from URL
import axios from "axios";

// Material Dashboard 2 React components (same as before)
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox"; // For checkbox
import FormControlLabel from "@mui/material/FormControlLabel";

function Form() {
  const [formData, setFormData] = useState({
    username: '',
    user_firstname: '',
    user_lastname: '',
    user_email: '',
    user_password: '',
    user_confirmpassword: '',
    role: 'user',
    isactive: false,
    isdeleted: false,
  });

  const navigate = useNavigate();
  const { userId } = useParams(); // Get the userId from the URL

  useEffect(() => {
    // Fetch user data by userId to prefill the form
    axios.get(`http://localhost:5001/usermaster/${userId}`)
      .then((response) => {
        setFormData(response.data); // Prefill the form with the user data
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5001/usermaster/${userId}`, formData);
      console.log("User updated successfully:", response.data);

      alert("User updated successfully!");
      navigate("/usermastertables"); // Redirect to the User Master Tables
    } catch (error) {
      console.error("Error updating user:", error);
      alert("There was an error updating the user.");
    }
  };
  const handleCancel = () => {
    // Redirect back to the User Master Tables without making any changes
    navigate("/usermastertables");
  };

  return (
    <Card>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" onSubmit={handleSubmit} role="form">
          <Grid container spacing={3} >
            {/* First Column */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Username"
                  variant="standard"
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="First Name"
                  variant="standard"
                  fullWidth
                  name="user_firstname"
                  value={formData.user_firstname}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Last Name"
                  variant="standard"
                  fullWidth
                  name="user_lastname"
                  value={formData.user_lastname}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="standard"
                  fullWidth
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                />
              </MDBox>
            </Grid>

            {/* Second Column */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Confirm Password"
                  variant="standard"
                  fullWidth
                  name="user_confirmpassword"
                  value={formData.user_confirmpassword}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Role"
                  variant="standard"
                  fullWidth
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="checkbox"
                  label="Is Active"
                  name="isactive"
                  checked={formData.isactive}
                  onChange={handleChange}
                />
              </MDBox>
            </Grid>
          </Grid>

          <MDBox mt={4} mb={1} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="info" sx={{ px: 4 }} type="submit">
              Update
            </MDButton>
            <MDButton variant="gradient"  color="secondary" sx={{ px: 4 }} onClick={handleCancel}>
              Cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Form;
