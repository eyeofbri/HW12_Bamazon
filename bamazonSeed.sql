CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,3),
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("220 Grit Sandpaper", "Paint", 5.69, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("60 Grit Sandpaper", "Paint", 5.69, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Random Orbital Sander", "Tools", 39.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1 gal. Semi-Gloss Interior Paint", "Paint ", 27.40, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1 qt. Satin Polycrylic Finish", "Paint", 15.60, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1 gal. Paint Thinner", "Paint", 5.99, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Painting Tape", "Tape, Glues & Epoxy", 5.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("5 ft. x 7 ft. Blue Tarp", "Tarps, Drop Cloths & Plastic Sheeting", 5.08, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Disposable Gloves (100-Count)", "Apparel & Safety", 14.97, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("200-Count Rags", "Paint", 12.98, 8);