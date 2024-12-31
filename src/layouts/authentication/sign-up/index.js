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

// react-router-dom components
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios"; 

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const navigate = useNavigate();

  // State to hold form values
  const [formData, setFormData] = useState({
    username: "",
    user_firstname: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
    user_confirmpassword: "",
    role: "user", // Default value for role
    isactive: true, // Default value for isactive
    isdeleted: false, // Default value for isdeleted
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.username ||
      !formData.user_firstname ||
      !formData.user_lastname ||
      !formData.user_email ||
      !formData.user_password ||
      !formData.user_confirmpassword
    ) {
      setError("All fields are required.");
      return; // Stop execution if validation fails
    }
    if (formData.user_password !== formData.user_confirmpassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const { role, isactive, isdeleted, ...dataToSubmit } = formData; // Remove optional fields
      //console.log("Payload being sent:", dataToSubmit);
      const response = await axios.post("http://localhost:5001/usermaster", {
        ...dataToSubmit, 
        role: formData.role || 'user', // Default role if not provided
        isactive: formData.isactive !== undefined ? formData.isactive : true, // Default isactive if not provided
        isdeleted: formData.isdeleted !== undefined ? formData.isdeleted : false, // Default isdeleted if not provided
      });
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/authentication/sign-in");
      }
    } catch (err) {
      console.error("Validation error details:", err.response?.data);
      setError(err.response?.data?.error || "Server Error");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={3}
          mt={-8}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign Up
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={4} px={5}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* Single-Column Form Layout */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="User Name"
                variant="standard"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </MDBox>

            {/* Submit button */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Sign Up
              </MDButton>
            </MDBox>

            {/* Sign In link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
