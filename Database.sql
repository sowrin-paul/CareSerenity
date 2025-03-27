CREATE TABLE `users` (
  `ac_pass` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ac_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ac_role` int NOT NULL DEFAULT '0' COMMENT ' 0 = user ; 1 = organization; 3 = admin',
  `is_volunteer` int NOT NULL DEFAULT '0' COMMENT ' 0 = no, 1 = yes',
  `ac_join_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_list` (
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id` int NOT NULL,
  `user_birth` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_NID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_job` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `child_adopted` int NOT NULL DEFAULT '0'
);

CREATE TABLE `admin_list` (
  `admin_id` int NOT NULL,
  `acc_id` int NOT NULL,
  `admin_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin_contact` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin_priyority` int DEFAULT NULL,
  `admin_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
);

CREATE TABLE `org_list` (
  `org_id` int NOT NULL,
  `org_name` varchar(255) DEFAULT NULL,
  `acc_id` int NOT NULL,
  `org_description` text,
  `org_email` varchar(255) DEFAULT NULL,
  `org_phone` varchar(255) DEFAULT NULL,
  `org_website` varchar(255) DEFAULT NULL,
  `org_logo` varchar(255) DEFAULT NULL,
  `established` varchar(255) DEFAULT NULL,
  `org_location` varchar(255) DEFAULT NULL,
  `org_vision` varchar(255) DEFAULT NULL,
  `org_reviews` decimal(2,2) DEFAULT NULL
);


------------------------------------------------------------------------------------

CREATE TABLE `adoptions` (
  `adoption_id` int NOT NULL,
  `orphan_id` int NOT NULL,
  `acc_id` int NOT NULL,
  `request_date` varchar(50) DEFAULT NULL,
  `status` int DEFAULT '0' COMMENT '0 = pending, 1 = approved, 2 = rejected',
  `issued_date` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `income` float DEFAULT NULL,
  `maritalStatus` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `children` int DEFAULT NULL,
  `livingEnvironment` varchar(255) DEFAULT NULL,
  `expectations` varchar(255) DEFAULT NULL,
  `additionalInfo` varchar(255) DEFAULT NULL,
  `user_delete` int NOT NULL DEFAULT '0' COMMENT ' 1 = user delete',
  `org_delete` int NOT NULL DEFAULT '0' COMMENT ' 1 = organization delete'
);

CREATE TABLE `blog_comment` (
  `post_id` int NOT NULL,
  `viewer_acc_name` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `comment` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `comment_date` date NOT NULL
);

CREATE TABLE `blog_likes` (
  `post_id` int NOT NULL,
  `likes` int DEFAULT '0'
);

CREATE TABLE `blog_post` (
  `post_id` int NOT NULL,
  `acc_id` int NOT NULL,
  `post_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `post_content` text COLLATE utf8mb4_general_ci NOT NULL,
  `post_category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `post_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `published` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
);

CREATE TABLE `chats` (
  `chat_id` int NOT NULL,
  `outgoing_msg_id` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `incoming_msg_id` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `msg` text COLLATE utf8mb4_general_ci,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint NOT NULL DEFAULT '0'
);

CREATE TABLE `contact_message` (
  `msg_id` int NOT NULL,
  `sender_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sender_email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sender_contact` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `sender_id` int NOT NULL,
  `msg_content` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sending_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_registerd` int NOT NULL
);

CREATE TABLE `donations` (
  `donation_id` int NOT NULL,
  `donor_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `receiver_orphan_id` int DEFAULT NULL,
  `receiver_type` varchar(20) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `donor_email` varchar(100) NOT NULL,
  `card_no` varchar(20) DEFAULT NULL,
  `card_cvc` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `card_exp_month` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `card_exp_year` varchar(255) DEFAULT NULL,
  `bkash_no` varchar(15) DEFAULT NULL,
  `Bkash_trans` varchar(20) DEFAULT NULL,
  `amount` float NOT NULL,
  `receiving_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE `donations_orphan` (
  `orphan_id` int NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL
);


CREATE TABLE `like_handle` (
  `post_id` int NOT NULL,
  `viewer_acc_id` int NOT NULL
);


CREATE TABLE `local_orphan_guardian` (
  `guardian_id` int NOT NULL,
  `guardian_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guardian_contact` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guardian_location` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL
);


CREATE TABLE `notifications` (
  `notification_id` int NOT NULL,
  `user_id` int NOT NULL DEFAULT '0',
  `org_id` int DEFAULT '0',
  `orphan_id` int DEFAULT '0',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = unseen, 1 = seen',
  `content` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` float(5,2) DEFAULT '0.00',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE `orphan_list` (
  `orphan_id` int NOT NULL,
  `org_id` int DEFAULT NULL,
  `guardian_id` int DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `since` varchar(255) DEFAULT NULL,
  `family_status` varchar(255) DEFAULT NULL,
  `physical_condition` varchar(255) DEFAULT NULL,
  `education_level` varchar(255) DEFAULT NULL,
  `medical_history` varchar(255) DEFAULT NULL,
  `hobby` varchar(255) DEFAULT NULL,
  `favorite_food` varchar(255) DEFAULT NULL,
  `favorite_game` varchar(255) DEFAULT NULL,
  `skills` text,
  `dreams` text,
  `problems` text,
  `other_comments` text,
  `orphan_image` varchar(255) DEFAULT NULL,
  `adoption_status` int NOT NULL DEFAULT '0' COMMENT '0 = unadopted, 1 = adopted',
  `removed_status` int NOT NULL DEFAULT '0' COMMENT '1 = removed'
);


CREATE TABLE `seminars` (
  `seminar_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `seminar_date` date NOT NULL,
  `subject` varchar(255) NOT NULL,
  `guest` varchar(255) DEFAULT NULL,
  `type` enum('online','offline') NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `org_id` int NOT NULL,
  `visibility` tinyint(1) DEFAULT '0' COMMENT ' 0 = visible, 1 = invisible',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE `seminar_participants` (
  `seminar_id` int NOT NULL,
  `participant_id` int NOT NULL
);



