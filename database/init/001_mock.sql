INSERT INTO account (name) VALUES ('schiffer');

INSERT INTO directory (name, parent) VALUES ('root', NULL);
INSERT INTO drive (name, root, owner) VALUES ('home', 1, 1);
INSERT INTO file (name, directory) VALUES ('README.md', 1);
