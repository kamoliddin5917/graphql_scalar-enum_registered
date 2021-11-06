const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType, Kind } = require("graphql");

const path = require("path");

const IO = require("./utils/io");
const jwt = require("./utils/jwt");

const io = new IO(path.join(__dirname, "../database", "users.json"));

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
const isEmail = (value) => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
    throw new Error(`This is not email (${value})`);
  return value;
};

const typeDefs = gql`
  scalar Password
  scalar Email
  scalar Token

  type Query {
    getUser: [User]!
  }
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  type Token {
    token: String
  }
  type Mutation {
    registeredUser(
      firstName: String!
      lastName: String!
      email: Email!
      password: Password!
    ): Token!
    loginUser(email: Email!, password: Password!): Token!
    deleteAcount(token: String!): String!
    updateUser(token: String!, firstName: String, lastName: String, password: Password): User!
  }
`;
const resolvers = {
  Query: {
  getUser:()=>{
    return io.read()
  }
  },
  Mutation: {
    registeredUser: (_, { firstName, lastName, email, password }) => {
      const users = io.read();
      const findUser = users.find((user) => user.email === email);
      if (findUser) throw new Error(`Bazada bu email {${email}} bor!`);
      const id = users.length ? Number(users[users.length - 1].id) + 1 : 1;
      const newUser = {
        id,
        firstName,
        lastName,
        email,
        password,
      };

      io.write([...users, newUser]);
      const token = jwt.sign({ userId: id });
      return { token };
    },
    loginUser: (_, { email, password }) => {
      const users = io.read();
      const findUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (!findUser) throw new Error(`Invalid values!`);
      const token = jwt.sign({ userId: findUser.id });
      return { token };
    },
    deleteAcount: (_,{ token }) => {
      try {
        const {userId} = jwt.verify(token)
        const users = io.read()
        const newUsers = users.filter(user => user.id !== userId)
        io.write(newUsers)
        return "Deleted user!"
      } catch (error) {
        console.log(error);
        throw new Error("Invalid value")
      }
    },
    updateUser: (_,{ token, firstName, lastName, password }) => {
      try {
        const { userId } = jwt.verify(token)
        const users = io.read()
        const findUser = users.find(user => user.id === userId)
        if(!findUser) throw new Error({status: 500, message: "Not found!"})

        findUser.firstName = firstName ||  findUser.firstName
        findUser.lastName = lastName ||  findUser.lastName
        findUser.password = password ||  findUser.password
        
        io.write(users)
        return findUser
      } catch (error) {
        console.log(error);
        throw new Error("Invalid values!")
      }
    }
  },
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

server.listen().then(({ url }) => console.log(url));
