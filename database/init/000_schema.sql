CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE directory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent INTEGER,
    FOREIGN KEY(parent) REFERENCES directory(id)
);

CREATE TABLE file (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    directory INTEGER NOT NULL,
    FOREIGN KEY(directory) REFERENCES directory(id)
);

CREATE TABLE drive (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    root INTEGER NOT NULL,
    owner INTEGER NOT NULL,
    FOREIGN KEY(owner) REFERENCES account(id),
    FOREIGN KEY(root) REFERENCES directory(id)
);
