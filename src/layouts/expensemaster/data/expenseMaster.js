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
import React, { useState, useEffect } from 'react'; // Import React hooks
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    // State variables to store categories and subcategories
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [fromParties, setFromParties] = useState([]);
    const [toParties, setToParties] = useState([]);
    
    // State to hold selected category and subcategory
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedFromParty, setSelectedFromParty] = useState('');
    const [selectedToParty, setSelectedToParty] = useState('');
    const [date, setDate] = useState('');
    const [paidTo, setPaidTo] = useState('');
    const [paidFor, setPaidFor] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch categories and subcategories
      axios.get('http://localhost:5001/fetchcat')
        .then(response => {
          setCategories(response.data.categories);
          setSubcategories(response.data.subcategories);
        })
        .catch(error => {
          console.error('Error fetching categories and subcategories:', error);
        });
  
      // Fetch party data
      axios.get('http://localhost:5001/partymaster')
        .then(response => {
          const partyData = response.data;
  
          // Separate parties based on isvendor
          const fromParties = partyData.filter(party => party.isvendor === 0);
          const toParties = partyData.filter(party => party.isvendor === 1);
  
          setFromParties(fromParties);
          setToParties(toParties);
        })
        .catch(error => {
          console.error('Error fetching party data:', error);
        });
    }, []);
  
    // Handle category and subcategory change
    const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
    };
  
    const handleSubcategoryChange = (event) => {
      setSelectedSubcategory(event.target.value);
    };
  
    const handleFromPartyChange = (event) => {
      setSelectedFromParty(event.target.value);
    };
  
    const handleToPartyChange = (event) => {
      setSelectedToParty(event.target.value);
    };
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setUploadFile(file);
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Find the selected party names and category names
      const fromPartyName = fromParties.find(party => party.partyid === selectedFromParty)?.partyname;
      const toPartyName = toParties.find(party => party.partyid === selectedToParty)?.partyname;
      const categoryName = categories.find(cat => cat.categoryid === selectedCategory)?.categoryname;
      const subcategoryName = subcategories.find(subcat => subcat.subcategoryid === selectedSubcategory)?.subcategoryname;
    
      const formData = new FormData();
      formData.append("date", date);
      formData.append("from_party", fromPartyName); // Store the name, not the ID
      formData.append("to_party", toPartyName); // Store the name, not the ID
      formData.append("category", categoryName); // Store the name, not the ID
      formData.append("subcategory", subcategoryName); // Store the name, not the ID
      formData.append("paid_to", paidTo);
      formData.append("paid_for", paidFor);
      
      // Append file if uploaded
      if (uploadFile) {
        formData.append("uploadfile", uploadFile);
      }
    
      try {
        const response = await axios.post('http://localhost:5001/expensemaster', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 201) {
          alert('Expense saved successfully!');
          // Redirect to the dashboard
          navigate('/dashboard');  // Assuming '/dashboard' is the route for your dashboard
        }
      } catch (error) {
        console.error('Error saving expense:', error);
        alert('Failed to save expense. Please try again.');
      }
    };
  return (
    <Card>
    <MDBox pt={4} pb={3} px={3}>
      <MDBox component="form" role="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* First Column */}
          <Grid item xs={12} md={6}>
          <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Date"
                  variant="standard"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true, // Ensures that the label is always above the input
                  }}
                />
              </MDBox>
            <MDBox mb={2}>
              <MDInput select label="From" variant="standard" fullWidth value={selectedFromParty} onChange={handleFromPartyChange}>
              {fromParties.map((party) => (
                    <MenuItem key={party.partyid} value={party.partyid}>
                      {party.partyname}
                    </MenuItem>
                  ))}
              </MDInput>
            </MDBox>
            <MDBox mb={2}>
              <MDInput select label="Category" variant="standard" fullWidth  value={selectedCategory}
                  onChange={handleCategoryChange} >
                {categories.map((category) => (
                    <MenuItem key={category.categoryid} value={category.categoryid}>
                      {category.categoryname}
                    </MenuItem>
                  ))}
              </MDInput>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Paid To" variant="standard" fullWidth value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)} />
            </MDBox>
          </Grid>

          {/* Second Column */}
          <Grid item xs={12} md={6}>
            <MDBox mb={2}>
              <MDInput type="text" label="Paid For" variant="standard" fullWidth value={paidFor}
                  onChange={(e) => setPaidFor(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput select label="To" variant="standard" fullWidth value={selectedToParty} onChange={handleToPartyChange}>
              {toParties.map((party) => (
                    <MenuItem key={party.partyid} value={party.partyid}>
                      {party.partyname}
                    </MenuItem>
                  ))}
              </MDInput>
            </MDBox>
            <MDBox mb={2}>
              <MDInput select label="Sub Category" variant="standard" fullWidth value={selectedSubcategory}
                  onChange={handleSubcategoryChange}>
                {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.subcategoryid} value={subcategory.subcategoryid}>
                      {subcategory.subcategoryname}
                    </MenuItem>
                  ))}
              </MDInput>
            </MDBox>
            <MDBox mb={2}>
                {/* File Upload Input with Restrictions */}
                <MDInput
                  type="file"
                  label="Upload File"
                  variant="standard"
                  fullWidth
                  accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .pdf" // Restrict file types
                  onChange={handleFileChange}
                />
                <MDTypography variant="caption" color="text" sx={{ mt: 1, display: 'block' }}>
                  Please upload an image (jpg, jpeg, png), Word document (doc, docx), Excel file (xls, xlsx), or PDF only.
                </MDTypography>
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
