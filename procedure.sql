DELIMITER $$
CREATE OR REPLACE PROCEDURE getPublicNotes()
BEGIN
    SELECT * FROM detail WHERE akses = 'public' ORDER BY id_catatan ASC;
END $$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE PROCEDURE getPublicTitles()
BEGIN
    SELECT judul FROM detail WHERE akses = 'public' ORDER BY id_catatan ASC;
END $$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE PROCEDURE getDetailsByFolderId(IN p_folder_id INT)
BEGIN
    SELECT * FROM detail WHERE folder_id = p_folder_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE OR REPLACE PROCEDURE getNoteDetail(IN p_judul VARCHAR(255))
BEGIN
    SELECT * FROM detail WHERE judul = p_judul LIMIT 1;
END $$
DELIMITER ;


DELIMITER $$
CREATE OR REPLACE PROCEDURE updateNote(
    IN p_judul VARCHAR(255),
    IN p_catatan TEXT
)
BEGIN
    UPDATE detail SET catatan = p_catatan WHERE judul = p_judul;
    SELECT ROW_COUNT() AS affected;
END $$
DELIMITER ;


DELIMITER $$
CREATE OR REPLACE PROCEDURE deleteNote(
    IN p_judul VARCHAR(255)
)
BEGIN
    DELETE FROM detail WHERE judul = p_judul;
    SELECT ROW_COUNT() AS affected;
END $$
DELIMITER ;


-- addFolder
DELIMITER $$
CREATE OR REPLACE PROCEDURE addFolder(
    IN p_judul VARCHAR(255),
    IN p_username VARCHAR(255)
)
BEGIN
    IF EXISTS (SELECT * FROM folder WHERE username = p_username AND judul = p_judul) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Folder dengan judul yang sama sudah ada';
    END IF;

    INSERT INTO folder (judul, username) VALUES (p_judul, p_username);
END $$
DELIMITER ;

-- getFoldersByUsername
DELIMITER $$
CREATE OR REPLACE PROCEDURE getFoldersByUsername(
    IN p_username VARCHAR(255)
)
BEGIN
    SELECT * FROM folder WHERE username = p_username;
END $$
DELIMITER ;

-- viewFolder
DELIMITER $$
CREATE OR REPLACE PROCEDURE viewFolder(
    IN p_username VARCHAR(255)
)
BEGIN
    SELECT id_folder, judul FROM folder WHERE username = p_username;
END $$
DELIMITER ;

-- deleteFolder
DELIMITER $$
CREATE OR REPLACE PROCEDURE deleteFolder(
    IN p_id_folder INT
)
BEGIN
    DELETE FROM folder WHERE id_folder = p_id_folder;
END $$
DELIMITER ;

-- updateFolder
DELIMITER $$
CREATE OR REPLACE PROCEDURE updateFolder(
    IN p_id_folder INT,
    IN p_judul VARCHAR(255),
    IN p_username VARCHAR(255)
)
BEGIN
    UPDATE folder SET judul = p_judul, username = p_username WHERE id_folder = p_id_folder;
END $$
DELIMITER ;

-- getJumlahDetailByFolder
DELIMITER $$
CREATE OR REPLACE PROCEDURE getJumlahDetailByFolder(
    IN p_id_folder INT
)
BEGIN
    SELECT COUNT(*) AS jumlah FROM detail WHERE id_folder = p_id_folder;
END $$
DELIMITER ;

-- addDetail
DELIMITER $$
CREATE OR REPLACE PROCEDURE addDetail(
    IN p_id_folder INT,
    IN p_judul VARCHAR(255),
    IN p_catatan TEXT,
    IN p_akses VARCHAR(50)
)
BEGIN
    INSERT INTO detail (id_folder, judul, catatan, akses) VALUES (p_id_folder, p_judul, p_catatan, p_akses);
END $$
DELIMITER ;


DELIMITER $$

-- 1. login
CREATE OR REPLACE PROCEDURE login(IN p_username VARCHAR(255), IN p_pass VARCHAR(255))
BEGIN
    SELECT * FROM ACCOUNT WHERE username = p_username AND PASSWORD = p_pass LIMIT 1;
END $$

-- 2. getDetailsByFolder
CREATE OR REPLACE PROCEDURE getDetailsByFolder(IN p_id_folder INT)
BEGIN
    SELECT * FROM detail WHERE id_folder = p_id_folder ORDER BY tanggal_ditambahkan DESC;
END $$

-- 3. loginAdmin
CREATE OR REPLACE PROCEDURE loginAdmin(IN p_username VARCHAR(255), IN p_pass VARCHAR(255))
BEGIN
    SELECT * FROM ADMIN WHERE username = p_username AND PASSWORD = p_pass LIMIT 1;
END $$

-- 4. getAllUsers
CREATE OR REPLACE PROCEDURE getAllUsers()
BEGIN
    SELECT * FROM ACCOUNT ORDER BY username ASC;
END $$

-- 5. deleteUser
-- (karena prosesnya melibatkan beberapa operasi, disarankan menggunakan transaction dari NodeJS.  
-- Tapi jika memang ingin, dapat juga dibuat prosedur yang melakukan delete cascade, 
-- tapi disini saya menyarankan menggunakan NodeJS sesuai implementasi yang kamu punya)

-- 6. updateUser
CREATE OR REPLACE PROCEDURE updateUser(
    IN p_oldUsername VARCHAR(255),
    IN p_newUsername VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_tanggal_lahir DATE,
    IN p_email VARCHAR(255),
    IN p_alamat VARCHAR(255)
)
BEGIN
    UPDATE ACCOUNT
    SET username = p_newUsername, NAME = p_name, tanggal_lahir = p_tanggal_lahir, email = p_email, alamat = p_alamat
    WHERE username = p_oldUsername;
END $$

-- 7. getAllFolders
CREATE OR REPLACE PROCEDURE getAllFolders()
BEGIN
    SELECT * FROM folder;
END $$

-- 8. getAllNotes
CREATE OR REPLACE PROCEDURE getAllNotes()
BEGIN
    SELECT * FROM detail;
END $$

-- 9. editNote
CREATE OR REPLACE PROCEDURE editNote(
    IN p_id_catatan INT,
    IN p_judul VARCHAR(255),
    IN p_catatan TEXT,
    IN p_akses VARCHAR(50)
)
BEGIN
    UPDATE detail
    SET judul = p_judul, catatan = p_catatan, akses = p_akses
    WHERE id_catatan = p_id_catatan;
    SELECT ROW_COUNT() AS affected;
END $$

-- 10. removeNote
CREATE OR REPLACE PROCEDURE removeNote(
    IN p_id_catatan INT
)
BEGIN
    DELETE FROM detail WHERE id_catatan = p_id_catatan;
    SELECT ROW_COUNT() AS affected;
END $$

-- 11. getGroupFolders
CREATE OR REPLACE PROCEDURE getGroupFolders(IN p_username VARCHAR(255))
BEGIN
    SELECT gf.id_group_folder, gf.judul
    FROM group_folder gf
    JOIN group_member gm ON gf.id_group_folder = gm.id_group_folder
    WHERE gm.username = p_username;
END $$

-- 12. addGroupFolder
-- (Ini memang lebih cocok diberesakan di NodeJS karena 2 operasi, 
-- tapi jika memang harus, dapat menggunakan procedure. Saya menyarankan menggunakan NodeJS saja).

-- 13. checkUsername
CREATE OR REPLACE PROCEDURE checkUsername(IN p_username VARCHAR(255))
BEGIN
    SELECT * FROM ACCOUNT WHERE username = p_username LIMIT 1;
END $$

-- 14. getGroupFoldersByUser
CREATE OR REPLACE PROCEDURE getGroupFoldersByUser(IN p_username VARCHAR(255))
BEGIN
    SELECT gf.id_group_folder, gf.judul
    FROM group_folder gf
    JOIN group_member gm ON gf.id_group_folder = gm.id_group_folder
    WHERE gm.username = p_username;
END $$

DELIMITER ;



-- 2. getGroupNotes
DELIMITER $$
CREATE OR REPLACE PROCEDURE getGroupNotes(IN p_id_group_folder INT)
BEGIN
    SELECT * FROM group_note WHERE id_group_folder = p_id_group_folder ORDER BY tanggal_ditambahkan DESC;
END $$
DELIMITER ;

DELIMITER $$
-- 3. deleteGroupNote
CREATE OR REPLACE PROCEDURE deleteGroupNote(IN p_id_group_note INT)
BEGIN
    DELETE FROM group_note WHERE id_group_note = p_id_group_note;
    SELECT ROW_COUNT() AS affected;
END $$

DELIMITER ;

DELIMITER $$

-- 1. getGroupNoteDetail
-- (Saya menyarankan lebih baik menggunakan Node.js saja, karena prosesnya simple)

-- 2. updateGroupNote
CREATE OR REPLACE PROCEDURE updateGroupNote(
    IN p_id_group_note INT,
    IN p_catatan TEXT
)
BEGIN
    UPDATE group_note SET catatan = p_catatan WHERE id_group_note = p_id_group_note;
    SELECT ROW_COUNT() AS affected;
END $$

-- 3. addMention
-- (Saya menyarankan lebih baik menggunakan Node.js saja, karena prosesnya simple dan jarang digunakan secara massal)

-- 4. getMentionCountsByFolder
CREATE OR REPLACE PROCEDURE getMentionCountsByFolder(IN p_username VARCHAR(255))
BEGIN
    SELECT gf.id_group_folder, COUNT(gm.id) AS jumlah
    FROM group_note_mentions gm
    JOIN group_note gn ON gm.id_group_note = gn.id_group_note
    JOIN group_folder gf ON gn.id_group_folder = gf.id_group_folder
    WHERE gm.username_mentioned = p_username
    GROUP BY gf.id_group_folder;
END $$

-- 5. getMentionCountsByNote
CREATE OR REPLACE PROCEDURE getMentionCountsByNote(IN p_username VARCHAR(255))
BEGIN
    SELECT id_group_note, COUNT(*) AS jumlah
    FROM group_note_mentions
    WHERE username_mentioned = p_username
    GROUP BY id_group_note;
END $$

-- 6. getAllGroupFolders
-- (Saya menyarankan lebih baik menggunakan Node.js saja, prosesnya simple)

-- 7. updateGroupFolder
CREATE OR REPLACE PROCEDURE updateGroupFolder(
    IN p_id_group_folder INT,
    IN p_judul VARCHAR(255),
    IN p_ownerUsername VARCHAR(255)
)
BEGIN
    UPDATE group_folder SET judul = p_judul, owner_username = p_ownerUsername WHERE id_group_folder = p_id_group_folder;
    SELECT ROW_COUNT() AS affected;
END $$

-- 8. deleteGroupFolder
-- (Saya menyarankan lebih baik menggunakan Node.js, karena melibatkan transaction)

-- 9. getAllGroupNotes
-- (Saya menyarankan lebih baik menggunakan Node.js saja)

-- 10. editGroupNote
CREATE OR REPLACE PROCEDURE editGroupNote(
    IN p_id_group_note INT,
    IN p_judul VARCHAR(255),
    IN p_catatan TEXT,
    IN p_username VARCHAR(255)
)
BEGIN
    UPDATE group_note SET judul = p_judul, catatan = p_catatan, username = p_username WHERE id_group_note = p_id_group_note;
    SELECT ROW_COUNT() AS affected;
END $$

-- 11. removeGroupNote
-- (Saya menyarankan lebih baik menggunakan Node.js saja)

DELIMITER ;
DELIMITER $$
CREATE OR REPLACE PROCEDURE register_account(
  IN p_username VARCHAR(50),
  IN p_name VARCHAR(50),
  IN p_password VARCHAR(255),
  IN p_tanggal_lahir DATE,
  IN p_email VARCHAR(100),
  IN p_alamat TEXT
)
BEGIN
  DECLARE user_exists INT;
  SELECT COUNT(*) INTO user_exists FROM ACCOUNT WHERE username = p_username;

  IF user_exists > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username sudah terdaftar.';
  ELSE
    INSERT INTO ACCOUNT (username, NAME, PASSWORD, tanggal_lahir, email, alamat)
    VALUES (p_username, p_name, p_password, p_tanggal_lahir, p_email, p_alamat);
  END IF;
END $$
DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE delete_user(IN user_name VARCHAR(100))
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE folder_id INT;
  DECLARE folder_cursor CURSOR FOR
    SELECT id_folder FROM folder WHERE username = user_name;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  START TRANSACTION;

  OPEN folder_cursor;

  read_loop: LOOP
    FETCH folder_cursor INTO folder_id;
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    DELETE FROM detail WHERE id_folder = folder_id;
  END LOOP;

  CLOSE folder_cursor;

  DELETE FROM folder WHERE username = user_name;
  DELETE FROM ACCOUNT WHERE username = user_name;

  COMMIT;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE add_group_folder (
  IN group_judul VARCHAR(255),
  IN user_name VARCHAR(100)
)
BEGIN
  DECLARE new_group_id INT;

  START TRANSACTION;

  INSERT INTO group_folder (judul, owner_username)
  VALUES (group_judul, user_name);

  SET new_group_id = LAST_INSERT_ID();

  INSERT INTO group_member (id_group_folder, username)
  VALUES (new_group_id, user_name);

  COMMIT;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE add_member_to_group (
  IN group_id INT,
  IN user_name VARCHAR(100)
)
BEGIN
  DECLARE existing_count INT;

  SELECT COUNT(*) INTO existing_count
  FROM group_member
  WHERE id_group_folder = group_id AND username = user_name;

  IF existing_count > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'User sudah ada dalam grup ini';
  ELSE
    INSERT INTO group_member (id_group_folder, username)
    VALUES (group_id, user_name);
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE OR REPLACE PROCEDURE add_group_note (
  IN group_id INT,
  IN user_name VARCHAR(100),
  IN note_title VARCHAR(255),
  IN note_content TEXT
)
BEGIN
  INSERT INTO group_note (id_group_folder, username, judul, catatan)
  VALUES (group_id, user_name, note_title, note_content);
  
  SELECT LAST_INSERT_ID() AS id_group_note;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE get_group_note_detail (
  IN note_id INT
)
BEGIN
  SELECT * FROM group_note WHERE id_group_note = note_id;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE add_mention (
  IN note_id INT,
  IN mentioned_user VARCHAR(100)
)
BEGIN
  INSERT INTO group_note_mentions (id_group_note, username_mentioned)
  VALUES (note_id, mentioned_user);
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE get_all_group_folders()
BEGIN
  SELECT * FROM group_folder;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE delete_group_folder (
  IN group_id INT
)
BEGIN
  START TRANSACTION;

  DELETE FROM group_member WHERE id_group_folder = group_id;
  DELETE FROM group_folder WHERE id_group_folder = group_id;

  COMMIT;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE get_all_group_notes()
BEGIN
  SELECT * FROM group_note;
END //

DELIMITER ;


DELIMITER //

CREATE OR REPLACE PROCEDURE remove_group_note (
  IN note_id INT
)
BEGIN
  DELETE FROM group_note WHERE id_group_note = note_id;
  SELECT ROW_COUNT() AS affected_rows;
END //

DELIMITER ;


