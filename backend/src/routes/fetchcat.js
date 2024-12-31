import express from 'express';
import db from '../config/db.js';
import fs from 'fs';

const router = express.Router();

// Endpoint to fetch categories and subcategories separately
router.get('/', (req, res) => {
  // Fetch categories from tbl_category
  db.query('SELECT * FROM tbl_Category', (err, categories) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Error fetching categories');
    }

    // Fetch subcategories from tbl_subcategory
    db.query('SELECT * FROM tbl_Subcategory', (err, subcategories) => {
      if (err) {
        console.error('Error fetching subcategories:', err);
        return res.status(500).send('Error fetching subcategories');
      }

      // Return categories and subcategories separately
      res.json({
        categories: categories,
        subcategories: subcategories
      });
    });
  });
});

export default router;