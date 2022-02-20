CREATE TABLE IF NOT EXISTS messages(
  id SERIAL,
  created_at TIMESTAMP,
  username VARCHAR(255),
  content VARCHAR(255)
);