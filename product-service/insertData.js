const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const products = [
  {
    id: "001",
    title: "The Alchemist's Secret",
    author: "Scott Mariani",
    description: "A thriller novel that follows ex-SAS soldier Ben Hope as he tries to uncover the truth behind a mysterious alchemist's manuscript.",
    price: 10.99
  },
  {
    id: "002",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "A dystopian novel set in a post-apocalyptic North America, where teenagers from each of the twelve districts are forced to compete in the Hunger Games, a televised fight to the death.",
    price: 8.99
  },
  {
    id: "003",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller that follows psychotherapist Theo Faber as he tries to unravel the mystery behind his patient Alicia Berenson, who has refused to speak since she was accused of murdering her husband.",
    price: 14.99
  },
  {
    id: "004",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "A novel that explores the themes of redemption, betrayal, and the complexities of family and friendship in war-torn Afghanistan.",
    price: 11.99
  },
  {
    id: "005",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel that portrays a totalitarian society controlled by a single party, led by a figure known as Big Brother, and the protagonist's rebellion against it.",
    price: 9.99
  },
  {
    id: "006",
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    description: "A psychological thriller that follows Rachel Watson, an alcoholic divorcee who becomes entangled in a missing persons investigation after witnessing something suspicious on her daily train commute.",
    price: 12.99
  },
  {
    id: "007",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    description: "A novel that explores the themes of hedonism, corruption, and the consequences of vanity and beauty in the story of a young man who becomes obsessed with his own portrait.",
    price: 10.99
  },
  {
    id: "008",
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel that explores the themes of freedom, individuality, and the dangers of technology and social conditioning in a future society that has achieved stability at the expense of creativity and critical thinking.",
    price: 8.99
  },
  {
    id: "009",
    title: "The God of Small Things",
    author: "Arundhati Roy",
    description: "A novel that explores the themes of love, loss, and the complexities of family relationships in post-colonial India.",
    price: 11.99
  }
];

const stocks = [
  {
    product_id: products[0].id,
    count: 2,
  },
  {
    product_id: products[1].id,
    count: 5,
  },
  {
    product_id: products[2].id,
    count: 3,
  },
  {
    product_id: products[3].id,
    count: 4,
  },
  {
    product_id: products[4].id,
    count: 7,
  },
  {
    product_id: products[5].id,
    count: 1,
  },  {
    product_id: products[6].id,
    count: 3,
  },
  {
    product_id: products[7].id,
    count: 6,
  },
  {
    product_id: products[8].id,
    count: 2,
  },
];

const paramsProducts = {
  TableName: 'products',
  Item: null,
};

const paramsStocks = {
  TableName: 'stocks',
  Item: null,
};

products.forEach((product) => {
  paramsProducts.Item = product;
  dynamoDB.put(paramsProducts, (err) => {
    if (err) {
      console.error(`Unable to add product ${product.title}`, err);
    } else {
      console.log(`Product ${product.title} added to the table!`);
    }
  });
});

stocks.forEach((stock) => {
  paramsStocks.Item = stock;
  dynamoDB.put(paramsStocks, (err) => {
    if (err) {
      console.error(`Unable to add stock for product ${stock.product_id}`, err);
    } else {
      console.log(`Stock for product ${stock.product_id} added to the table!`);
    }
  });
});
