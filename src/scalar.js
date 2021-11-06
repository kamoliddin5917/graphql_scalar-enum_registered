const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType, Kind } = require("graphql");

const isNumber = (value) => {
  if (isNaN(value)) throw new Error(`This ${value} element not number`);
  return value;
};
const isPassword = (value) => {
  if (
    !value.match(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{7,17}$/
    )
  )
    throw new Error(
      "Kamida 7 ta belgi, ko'pi bn 17 ta belgi, kotta-kichkina harf, belgi, son bo'lishi kerak!"
    );
  return value;
};
const isOdd = (value) => {
  if (value % 2 === 0) throw new Error(`This number (${value}) not odd`);
  return value;
};
const isEven = (value) => {
  if (value % 2 !== 0) throw new Error(`This number (${value}) not even`);
  return value;
};
const isEmail = (value) => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
    throw new Error(`This is not email (${value})`);
  return value;
};

const typeDefs = gql`
  scalar Number
  scalar Password
  scalar Odd
  scalar Even
  scalar Email

  type Query {
    number: Number!
    password: Password!
    odd: Odd!
    even: Even!
    email: Email!
    getNumbers(number: Number!): Number!
    getPassword(password: Password!): Password!
    getOdd(odd: Odd!): Odd!
    getEven(even: Even!): Even!
    getEmail(email: Email!): Email!
  }
`;
const resolvers = {
  Query: {
    number: () => 7,
    password: () => "Kamoliddin@07",
    odd: () => 7,
    even: () => 10,
    email: () => "k@gmail.com",
    getNumbers: (_, { number }) => number,
    getPassword: (_, { password }) => password,
    getOdd: (_, { odd }) => odd,
    getEven: (_, { even }) => even,
    getEmail: (_, { email }) => email,
  },
  Number: new GraphQLScalarType({
    name: "Number",
    description: "Is number ?",
    serialize: isNumber,
    parseValue: isNumber,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return isNumber(Number(ast.value));
      }
      throw new Error(`This not Number (${ast.value})`);
    },
  }),
  Password: new GraphQLScalarType({
    name: "Password",
    description: "This is Password ?",
    serialize: isPassword,
    parseValue: isPassword,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return isPassword(ast.value);
      }
      throw new Error(`Invalid values (${ast.value})`);
    },
  }),
  Odd: new GraphQLScalarType({
    name: "Odd",
    description: "This is odd number?",
    serialize: isOdd,
    parseValue: isOdd,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return isOdd(parseInt(ast.value));
      }
      throw new Error(`This not Number (${ast.value})`);
    },
  }),
  Even: new GraphQLScalarType({
    name: "Even",
    description: "This is even number?",
    serialize: isEven,
    parseValue: isEven,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return isEven(parseInt(ast.value));
      }
      throw new Error(`This not Number (${ast.value})`);
    },
  }),
  Email: new GraphQLScalarType({
    name: "Email",
    description: "This is email ?",
    serialize: isEmail,
    parseValue: isEmail,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return isEmail(ast.value);
      }
      throw new Error(`Invalid values (${ast.value})`);
    },
  }),
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(777, () => console.log(`Server has been started on port: 777`));
