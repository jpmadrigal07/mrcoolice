export const products = [{
    _id: "60d148acf968365f58f7851e",
    iceType: "tube",
    weight: 500,
    scaleType: "kg",
    cost: 60,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14aa2f968365f58f78520",
    iceType: "tube",
    weight: 30,
    scaleType: "kg",
    cost: 60,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14aa2f968365f58f78521",
    iceType: "crushed",
    weight: 30,
    scaleType: "kg",
    cost: 300,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14aa2f968365f58f78522",
    iceType: "crushed",
    weight: 30,
    scaleType: "kg",
    cost: 300,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14aa2f968365f58f78523",
    iceType: "crushed",
    weight: 30,
    scaleType: "kg",
    cost: 300,
    createdAt: "2021-06-22T02:19:24.433+00:00"
}]

export const sales = [{
    _id: "60d148acf968365f58f7851e",
    userId: {
        _id: "60cca627e1f4303bc02221ed",
        firstName: "Patrick",
        lastName: "Madrigal"
    },
    customerId: {
        _id: "60d1488cf968365f58f7851d",
        description: "Sample Kylle",
    },
    productId: {
        _id: "60d148acf968365f58f7851e",
        iceType: "tube",
        weight: 500,
        scaleType: "kg",
        cost: 60,
    },
    receiptNumber: 25632,
    birNumber: 45263,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14ab2f968365f58f78521",
    userId: {
        _id: "60cca627e1f4303bc02221ed",
        firstName: "Patrick",
        lastName: "Madrigal"
    },
    customerId: {
        _id: "603439a7cdb5bef719e9c8d5",
        description: "Jojo Senti",
    },
    productId: {
        _id: "60d148acf968365f58f7851e",
        iceType: "tube",
        weight: 500,
        scaleType: "kg",
        cost: 60,
    },
    receiptNumber: 15673,
    birNumber: 45263,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d14ab2f968365f58f78522",
    userId: {
        _id: "60cca627e1f4303bc02221ed",
        firstName: "Patrick",
        lastName: "Madrigal"
    },
    customerId: {
        _id: "60d1488cf968365f58f7851d",
        description: "Sample Kylle",
    },
    productId: {
        _id: "60d14aa2f968365f58f78520",
        iceType: "crushed",
        weight: 30,
        scaleType: "kg",
        cost: 300
    },
    receiptNumber: 25632,
    birNumber: 45263,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d3cde81bacfd4dcc3d5efe",
    userId: {
        _id: "60cca627e1f4303bc02221ed",
        firstName: "Patrick",
        lastName: "Madrigal"
    },
    customerId: {
        _id: "603439a7cdb5bef719e9c8d5",
        description: "Jojo Senti",
    },
    productId: {
        _id: "60d14aa2f968365f58f78520",
        iceType: "crushed",
        weight: 30,
        scaleType: "kg",
        cost: 300
    },
    receiptNumber: 15673,
    birNumber: 45263,
    createdAt: "2021-06-22T02:19:24.433+00:00"
}]

export const expenses = [{
    _id: "60d3c3eb1bacfd4dcc3d5efb",
    name: "Shoot",
    cost: 60,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d3c3eb1bacfd4dcc3d5efd",
    name: "Salary",
    cost: 600,
    createdAt: "2021-06-22T02:19:24.433+00:00"
},{
    _id: "60d3c3eb1bacfd4dcc3d5efi",
    name: "Transpo",
    cost: 6232,
    createdAt: "2021-06-22T02:19:24.433+00:00"
}]