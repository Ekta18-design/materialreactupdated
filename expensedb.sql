-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 28, 2024 at 12:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `expensedb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_PartyMaster` (IN `p_flag` INT, IN `p_partyid` INT, IN `p_partyname` VARCHAR(255), IN `p_partyrefname` VARCHAR(255), IN `p_panno` VARCHAR(255), IN `p_panphoto` VARCHAR(255), IN `p_gstno` VARCHAR(255), IN `p_gstphoto` VARCHAR(255), IN `p_isvendor` TINYINT)   BEGIN
  CASE p_flag

    -- Flag 1: Fetch all parties
    WHEN 1 THEN
      SELECT * FROM tbl_PartyMaster;

    -- Flag 2: Insert new party
    WHEN 2 THEN
      IF p_partyid IS NULL THEN
        INSERT INTO tbl_PartyMaster (
          partyname, partyrefname, panno, panphoto, gstno, gstphoto, isvendor
        ) VALUES (
          p_partyname, p_partyrefname, p_panno, p_panphoto, p_gstno, p_gstphoto, p_isvendor
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Party ID must be NULL for new party insertion';
      END IF;

    -- Flag 3: Update existing party
    WHEN 3 THEN
      IF p_partyid IS NOT NULL THEN
        UPDATE tbl_PartyMaster
        SET partyname = p_partyname, 
            partyrefname = p_partyrefname, 
            panno = p_panno, 
            panphoto = p_panphoto, 
            gstno = p_gstno, 
            gstphoto = p_gstphoto, 
            isvendor = p_isvendor
        WHERE partyid = p_partyid;
        SELECT p_partyid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Party ID cannot be NULL for update';
      END IF;

    -- Flag 4: Fetch party by ID
    WHEN 4 THEN
      IF p_partyid IS NOT NULL THEN
        SELECT * FROM tbl_PartyMaster WHERE partyid = p_partyid;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Party ID cannot be NULL for fetching party';
      END IF;

    -- Flag 5: Delete party by ID
    WHEN 5 THEN
      IF p_partyid IS NOT NULL THEN
        DELETE FROM tbl_PartyMaster WHERE partyid = p_partyid;
        SELECT p_partyid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Party ID cannot be NULL for deletion';
      END IF;

    ELSE
      -- Invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_UserMaster` (IN `p_flag` INT, IN `p_userid` INT, IN `p_username` VARCHAR(50), IN `p_user_firstname` VARCHAR(50), IN `p_user_lastname` VARCHAR(50), IN `p_user_email` VARCHAR(100), IN `p_user_password` VARCHAR(255), IN `p_user_confirmpassword` VARCHAR(255), IN `p_role` VARCHAR(50), IN `p_isactive` TINYINT(1), IN `p_isdeleted` TINYINT(1))   BEGIN
  CASE p_flag
    -- Flag 1: Fetch all users (who are not deleted)
    WHEN 1 THEN
      SELECT * FROM tbl_UserMaster WHERE isdeleted = 0;

    -- Flag 2: Insert new user
    WHEN 2 THEN
      IF p_userid IS NULL THEN
        INSERT INTO tbl_UserMaster (
          username, user_firstname, user_lastname, user_email, 
          user_password, user_confirmpassword, role, isactive, isdeleted
        ) VALUES (
          p_username, p_user_firstname, p_user_lastname, p_user_email, 
          p_user_password, p_user_confirmpassword, p_role, p_isactive, p_isdeleted
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID must be NULL for new user insertion';
      END IF;

    -- Flag 3: Update existing user
    WHEN 3 THEN
      IF p_userid IS NOT NULL THEN
        UPDATE tbl_UserMaster
        SET username = p_username, 
            user_firstname = p_user_firstname, 
            user_lastname = p_user_lastname, 
            user_email = p_user_email,
            user_password = p_user_password, 
            user_confirmpassword = p_user_confirmpassword, 
            role = p_role,
            isactive = p_isactive, 
            isdeleted = p_isdeleted
        WHERE userid = p_userid;
        SELECT p_userid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for update';
      END IF;

    -- Flag 4: Fetch user by ID
    WHEN 4 THEN
      IF p_userid IS NOT NULL THEN
        SELECT * FROM tbl_UserMaster WHERE userid = p_userid AND isdeleted = 0;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for fetching user';
      END IF;

    -- Flag 5: Soft delete user by ID
    WHEN 5 THEN
      IF p_userid IS NOT NULL THEN
        UPDATE tbl_UserMaster SET isdeleted = TRUE WHERE userid = p_userid;
        SELECT p_userid AS deletedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User ID cannot be NULL for deletion';
      END IF;

    ELSE
      -- Invalid flag error
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END CASE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_partymaster`
--

CREATE TABLE `tbl_partymaster` (
  `partyid` int(11) NOT NULL,
  `partyname` varchar(255) NOT NULL,
  `partyrefname` varchar(255) DEFAULT NULL,
  `panno` varchar(255) DEFAULT NULL,
  `panphoto` varchar(255) DEFAULT NULL,
  `gstno` varchar(255) DEFAULT NULL,
  `gstphoto` varchar(255) DEFAULT NULL,
  `isvendor` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_usermaster`
--

CREATE TABLE `tbl_usermaster` (
  `userid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `user_firstname` varchar(50) NOT NULL,
  `user_lastname` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_confirmpassword` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `isactive` tinyint(1) NOT NULL DEFAULT 1,
  `isdeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_usermaster`
--

INSERT INTO `tbl_usermaster` (`userid`, `username`, `user_firstname`, `user_lastname`, `user_email`, `user_password`, `user_confirmpassword`, `role`, `isactive`, `isdeleted`) VALUES
(1, 'ekta', 'Ekta', 'Shah', 'ekta@gmail.com', '123', '123', 'admin', 1, 0),
(2, 'dummy', 'dummy', 'data', 'dummy@gmail.com', '123', '123', 'user', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_partymaster`
--
ALTER TABLE `tbl_partymaster`
  ADD PRIMARY KEY (`partyid`);

--
-- Indexes for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_partymaster`
--
ALTER TABLE `tbl_partymaster`
  MODIFY `partyid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
