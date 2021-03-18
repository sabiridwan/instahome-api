
## Getting Started
1. install node package
    npm install 
    # or
    yarn install

2. open terminal 1 to build project

    npm run-script build:dev
    # or
    yarn build:dev

3. open terminal 2 to start project

    npm run-script start:dev
    # or

    yarn start:dev

4. open app on your browser for graphql test

    http://localhost:8090/graphql



# test graphql queries
query FindCustomer{
  findCustomer(customer:{customerId:"default"}){
    _id
    customerId
    name
    createdAt
    updatedAt
  }
}


query FindPriceRules{
  findPriceRules{
    _id
    description
    adType
    customerId
    buyQuantity
    getQuantity
    percentage
    type
  }
}


query FindAds{
  findAds{
    id
    name
    price
    rules{
      description
    }
  }
}