const { ApolloServer, gql } = require("apollo-server");
const oldProducts = [
  {
    product_id: 1,
    product_name: "olma",
    product_price: 20,
    product_count: 100,
  },
  {
    product_id: 2,
    product_name: "Behi",
    product_price: 20,
    product_count: 100,
  },
];
const nowProducts = [
  {
    product_id: 1,
    product_name: "shaftoli",
    product_price: 70,
    product_count: 100,
  },
  {
    product_id: 2,
    product_name: "anor",
    product_price: 70,
    product_count: 100,
  },
];
const newProducts = [
  { product_id: 1, product_name: "nok", product_price: 50, product_count: 100 },
  {
    product_id: 2,
    product_name: "O'rik",
    product_price: 50,
    product_count: 100,
  },
];
const typeDefs = gql`
  enum Products {
    OLD
    NOW
    NEW
  }
  type Query {
    getProducts(products: Products!): [Product!]!
  }
  type Product {
    id: Int!
    name: String!
    price: Int!
    count: Int!
  }
  type Mutation {
    createProduct(
      products: Products!
      name: String!
      price: Int!
      count: Int!
    ): Product!
    updateProduct(
      products: Products!
      id: Int!
      name: String
      price: Int
      count: Int
    ): Product!
    deleteProduct(products: Products!, id: Int!): Product!
  }
`;
const resolvers = {
  Products: {
    OLD: "oldProducts",
    NOW: "nowProducts",
    NEW: "newProducts",
  },
  Query: {
    getProducts: (_, { products }) => {
      if (products === "oldProducts") {
        return oldProducts;
      } else if (products === "nowProducts") {
        return nowProducts;
      } else if (products === "newProducts") {
        return newProducts;
      }
    },
  },
  Product: {
    id: ({ product_id }) => product_id,
    name: ({ product_name }) => product_name,
    price: ({ product_price }) => product_price,
    count: ({ product_count }) => product_count,
  },
  Mutation: {
    createProduct: (_, { products, name, price, count }) => {
      if (products === "oldProducts") {
        const newProduct = {
          product_id: oldProducts.length
            ? Number(oldProducts[oldProducts.length - 1].product_id) + 1
            : 1,
          product_name: name,
          product_price: price,
          product_count: count,
        };
        oldProducts.push(newProduct);
        return newProduct;
      } else if (products === "nowProducts") {
        const newProduct = {
          product_id: nowProducts.length
            ? Number(nowProducts[nowProducts.length - 1].product_id) + 1
            : 1,
          product_name: name,
          product_price: price,
          product_count: count,
        };
        nowProducts.push(newProduct);
        return newProduct;
      } else if (products === "newProducts") {
        const newProduct = {
          product_id: newProducts.length
            ? Number(newProducts[newProducts.length - 1].product_id) + 1
            : 1,
          product_name: name,
          product_price: price,
          product_count: count,
        };
        newProducts.push(newProduct);
        return newProduct;
      }
    },
    updateProduct: (_, { products, id, name, price, count }) => {
      if (products === "oldProducts") {
        const findProduct = oldProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          findProduct.product_name = name || findProduct.product_name;
          findProduct.product_price = price || findProduct.product_price;
          findProduct.product_count = count || findProduct.product_count;

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      } else if (products === "nowProducts") {
        const findProduct = nowProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          findProduct.product_name = name || findProduct.product_name;
          findProduct.product_price = price || findProduct.product_price;
          findProduct.product_count = count || findProduct.product_count;

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      } else if (products === "newProducts") {
        const findProduct = newProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          findProduct.product_name = name || findProduct.product_name;
          findProduct.product_price = price || findProduct.product_price;
          findProduct.product_count = count || findProduct.product_count;

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      }
    },
    deleteProduct: (_, { products, id }) => {
      if (products === "oldProducts") {
        const findProduct = oldProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          oldProducts.splice(oldProducts.indexOf(findProduct), 1);

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      } else if (products === "nowProducts") {
        const findProduct = nowProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          nowProducts.splice(nowProducts.indexOf(findProduct), 1);

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      } else if (products === "newProducts") {
        const findProduct = newProducts.find(
          (product) => product.product_id == id
        );
        if (findProduct) {
          newProducts.splice(newProducts.indexOf(findProduct), 1);

          return findProduct;
        } else {
          throw new Error(`There is not this id (${id}) product`);
        }
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then((u) => console.log(u.url));
