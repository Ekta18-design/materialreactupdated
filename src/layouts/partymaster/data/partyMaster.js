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
import React,{ useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 



// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Form() {
  const [formData, setFormData] = useState({
    partyname: "",
    partyrefname: "",
    panno: "",
    panphoto: null,
    gstno: "",
    gstphoto: null,
    isvendor: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target; // Files property instead of file
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Attach the file correctly
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("partyname", formData.partyname);
    formPayload.append("partyrefname", formData.partyrefname);
    formPayload.append("panno", formData.panno);
    formPayload.append("gstno", formData.gstno);
    formPayload.append("isvendor", formData.isvendor ? "1" : "0");

    if (formData.panphoto) formPayload.append("panphoto", formData.panphoto);
    if (formData.gstphoto) formPayload.append("gstphoto", formData.gstphoto);

    try {
      const response = await axios.post("http://localhost:5001/partymaster", formPayload);

      if (response.data) {
        alert("Party saved successfully!");

        // Redirect to the dashboard after successful save
        navigate("/dashboard"); // Replace '/dashboard' with your actual dashboard route
      }
    } catch (error) {
      console.error("Error saving party:", error);
      alert("Failed to save party. Please try again.");
    }
  };


  return (
    <Card>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" width="100%" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* First Column */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Party Name"
                  variant="standard"
                  fullWidth
                  name="partyname"
                  value={formData.partyname}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="GST No."
                  variant="standard"
                  fullWidth
                  name="gstno"
                  value={formData.gstno}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="PAN No."
                  variant="standard"
                  fullWidth
                  name="panno"
                  value={formData.panno}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={2}>
                <Switch
                  checked={formData.isvendor}
                  onChange={handleChange}
                  name="isvendor"
                />
                <MDTypography variant="button" fontWeight="regular" color="text" sx={{ ml: 2 }}>
                  Is Vendor (Yes/No)
                </MDTypography>
              </MDBox>
            </Grid>

            {/* Second Column */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Party Ref. Name"
                  variant="standard"
                  fullWidth
                  name="partyrefname"
                  value={formData.partyrefname}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="file"
                  label="GST Photo"
                  variant="standard"
                  fullWidth
                  name="gstphoto"
                  onChange={handleFileChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="file"
                  label="PAN Photo"
                  variant="standard"
                  fullWidth
                  name="panphoto"
                  onChange={handleFileChange}
                />
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
