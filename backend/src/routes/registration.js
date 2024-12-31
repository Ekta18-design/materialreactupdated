import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all users (Flag 1)
router.get('/', (req, res) => {
  const query = 'CALL stp_UserMaster(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0]); // Stored procedure returns data in the first index of results array
  });
});

// Insert a new user (Flag 2)
router.post('/', (req, res) => {
  const { username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword } = req.body;
  console.log("Received body:", req.body);

  // Validate required fields
  if (!username || !user_firstname || !user_lastname || !user_email || !user_password || !user_confirmpassword) {
    console.log("Missing fields:", {
      username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword
    });
    return res.status(400).json({
      error: 'All fields are required',
      missingFields: {
        username: !username ? 'Missing' : 'Provided',
        user_firstname: !user_firstname ? 'Missing' : 'Provided',
        user_lastname: !user_lastname ? 'Missing' : 'Provided',
        user_email: !user_email ? 'Missing' : 'Provided',
        user_password: !user_password ? 'Missing' : 'Provided',
        user_confirmpassword: !user_confirmpassword ? 'Missing' : 'Provided',
      },
    });
  }

  // Set default values for optional fields
  const role = req.body.role || 'user';
  const isactive = req.body.isactive !== undefined ? req.body.isactive : 1;
  const isdeleted = req.body.isdeleted !== undefined ? req.body.isdeleted : 0;
  

  const query = 'CALL stp_UserMaster(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).json({ message: 'User added successfully', insertId: results[0][0]?.insertId });
  });
});

// Get a user by ID (Flag 4)
router.get('/:userid', (req, res) => {
  const query = 'CALL stp_UserMaster(4, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  const params = [req.params.userid];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Server Error');
    }
    res.send(results[0][0] || { message: 'User not found' });
  });
});

// Update an existing user (Flag 3)
router.put('/:userid', (req, res) => {
  const { username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword } = req.body;
  const { userid } = req.params;

  if (!username || !user_firstname || !user_lastname || !user_email || !user_password || !user_confirmpassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Default values for role, isactive, isdeleted can be used here if required in updates.
  const role = 'user';
  const isactive = 1;
  const isdeleted = 0;

  const query = 'CALL stp_UserMaster(3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [userid, username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted];

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Server Error');
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Soft delete a user by ID (Flag 5)
router.delete('/:userid', (req, res) => {
  const query = 'CALL stp_UserMaster(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)';
  const params = [req.params.userid];

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Server Error');
    }
    res.json({ message: 'User deleted' });
  });
});

export default router;
