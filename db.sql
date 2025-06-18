CREATE OR REPLACE DATABASE m4;
USE m4;
CREATE TABLE ACCOUNT (
    username VARCHAR(50) PRIMARY KEY,
    NAME VARCHAR(50),
    PASSWORD VARCHAR(255) NOT NULL
);
INSERT INTO ACCOUNT (username, NAME, PASSWORD)
VALUES ('admin', 'admin', '123');
CREATE TABLE folder (
    id_folder INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(100),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES ACCOUNT(username)
);
INSERT INTO folder (judul, username) VALUES ('Folder Default', 'admin');
CREATE TABLE detail (
    id_catatan INT AUTO_INCREMENT PRIMARY KEY,
    id_folder INT,
    judul VARCHAR(100),
    catatan TEXT,
    akses VARCHAR(10) DEFAULT 'public',
    tanggal_ditambahkan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_folder) REFERENCES folder(id_folder)
);
INSERT INTO detail (id_folder, judul, catatan, akses) VALUES
(1, 'Tips Belajar', 'Belajar itu menyenangkan lo', 'public'),
(1, 'Catatan Harian', 'Hari ini aku tewas', 'public'),
(1, 'Motivasi Pagi', 'Bangun pagi aduduh', 'public'),
(1, 'Proyek A', 'Update terbarui', 'public'),
(1, 'Rangkuman Materi', 'Materi kuliah saya', 'public');
CREATE TABLE ADMIN (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL
);
INSERT INTO ADMIN (username, PASSWORD)
VALUES ('admin', '123');
ALTER TABLE ACCOUNT
ADD tanggal_lahir DATE AFTER NAME,
ADD email VARCHAR(100) AFTER tanggal_lahir,
ADD alamat TEXT AFTER email,
ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER PASSWORD;
CREATE TABLE group_folder (
    id_group_folder INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(100),
    owner_username VARCHAR(50),
    FOREIGN KEY (owner_username) REFERENCES ACCOUNT(username)
);
CREATE TABLE group_member (
    id_group_folder INT,
    username VARCHAR(50),
    FOREIGN KEY (id_group_folder) REFERENCES group_folder(id_group_folder),
    FOREIGN KEY (username) REFERENCES ACCOUNT(username),
    PRIMARY KEY (id_group_folder, username)
);
CREATE TABLE group_note (
    id_group_note INT AUTO_INCREMENT PRIMARY KEY,
    id_group_folder INT,
    username VARCHAR(50),
    judul VARCHAR(100),
    catatan TEXT,
    tanggal_ditambahkan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_group_folder) REFERENCES group_folder(id_group_folder),
    FOREIGN KEY (username) REFERENCES ACCOUNT(username)
);
CREATE TABLE group_note_mentions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_group_note INT,
  username_mentioned VARCHAR(100),
  FOREIGN KEY (id_group_note) REFERENCES group_note(id_group_note),
  FOREIGN KEY (username_mentioned) REFERENCES ACCOUNT(username)
);