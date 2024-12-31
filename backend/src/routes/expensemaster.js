import express from 'express';
import multer from 'multer';
import db from '../config/db.js';  // Ensure this is properly configured for your DB connection
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure the expensefolder directory exists
const expenseFolder = path.join(__dirname, '..', 'expensefolder');
if (!fs.existsSync(expenseFolder)) {
  fs.mkdirSync(expenseFolder, { recursive: true });
}

// Configure multer for file uploads to expensefolder
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, expenseFolder);  // Change destination to 'expensefolder'
    },
    filename: (req, file, cb) => {
      const expenseid = req.body.expenseid || Date.now();
      cb(null, `${expenseid}-${file.originalname}`);
    },
  }),
}).fields([
  { name: 'uploadfile', maxCount: 1 },  // Only 'uploadfile' field will be handled here
]);

// POST a new expense (with file upload)
router.post('/', upload, (req, res) => {
  const { date, from_party, to_party, category, subcategory, paid_to, paid_for } = req.body;
  let uploadfile = req.files?.uploadfile ? req.files.uploadfile[0].path : null;

  // Validate the necessary fields
  if (!date || !from_party?.trim() || !to_party?.trim() || !category?.trim() || !subcategory?.trim() || !paid_to?.trim() || !paid_for?.trim()) {
    return res.status(400).send('All required fields must be provided');
  }

  // Insert the expense record first to get the expenseid
  db.query('CALL stp_ExpenseMaster(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?)', [date, from_party, to_party, category, subcategory, paid_to, paid_for, uploadfile], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err.sqlMessage || err);
      return res.status(500).send('Server Error');
    }

    // Get the generated expenseid from the database (it is in the first result of the procedure)
    const expenseid = results[0][0]?.insertId;

    if (!expenseid) {
      return res.status(500).send('Failed to retrieve expenseid');
    }

    // Update the file upload with the expenseid as prefix
    if (uploadfile) {
      const originalFileName = req.files.uploadfile[0].originalname;
      const newFileName = `${expenseid}-${originalFileName}`;

      // Rename the uploaded file to include the expenseid as prefix
      const oldPath = req.files.uploadfile[0].path;
      const newPath = path.join(expenseFolder, newFileName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error('Error renaming file:', err);
          return res.status(500).send('Server Error');
        }
      });

      // Update the database with the new file path (relative to the server's root)
      const relativePath = path.relative(path.join(__dirname, '..'), newPath).replace(/\\/g, '/');
      uploadfile = `expensefolder/${relativePath}`;
    }
    

    // Respond with the inserted expenseid
    res.status(201).send({ insertId: expenseid || 'Unknown' });
  });
});


// GET all expenses
router.get('/', (req, res) => {
  // Fetch additional data (parties, categories, subcategories) from the database
  db.query('SELECT * FROM tbl_PartyMaster WHERE isvendor = 0', (err, fromPartiesResults) => {
    if (err) {
      console.error('Error querying fromParties:', err);
      return res.status(500).send('Server Error');
    }

    db.query('SELECT * FROM tbl_PartyMaster WHERE isvendor = 1', (err, toPartiesResults) => {
      if (err) {
        console.error('Error querying toParties:', err);
        return res.status(500).send('Server Error');
      }

      db.query('SELECT * FROM tbl_Category', (err, categoryResults) => {
        if (err) {
          console.error('Error querying categories:', err);
          return res.status(500).send('Server Error');
        }

        db.query('SELECT * FROM tbl_Subcategory', (err, subcategoryResults) => {
          if (err) {
            console.error('Error querying subcategories:', err);
            return res.status(500).send('Server Error');
          }

          // Now we have all the necessary data
          db.query('CALL stp_ExpenseMaster(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', (err, results) => {
            if (err) {
              console.error('Error querying expenses:', err);
              return res.status(500).send('Server Error');
            }

            // Process the results to add names for parties, categories, etc.
            const expenses = results[0].map(expense => {
              return {
                ...expense,
                from_party_name: fromPartiesResults.find(party => party.partyid === expense.from_party)?.partyname,
                to_party_name: toPartiesResults.find(party => party.partyid === expense.to_party)?.partyname,
                category_name: categoryResults.find(cat => cat.categoryid === expense.category)?.categoryname,
                subcategory_name: subcategoryResults.find(subcat => subcat.subcategoryid === expense.subcategory)?.subcategoryname,
                uploadfile: expense.uploadfile.replace(/\\/g, '/') 
              };
            });

            res.send(expenses);
          });
        });
      });
    });
  });
});


// GET expense by ID
router.get('/:expenseid', (req, res) => {
  const { expenseid } = req.params;

  db.query('CALL stp_ExpenseMaster(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', [expenseid], (err, results) => {
    if (err) {
      console.error('Error fetching expense by ID:', err);
      return res.status(500).send('Server Error'); 
    }
    if (results[0].length === 0) {
      return res.status(404).send('Expense not found');
    }
    res.send(results[0][0]);
  });
});

// PUT to update an expense by ID (with file upload if present)
router.put('/:expenseid', upload, (req, res) => {
  const { expenseid } = req.params;
  const { date, from_party, to_party, category, subcategory, paid_to, paid_for } = req.body;
  let uploadfile = req.files?.uploadfile ? req.files.uploadfile[0].path : null;

  if (uploadfile) {
    uploadfile = path.relative(path.join(__dirname, '..'), uploadfile).replace(/\\/g, '/');
  }

  // Validate the necessary fields
  if (!date || !from_party?.trim() || !to_party?.trim() || !category?.trim() || !subcategory?.trim() || !paid_to?.trim() || !paid_for?.trim()) {
    return res.status(400).send('All required fields must be provided');
  }

  const params = [3, expenseid, date, from_party, to_party, category, subcategory, paid_to, paid_for, uploadfile];

  db.query('CALL stp_ExpenseMaster(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params, (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Server Error');
    }
    if (results[0].length === 0) {
      return res.status(404).send('Expense not found for update');
    }
    res.send({ updatedId: results[0][0].updatedId });
  });
});

// DELETE an expense by ID
router.delete('/:expenseid', (req, res) => {
  const { expenseid } = req.params;

  db.query('CALL stp_ExpenseMaster(4, ?)', [expenseid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Server Error');
    }
    res.send({ message: 'Expense deleted successfully' });
  });
});

export default router;
