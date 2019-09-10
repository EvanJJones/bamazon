const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

const dbConfig = {
  host: 'localhost', // use 'localhost' for your local mysql server
  port: 3306, // Your port; if not 3306
  user: 'root', // Your username
  password: '', // Your password
  database: 'bamazon',
};

const questions = [
  {
    name: 'item',
    type: 'input',
    message: 'What is the ID of the item you would like to purchase?',
  },
  {
    name: 'quantity',
    type: 'input',
    message: 'How many would you like to purchase?',
    validate(value) {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    },
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
  // getting entire table
  const [results] = await connection.query('SELECT * FROM products');

  // displays the list of current inventory
  createList(results);
  // inquirer prompt, asks id of product to buy and quantity to buy
  const answers = await inquirer.prompt(questions);

  const selected = products.find((id) => id.id == answers.item);

  if (selected.quantity >= answers.quantity) {
    await connection.query('UPDATE products SET ? WHERE ?', [
      {
        quantity: selected.quantity - answers.quantity,
      },
      {
        id: selected.id,
      },
    ]);
    const totalCost = answers.quantity * selected.price;
    console.log(`Your total cost is $${totalCost}`);
  } else {
    console.log("I'm sorry we don't have enough in stock");
  }

  connection.end();
}

start();
