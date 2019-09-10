DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (item_name, department_name, price, quantity)
VALUES ("Cat", "pets", 100, 10), ("Dog", "pets", 100, 5), ("Cat Food", "pets", 2.5, 3), ("Dog Food", "pets", 2.5, 4), ("Hat", "Clothing", 15, 50), ("Shirt", "Clothing", 10, 100), ("Headphones", "Electronics", 70, 80), ("Mouse", "Electronics", 30, 200), ("Mouse", "pets", 3, 500), ("Mouse Food", "pets", 1, 1000);