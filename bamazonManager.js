/* eslint-disable no-case-declarations */
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const dbConfig = {
  host: 'localhost', // use 'localhost' for your local mysql server
  port: 3306, // Your port; if not 3306
  user: 'root', // Your username
  password: '', // Your password
  database: 'bamazon',
};

const menuArray = [
  'View Products for Sale',
  'View Low Inventory',
  'Add to Inventory',
  'Add New Product',
];

const mainMenu = {
  name: 'choice',
  type: 'rawlist',
  choices: menuArray,
};

const addQuantity = [
  {
    name: 'item',
    type: 'input',
    message: 'What is the ID of the item you would like to add inventory of?',
  },
  {
    name: 'quantity',
    type: 'input',
    message: 'How many would you like to add to the inventory?',
    validate(value) {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    },
  },
];

const newProduct = [
  {
    name: 'item_name',
    type: 'input',
    message: 'What is the name of the item you would like to add to the inventory?',
  },
  {
    name: 'department',
    type: 'input',
    message: 'What is the department of the item you would like to add to the inventory?',
  },
  {
    name: 'price',
    type: 'input',
    message: 'What is the price of the item you would like to add to the inventory?',
  },
  {
    name: 'quantity',
    type: 'input',
    message: 'What is the quantity of the item you would like to add to the inventory?',
  },
];
const products = [];

function createList(results) {
  results.forEach((display) => {
    const item = {};
    item.item_name = display.item_name;
    item.department_name = display.department_name;
    item.price = display.price;
    item.quantity = display.quantity;
    item.id = display.id;
    products.push(item);

    console.log(`
Name: ${display.item_name}
Department: ${display.department_name}
Price: ${display.price}
Quantity: ${display.quantity}
id: ${display.id}`);
  });
}

async function start() {
  // gettting sql connection
  const connection = await mysql.createConnection(dbConfig);

  // main menu options
  const menuChoice = await inquirer.prompt(mainMenu);
  let results = [];

  switch (menuChoice.choice) {
    case 'View Products for Sale':
      [results] = await connection.query('SELECT * FROM products');
      createList(results);
      break;

    case 'View Low Inventory':
      [results] = await connection.query('SELECT * FROM products WHERE quantity < 5');
      createList(results);
      break;

    case 'Add to Inventory':
      [results] = await connection.query('SELECT * FROM products');
      createList(results);
      const answers = await inquirer.prompt(addQuantity);

      const answerInt = parseInt(answers.quantity, 10);
      const selected = products.find((id) => id.id == answers.item);
      await connection.query('UPDATE products SET ? WHERE ?', [
        {
          quantity: selected.quantity + answerInt,
        },
        {
          id: selected.id,
        },
      ]);
      console.log(selected.quantity + answerInt);
      break;

    // add a new product
    case 'Add New Product':
      const addition = await inquirer.prompt(newProduct);
      await connection.query('INSERT INTO products SET ?', {
        item_name: addition.item_name,
        department_name: addition.department,
        price: addition.price,
        quantity: addition.quantity,
      });

      [results] = await connection.query('SELECT * FROM products');
      createList(results);
      break;
    default:
      console.log('Sorry there was an error');
      break;
  }

  connection.end();
}

start();
