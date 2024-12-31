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
  const { username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted } = req.body;

  if (!username || !user_firstname || !user_lastname || !user_email || !user_password || !user_confirmpassword || !role) {
    return res.status(400).send('All fields are required');
  }

  const query = 'CALL stp_UserMaster(2, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Remove user_phone from the query
  const params = [username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ message: 'User added successfully', insertId: results[0][0].insertId });
  });
});

// Get a user by ID (Flag 4)
router.get('/:userid', (req, res) => {
  const query = 'CALL stp_UserMaster(4, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)'; // Removed user_phone here as well
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
  const { userid } = req.params;
  const { username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted } = req.body;

  const query = 'CALL stp_UserMaster(3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Removed user_phone here as well
  const params = [userid, username, user_firstname, user_lastname, user_email, user_password, user_confirmpassword, role, isactive, isdeleted];

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Server Error');
    }
    res.send('User updated successfully');
  });
});

// Soft delete a user by ID (Flag 5)
router.delete('/:userid', (req, res) => {
  const query = 'CALL stp_UserMaster(5, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)'; // Removed user_phone here as well
  const params = [req.params.userid];

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Server Error');
    }
    res.send({ message: 'User deleted' });
  });
});

export default router;
