/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For routing
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";


// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

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

const navigate = useNavigate(); // For navigation after successful form submission

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleSwitchChange = (e, field) => {
  setFormData((prevData) => ({
    ...prevData,
    [field]: e.target.checked,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Post form data to backend
  try {
    const response = await axios.post('http://localhost:5001/usermaster', formData);
    console.log('User added successfully:', response.data);

    // Redirect to the dashboard upon successful submission
    navigate('/dashboard'); 
  } catch (error) {
    console.error('Error adding user:', error);
    alert("There was an error adding the user.");
  }
};

return (
  <Card>
  <MDBox pt={4} pb={3} px={3}>
    <MDBox component="form" onSubmit={handleSubmit} role="form">
      <Grid container spacing={3}>
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
              select 
              label="Role" 
              variant="standard" 
              fullWidth 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </MDInput>
          </MDBox>
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} md={6}>
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
              type="email" 
              label="Email" 
              variant="standard" 
              fullWidth 
              name="user_email" 
              value={formData.user_email} 
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

          {/* Is Active and Is Deleted in the same row */}
          <MDBox display="flex" alignItems="center" mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <MDBox display="flex" alignItems="center" mb={3}>
                  <Switch
                    checked={formData.isactive}
                    onChange={(e) => handleSwitchChange(e, 'isactive')}
                  />
                  <MDTypography variant="button" fontWeight="regular" color="text" sx={{ ml: 2 }}>
                    Is Active
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={6}>
                <MDBox display="flex" alignItems="center" mb={3}>
                  <Switch
                    checked={formData.isdeleted}
                    onChange={(e) => handleSwitchChange(e, 'isdeleted')}
                  />
                  <MDTypography variant="button" fontWeight="regular" color="text" sx={{ ml: 2 }}>
                    Is Deleted
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
      </Grid>

      <MDBox mt={4} mb={1} display="flex" justifyContent="center">
        <MDButton variant="gradient" color="info" sx={{ px: 4 }} type="submit">
          Save
        </MDButton>
      </MDBox>
    </MDBox>
  </MDBox>
  </Card>
);
}

export default Form;
