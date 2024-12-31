-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 01, 2025 at 12:20 AM
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `stp_ExpenseMaster` (IN `p_flag` INT, IN `p_expenseid` INT, IN `p_date` DATE, IN `p_from_party` VARCHAR(255), IN `p_to_party` VARCHAR(255), IN `p_category` VARCHAR(255), IN `p_subcategory` VARCHAR(255), IN `p_paid_to` VARCHAR(255), IN `p_paid_for` VARCHAR(255), IN `p_uploadfile` VARCHAR(255))   BEGIN
  -- Begin the control flow
  IF p_flag = 1 THEN
    -- Flag 1: Fetch all expenses
    SELECT * FROM tbl_ExpenseMaster;

  ELSEIF p_flag = 2 THEN
    -- Flag 2: Insert new expense
    IF p_expenseid IS NULL THEN
      -- Check if required fields are not NULL
      IF p_date IS NOT NULL AND p_from_party IS NOT NULL AND p_to_party IS NOT NULL 
         AND p_category IS NOT NULL AND p_subcategory IS NOT NULL AND p_paid_to IS NOT NULL AND p_paid_for IS NOT NULL THEN
        INSERT INTO tbl_ExpenseMaster (
          date, from_party, to_party, category, subcategory, paidto, paidfor, uploadfile
        ) VALUES (
          p_date, p_from_party, p_to_party, p_category, p_subcategory, p_paid_to, p_paid_for, p_uploadfile
        );
        SELECT LAST_INSERT_ID() AS insertId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Missing required fields for expense insertion';
      END IF;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Expense ID must be NULL for new expense insertion';
    END IF;

  ELSEIF p_flag = 3 THEN
    -- Flag 3: Update existing expense
    IF p_expenseid IS NOT NULL THEN
      -- Check if required fields are not NULL
      IF p_date IS NOT NULL AND p_from_party IS NOT NULL AND p_to_party IS NOT NULL 
         AND p_category IS NOT NULL AND p_subcategory IS NOT NULL AND p_paid_to IS NOT NULL AND p_paid_for IS NOT NULL THEN
        UPDATE tbl_ExpenseMaster
        SET 
          date = p_date,
          from_party = p_from_party,
          to_party = p_to_party,
          category = p_category,
          subcategory = p_subcategory,
          paidto = p_paid_to,
          paidfor = p_paid_for,
          uploadfile = p_uploadfile
        WHERE expenseid = p_expenseid;
        SELECT p_expenseid AS updatedId;
      ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Missing required fields for expense update';
      END IF;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Expense ID cannot be NULL for update';
    END IF;

  ELSEIF p_flag = 4 THEN
    -- Flag 4: Delete expense by ID
    IF p_expenseid IS NOT NULL THEN
      DELETE FROM tbl_ExpenseMaster WHERE expenseid = p_expenseid;
      SELECT p_expenseid AS deletedId;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Expense ID cannot be NULL for deletion';
    END IF;

  ELSEIF p_flag = 5 THEN
    -- Flag 5: Fetch expense by ID
    IF p_expenseid IS NOT NULL THEN
      SELECT * FROM tbl_ExpenseMaster WHERE expenseid = p_expenseid;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Expense ID cannot be NULL for fetching expense';
    END IF;

  ELSE
    -- Invalid flag error
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid flag value';
  END IF;

END$$

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
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `categoryid` int(11) NOT NULL,
  `categoryname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`categoryid`, `categoryname`) VALUES
(1, 'category 1'),
(2, 'category 2'),
(3, 'category 1'),
(4, 'category 2');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_expensemaster`
--

CREATE TABLE `tbl_expensemaster` (
  `expenseid` int(11) NOT NULL,
  `date` date NOT NULL,
  `from_party` varchar(255) NOT NULL,
  `to_party` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `subcategory` varchar(255) NOT NULL,
  `paidto` varchar(255) NOT NULL,
  `paidfor` varchar(255) NOT NULL,
  `uploadfile` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_expensemaster`
--

INSERT INTO `tbl_expensemaster` (`expenseid`, `date`, `from_party`, `to_party`, `category`, `subcategory`, `paidto`, `paidfor`, `uploadfile`) VALUES
(1, '2024-12-18', '6', '3', '2', '3', 'jkg', 'bgfd', 'expensefolder/1735589070792-building-1491692_1920.jpg'),
(2, '2024-11-15', 'Pop', 'Demo', 'category 1', 'subcategory 1', 'jkhfg', 'lkhjf', 'expensefolder/1735589599264-file.jpg'),
(3, '2024-11-16', 'Pop', 'RRR', 'category 2', 'subcategory 1', 'dfsa', 'fgs', 'expensefolder/1735665838131-living-room-8477521_1280.jpg'),
(4, '2024-10-19', 'Pop', 'Demo', 'category 2', 'subcategory 1', 'sdf', 'jhg', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\expensefolder\\1735666278649-building-1491692_1920.jpg'),
(5, '2024-12-08', 'Pop', 'Demo', 'category 2', 'subcategory 2', 'asdadad', 'fder', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\expensefolder\\1735666705745-gro.jpg'),
(6, '2024-12-08', 'Pop', 'Demo', 'category 2', 'subcategory 2', 'asdadad', 'fder', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\expensefolder\\1735666768958-gro.jpg'),
(7, '2024-12-22', 'Pop', 'Demo', 'category 1', 'subcategory 1', 'eredadasd', 'tre', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\expensefolder\\1735667154491-screencapture-localhost-3000-expensemaster-2024-12-27-12_50_59.png'),
(8, '2024-09-06', 'Pop', 'Demo', 'category 2', 'subcategory 1', 'czccc', 'dczczc', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\expensefolder\\1735667998915-screencapture-localhost-3000-usermaster-2024-12-27-12_47_30.png');

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

--
-- Dumping data for table `tbl_partymaster`
--

INSERT INTO `tbl_partymaster` (`partyid`, `partyname`, `partyrefname`, `panno`, `panphoto`, `gstno`, `gstphoto`, `isvendor`) VALUES
(1, 'The One', 'Ref Name', 'ABCDE1234F', NULL, '12ABCDE3456F1Z5', NULL, 1),
(2, 'The one', 'gfdh', 'l85654kj', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\uploads\\1735580862221-building-1491692_1280.jpg', 'kj85964578', 'C:\\Users\\Dell\\material-dashboard-react-main\\backend\\src\\uploads\\1735580862482-download.jpeg', 1),
(3, 'The one', 'gfdh', 'l85654kj', 'uploads/1735581261399-building-1491692_1280.jpg', 'kj85964578', 'uploads/1735581261409-download.jpeg', 1),
(4, 'Demo', 'dfg', 'kl547896n', 'uploads/1735584512742-about2.jpg', 'j96547823', 'uploads/1735584513109-gro.jpg', 1),
(5, 'RRR', 'jk', '8574ddff', 'uploads/1735584861650-h1 (1).jpg', 'kl8564', 'uploads/1735584861990-abbpage.jpg', 1),
(6, 'Pop', 'gfdh', 'lkjh96452v', 'uploads/1735585247314-g1 (1).jpg', 'kjhg8564', 'uploads/1735585247341-download.jpeg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subcategory`
--

CREATE TABLE `tbl_subcategory` (
  `subcategoryid` int(11) NOT NULL,
  `subcategoryname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_subcategory`
--

INSERT INTO `tbl_subcategory` (`subcategoryid`, `subcategoryname`) VALUES
(1, 'subcategory 1'),
(2, 'subcategory 2'),
(3, 'subcategory 1'),
(4, 'subcategory 2');

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
(1, 'ekta', 'Ekta', 'Shah', 'ekta@gmail.com', '123', '123', 'admin', 1, 1),
(2, 'dummy', 'dummy', 'data', 'dummy@gmail.com', '123', '123', 'user', 1, 1),
(3, 'vicky', 'Vicky', 'Ajmera', 'vicky@gmail.com', '123', '123', 'user', 1, 0),
(4, 'ekta', 'Ekta', 'Shah', 'ekta@gmail.com', '123', '123', 'user', 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`categoryid`);

--
-- Indexes for table `tbl_expensemaster`
--
ALTER TABLE `tbl_expensemaster`
  ADD PRIMARY KEY (`expenseid`);

--
-- Indexes for table `tbl_partymaster`
--
ALTER TABLE `tbl_partymaster`
  ADD PRIMARY KEY (`partyid`);

--
-- Indexes for table `tbl_subcategory`
--
ALTER TABLE `tbl_subcategory`
  ADD PRIMARY KEY (`subcategoryid`);

--
-- Indexes for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_expensemaster`
--
ALTER TABLE `tbl_expensemaster`
  MODIFY `expenseid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_partymaster`
--
ALTER TABLE `tbl_partymaster`
  MODIFY `partyid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_subcategory`
--
ALTER TABLE `tbl_subcategory`
  MODIFY `subcategoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_usermaster`
--
ALTER TABLE `tbl_usermaster`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
