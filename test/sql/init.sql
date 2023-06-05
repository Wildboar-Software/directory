CREATE DATABASE directory_us;
CREATE DATABASE directory_gb;
CREATE USER 'us_user' IDENTIFIED BY 'asdf_us';
CREATE USER 'gb_user' IDENTIFIED BY 'asdf_gb';
GRANT ALL PRIVILEGES ON directory_us.* TO 'us_user';
GRANT ALL PRIVILEGES ON directory_gb.* TO 'gb_user';
