import express from 'express';
import multer from 'multer';
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
}).fields([
  { name: 'panphoto', maxCount: 1 },
  { name: 'gstphoto', maxCount: 1 },
]);

// GET all parties
router.get('/', (req, res) => {
  db.query('CALL stp_PartyMaster(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]);
  });
});

// POST a new party
router.post('/', upload, (req, res) => {
  //console.log("Received files:", req.files);  // Log the files object
  //console.log("Received body:", req.body);

  const { partyname, partyrefname, panno, gstno,isvendor} = req.body;
  const isvendorValue = isvendor === "1" ? 1 : 0; 
  let panphoto = req.files?.panphoto ? req.files.panphoto[0].path : null;
  let gstphoto = req.files?.gstphoto ? req.files.gstphoto[0].path : null;
   // If files are present, convert the full file path to a relative path
   if (panphoto) {
    panphoto = path.relative(path.join(__dirname, '..'), panphoto).replace(/\\/g, '/');
  }

  if (gstphoto) {
    gstphoto = path.relative(path.join(__dirname, '..'), gstphoto).replace(/\\/g, '/');
  }

  if (!partyname?.trim() || !partyrefname?.trim() || !panno?.trim() || !gstno?.trim()) {
    return res.status(400).send('All required fields must be provided');
  }
  const params = [2, null, partyname, partyrefname, panno, panphoto, gstno, gstphoto, isvendorValue];

  db.query('CALL stp_PartyMaster(?, ?, ?, ?, ?, ?, ?, ?, ?)', params, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err.sqlMessage || err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ insertId: results[0][0].insertId || 'Unknown' });
  });
});


// GET a party by ID
router.get('/:partyid', (req, res) => {
  const partyid = req.params.partyid;
  db.query('CALL stp_PartyMaster(4, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)', [partyid], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0][0]);
  });
});

// PUT to update a party by ID
router.put('/:partyid', upload, (req, res) => { // Use `upload` directly here
  
  const { partyid } = req.params;
  const { partyname, partyrefname, panno, gstno, isvendor } = req.body;

  const panphoto = req.files['panphoto'] ? req.files['panphoto'][0].path : null;
  const gstphoto = req.files['gstphoto'] ? req.files['gstphoto'][0].path : null;

  if (!partyname || !partyrefname || !panno || !gstno) {
    return res.status(400).send('All required fields must be provided');
  }

  const params = [3, partyid, partyname, partyrefname, panno, panphoto, gstno, gstphoto, isvendor];

  db.query('CALL stp_PartyMaster(?, ?, ?, ?, ?, ?, ?, ?, ?)', params, (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Server Error');
    }

    const updatedId = results[0][0].updatedId;

    if (panphoto || gstphoto) {
      db.query('SELECT panphoto, gstphoto FROM tbl_PartyMaster WHERE partyid = ?', [partyid], (err, results) => {
        if (err) {
          console.error('Error querying database for old photos:', err);
          return res.status(500).send('Server Error');
        }

        const existingParty = results[0];
        if (existingParty) {
          if (panphoto && existingParty.panphoto) {
            fs.unlink(path.join(__dirname, '..', existingParty.panphoto), err => {
              if (err) console.error('Error deleting old PAN photo:', err);
            });
          }
          if (gstphoto && existingParty.gstphoto) {
            fs.unlink(path.join(__dirname, '..', existingParty.gstphoto), err => {
              if (err) console.error('Error deleting old GST photo:', err);
            });
          }
        }
      });
    }

    res.send({ updatedId: updatedId });
  });
});

// DELETE a party by ID
router.delete('/:partyid', (req, res) => {
  const partyid = req.params.partyid;
  db.query('CALL stp_PartyMaster(5, ?)', [partyid], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Server Error');
    }
    res.send({ message: 'Party deleted successfully' });
  });
});

export default router;
