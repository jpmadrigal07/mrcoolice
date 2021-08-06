import React, { useEffect, useState } from "react";
import { Loader, Grid, Col, Row } from "rsuite";
import uniqBy from "lodash/uniqBy";
import { graphqlUrl } from "../../services/constants";
import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { triggerTopAlert } from "../../actions/topAlertActions";
import moment from "moment";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import "./Reports.css";

const ReportsList2 = (props) => {
  const token = Cookies.get("sessionToken");
  const [isLoading, setIsLoading] = useState(true);
  const [tableSales, setTableSales] = useState([]);
  const [totalResult, setTotalResult] = useState([]);
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalKiloGram, setTotalKiloGram] = useState([]);
  const [totalKiloGrandTotal, setTotalKiloGrandTotal] = useState([]);
  const [autheticatedUserFullName, setAutheticatedUserFullName] =
    useState(null);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [cashes, setCashes] = useState([]);
  const [credits, setCredits] = useState([]);
  const [cashOnHandTotal, setCashOnHandTotal] = useState(0);
  const [creditPaymentTotal, setCreditPaymentTotal] = useState(0);
  const [creditBorrowTotal, setCreditBorrowTotal] = useState(0);
  const { triggerTopAlert } = props;
  const { search } = useLocation();
  const dates = search.split("&");
  const dateFrom = dates[0]?.replace("?dateFrom=", "");
  const dateTo = dates[1]?.replace("dateTo=", "");
  const inclusion = dates[2]?.replace("inclusion=", "");
  const inclusions = inclusion?.split(",");
  const isAllIncluded = inclusions?.includes("All");
  const isSalesIncluded = inclusions?.includes("Sales");
  const isExpensesIncluded = inclusions?.includes("Expenses");
  const isTotalKilogramIncluded = inclusions?.includes("Total%20Kilogram");
  const isCashBreakdownIncluded = inclusions?.includes("Cash%20Breakdown");
  const isCustomerCreditsIncluded = inclusions?.includes("Customer%20Credits");
  const isTotalSalesIncluded = inclusions?.includes("Total%20Sales");
  const dataOwner = dates[3]?.replace("dataOwner=", "");
  const isDataOwnerUser = dataOwner === "My%20Records";
  const filterSalesBy = dates[4]?.replace("filterSalesBy=", "");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      window.print();
    }, 5000);
  }, []);

  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getAutheticatedUserData = useQuery(
    "getAutheticatedUserData",
    async () => {
      const query = `{
            user(_id: "${autheticatedUserId}") {
                firstName,
                lastName
            }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getOrderList = useQuery(
    "OrderList",
    async () => {
      const query = `{
      sales {
          customerId {
              _id
              description
            },
          _id,
          productId {
            _id,
            iceType,
            weight,
            scaleType,
            cost
          },
          dayCount,
          receiptNumber,
          vehicleType,
          birNumber,
          drNumber,
          createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getCreditList = useQuery(
    "CreditList",
    async () => {
      const query = `{
      credits {
          customerId {
              _id
              description
          },
          _id,
          amount,
          isIn,
          createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getOrderList2 = useQuery(
    "OrderList2",
    async () => {
      const query = `{
      salesByUser(userId: "${autheticatedUserId}") {
          customerId {
              _id
              description
            },
          _id,
          productId {
            _id,
            iceType,
            weight,
            scaleType,
            cost
          },
          receiptNumber,
          vehicleType,
          birNumber,
          drNumber,
          createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getExpenseList = useQuery(
    "getExpenseList",
    async () => {
      const query = `{
        expenses {
            _id,
            name,
            cost,
            vendor,
            createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getExpenseList2 = useQuery(
    "getExpenseList2",
    async () => {
      const query = `{
        expenseByUser(userId: "${autheticatedUserId}") {
            _id,
            name,
            cost,
            vendor,
            createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getCashList = useQuery(
    "getCashList",
    async () => {
      const query = `{
        cashes {
            _id,
            onePeso,
            fivePeso,
            tenPeso,
            twentyPeso,
            fiftyPeso,
            oneHundredPeso,
            twoHundredPeso,
            fiveHundredPeso,
            oneThousandPeso,
            createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getCashList2 = useQuery(
    "getCashList2",
    async () => {
      const query = `{
        cashByUser(userId: "${autheticatedUserId}") {
            _id,
            onePeso,
            fivePeso,
            tenPeso,
            twentyPeso,
            fiftyPeso,
            oneHundredPeso,
            twoHundredPeso,
            fiveHundredPeso,
            oneThousandPeso,
            createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getProductList = useQuery("getProductList", async () => {
    const query = `{
        products {
            _id
            iceType,
            weight,
            scaleType,
            cost
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getCashOnHandList = useQuery(
    "cashOnHand",
    async () => {
      const query = `{
      cashOnHands {
          _id,
          amount,
          createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getCashOnHandList2 = useQuery(
    "cashOnHand2",
    async () => {
      const query = `{
      cashOnHandByUser(userId: "${autheticatedUserId}") {
          _id,
          amount,
          createdAt
        }
      }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const tableHeader1 = [
    "",
    "",
    "",
    "",
    "",
    "SALES QUANTITY",
    "",
    "SALES AMOUNT",
    "",
  ];
  const tableHeader2 = ["ITEM #", "DR", "RECEIPT #", "SALES INV", "DESC.", "PARTICULARS"];
  // Note: Add value to both fixedProduct and fixedProductText for new scale record
  const fixedProduct = [
    { iceType: "tube", weight: 50 },
    { iceType: "tube", weight: 30 },
    { iceType: "tube", weight: 25 },
    { iceType: "tube", weight: 15 },
    { iceType: "tube", weight: 5 },
    { iceType: "tube", weight: 4 },
    { iceType: "tube", weight: 2 },
    { iceType: "crushed", weight: 30 },
    { iceType: "crushed", weight: 15 },
    { iceType: "crushed", weight: 4 },
  ];
  const fixedProductText = [
    "Tube (50 kg)",
    "Tube (30 kg)",
    "Tube (25 kg)",
    "Tube (15 kg)",
    "Tube (5 kg)",
    "Tube (4 kg)",
    "Tube (2 kg)",
    "Crushed (30 kg)",
    "Crushed (15 kg)",
    "Crushed (4 kg)",
  ];

  const tableCombined = [
    ...tableHeader2,
    ...fixedProductText,
    "TOTAL",
    ...fixedProductText,
    "TOTAL AMNT",
  ];

  useEffect(() => {
    if (sales.length > 0) {
      const values = sales
        .map((item) => item.receiptNumber)
        .filter((value, index, self) => self.indexOf(value) === index);

      const chunkArr = values.map((res) => {
        const distinctSales = sales.filter(
          (res2) => res2.receiptNumber === res
        );
        return distinctSales;
      });

      const tableWithValues = chunkArr.map((res) => {
        const rowValuesFirstPart = tableHeader2.map((res2) => {
          const itemNumber = res[0]?.dayCount;
          const customer = res[0]?.customerId;
          const receiptNumber = res[0]?.receiptNumber;
          const drNumber = res[0]?.drNumber;
          const birNumber = res[0]?.birNumber;
          const vehicleType = res[0]?.vehicleType;
          if (res2 === "ITEM #") {
            return itemNumber ? itemNumber : `---`;
          } else if (res2 === "RECEIPT #") {
            return receiptNumber ? receiptNumber : `---`;
          } else if (res2 === "DR") {
            return drNumber ? drNumber : `---`;
          } else if (res2 === "SALES INV") {
            return birNumber ? birNumber : `---`;
          } else if (res2 === "DESC.") {
            return vehicleType ? vehicleType : `---`;
          } else if (res2 === "PARTICULARS") {
            return customer ? customer.description : `---`;
          } else {
            return "";
          }
        });
        const rowValuesSecondPart = fixedProduct
          .map((res3) => {
            const foundProducts = res.filter(
              (res4) =>
                res4.productId?.weight === res3?.weight &&
                res4.productId?.iceType === res3?.iceType
            );
            return foundProducts.length > 0 ? foundProducts.length : "---";
          })
          .filter((res) => res);
        const totalSecondPart = rowValuesSecondPart.reduce(function (a, b) {
          const num1 = a === "" || a === "---" ? 0 : a;
          const num2 = b === "" || b === "---" ? 0 : b;
          return num1 + num2;
        }, 0);
        const rowValuesThirdPart = fixedProduct
          .map((res5, i) => {
            const foundProducts = res.filter(
              (res6) =>
                res6.productId?.weight === res5?.weight &&
                res6.productId?.iceType === res5?.iceType
            );
            const costsValue = foundProducts
              .map((res) => res.productId?.cost)
              .filter((res2) => res2);
            const sum = costsValue.reduce(function (a, b) {
              const num1 = a === "" || a === "---" ? 0 : a;
              const num2 = b === "" || b === "---" ? 0 : b;
              return num1 + num2;
            }, 0);
            return foundProducts.length > 0 ? sum : "---";
          })
          .filter((res) => res);
        const totalThirdPart = rowValuesThirdPart.reduce(function (a, b) {
          const num1 = isNaN(a) ? 0 : a;
          const num2 = isNaN(b) ? 0 : b;
          return num1 + num2;
        }, 0);
        return [
          ...rowValuesFirstPart,
          ...rowValuesSecondPart,
          totalSecondPart,
          ...rowValuesThirdPart,
          totalThirdPart,
        ];
      });
      setTableSales(tableWithValues);
      const salesProducts = sales.map((res) => res.productId);
      const totalKiloGramData = fixedProductText.map((res) => {
        const totalData = salesProducts.filter(
          (res2) =>
            `${res2?.iceType} (${res2?.weight} ${res2?.scaleType})` ===
            res.toLocaleLowerCase()
        );
        return {
          particulars: res,
          totalQty: totalData?.length > 0 ? totalData?.length : "---",
          totalKgs: totalData[0]?.weight ? totalData[0]?.weight : "---",
          total: totalData[0]?.weight
            ? totalData?.length * totalData[0]?.weight
            : "---",
        };
      });
      setTotalKiloGram(totalKiloGramData);
      const totalKiloGrandTotalData = totalKiloGramData
        .map((res) => res?.total)
        .reduce(function (a, b) {
          const num1 = a === "" || a === "---" ? 0 : a;
          const num2 = b === "" || b === "---" ? 0 : b;
          return num1 + num2;
        }, 0);
      setTotalKiloGrandTotal(totalKiloGrandTotalData);
    }
  }, [sales]);

  useEffect(() => {
    if (tableSales.length > 0) {
      const convertedTableValue = tableSales.map((res) => {
        const toZero = res.map((res2) => {
          return res2 === "" || res2 === "---" ? 0 : res2;
        });
        return toZero;
      });
      const result = convertedTableValue.reduce(function (array1, array2) {
        return array2.map(function (value, index) {
          if (index > 3 && !isNaN(value)) {
            const validValue = !isNaN(value) ? parseInt(value) : 0;
            const validArray1Value = !isNaN(array1[index])
              ? parseInt(array1[index])
              : 0;
            const total = validValue + validArray1Value;
            return total;
          } else {
            return "";
          }
        }, 0);
      }, []);

      setTotalResult(result);
    }
  }, [tableSales]);

  const tableHeaderExpense = [
    "Date",
    "PCV No.",
    "Vendor/Client",
    "Particulars",
    "PCV Amount",
    "Expense Name",
    "Expense Amnt",
  ];

  const expensesCost = expenses.map((res) => res.cost);

  const expensesCostTotal = expensesCost.reduce(function (a, b) {
    const num1 = a === "" ? 0 : a;
    const num2 = b === "" ? 0 : b;
    return num1 + num2;
  }, 0);

  const tableHeaderTotalKilogram = [
    "Particulars",
    "Total Qty.",
    "Kgs",
    "Total Kgs",
  ];

  const tableCashHeader = ["Cash Breakdown"];
  const tableTotalSalesHeader = ["Total Sales"];

  const tableCash = [
    "One Peso",
    "Five Peso",
    "Ten Peso",
    "Twenty Peso",
    "Fifty Peso",
    "One Hundred Peso",
    "Two Hundred Peso",
    "Five Hundred Peso",
    "One Thousand Peso",
  ];

  useEffect(() => {
    if (getAutheticatedUserId.isSuccess) {
      if (
        !getAutheticatedUserId.data.data?.errors &&
        getAutheticatedUserId.data.data?.data?.verifyToken
      ) {
        setAutheticatedUserId(
          getAutheticatedUserId.data.data?.data?.verifyToken?.userId
        );
      }
    }
    if (getAutheticatedUserId.isError) {
      triggerTopAlert(true, getAutheticatedUserId.error.message, "warning");
    }
  }, [getAutheticatedUserId.data]);

  useEffect(() => {
    if (autheticatedUserId) {
      getAutheticatedUserData.refetch();
      getCreditList.refetch();
      if (isDataOwnerUser) {
        getOrderList2.refetch();
        getExpenseList2.refetch();
        getCashList2.refetch();
        getCashOnHandList2.refetch();
      } else {
        getOrderList.refetch();
        getExpenseList.refetch();
        getCashList.refetch();
        getCashOnHandList.refetch();
      }
    }
  }, [autheticatedUserId]);

  useEffect(() => {
    if (getAutheticatedUserData.isSuccess) {
      if (
        !getAutheticatedUserData.data.data?.errors &&
        getAutheticatedUserData.data.data?.data?.user
      ) {
        const foundUser = getAutheticatedUserData.data.data?.data?.user;
        setAutheticatedUserFullName(
          `${foundUser.firstName} ${foundUser.lastName}`
        );
      }
    }
    if (getAutheticatedUserData.isError) {
      triggerTopAlert(true, getAutheticatedUserData.error.message, "warning");
    }
  }, [getAutheticatedUserData.data, getAutheticatedUserData.isLoading]);

  useEffect(() => {
    if (getOrderList.isSuccess) {
      if (
        !getOrderList.data.data?.errors &&
        getOrderList.data.data?.data?.sales
      ) {
        const dataDB = getOrderList.data.data?.data?.sales;
        const dataDBFilteredByDate = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        );
        const dataDBFinal = filterSalesBy !== "null" ? dataDBFilteredByDate.filter(
          (res) => res.vehicleType === filterSalesBy
        ) : dataDBFilteredByDate;
        setSales(dataDBFinal);
      }
    }
    if (getOrderList.isError) {
      triggerTopAlert(true, getOrderList.error.message, "warning");
    }
  }, [getOrderList.data, getOrderList.isLoading]);

  useEffect(() => {
    if (getCreditList.isSuccess) {
      if (
        !getCreditList.data.data?.errors &&
        getCreditList.data.data?.data?.credits
      ) {
        const dataDB = getCreditList.data.data?.data?.credits;
        const dataDBFiltered = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        )
        setCredits(dataDBFiltered);
        const dataPayment = dataDBFiltered.reduce(function (sum, current) {
          return current.isIn === true ? sum + current.amount : sum;
        }, 0);
        setCreditPaymentTotal(dataPayment);
        const dataBorrow = dataDBFiltered.reduce(function (sum, current) {
          return current.isIn === false ? sum + current.amount : sum;
        }, 0);
        setCreditBorrowTotal(dataBorrow);
      }
    }
    if (getCreditList.isError) {
      triggerTopAlert(true, getCreditList.error.message, "warning");
    }
  }, [getCreditList.data, getCreditList.isLoading]);

  useEffect(() => {
    if (getOrderList2.isSuccess) {
      if (
        !getOrderList2.data.data?.errors &&
        getOrderList2.data.data?.data?.salesByUser
      ) {
        const dataDB = getOrderList2.data.data?.data?.salesByUser;
        const dataDBFilteredByDate = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        );
        const dataDBFinal = filterSalesBy !== "null" ? dataDBFilteredByDate.filter(
          (res) => res.vehicleType === filterSalesBy
        ) : dataDBFilteredByDate;
        setSales(dataDBFinal);
      }
    }
    if (getOrderList2.isError) {
      triggerTopAlert(true, getOrderList2.error.message, "warning");
    }
  }, [getOrderList2.data, getOrderList2.isLoading]);

  useEffect(() => {
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenses
      ) {
        const dataDB = getExpenseList.data.data?.data?.expenses;
        setExpenses(
          dataDB.filter(
            (res) =>
              parseInt(res.createdAt) > parseInt(dateFrom) &&
              parseInt(res.createdAt) < parseInt(dateTo)
          )
        );
      }
    }
    if (getExpenseList.isError) {
      triggerTopAlert(true, getExpenseList.error.message, "warning");
    }
  }, [getExpenseList.data]);

  useEffect(() => {
    if (getExpenseList2.isSuccess) {
      if (
        !getExpenseList2.data.data?.errors &&
        getExpenseList2.data.data?.data?.expenseByUser
      ) {
        const dataDB = getExpenseList2.data.data?.data?.expenseByUser;
        setExpenses(
          dataDB.filter(
            (res) =>
              parseInt(res.createdAt) > parseInt(dateFrom) &&
              parseInt(res.createdAt) < parseInt(dateTo)
          )
        );
      }
    }
    if (getExpenseList2.isError) {
      triggerTopAlert(true, getExpenseList2.error.message, "warning");
    }
  }, [getExpenseList2.data]);

  useEffect(() => {
    if (getCashList.isSuccess) {
      if (
        !getCashList.data.data?.errors &&
        getCashList.data.data?.data?.cashes
      ) {
        const dataDB = getCashList.data.data?.data?.cashes;
        const dataDBFiltered = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        );
        const onePesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.onePeso;
        }, 0);
        const fivePesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.fivePeso;
        }, 0);
        const tenPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.tenPeso;
        }, 0);
        const twentyPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.twentyPeso;
        }, 0);
        const fiftyPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.fiftyPeso;
        }, 0);
        const oneHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.oneHundredPeso;
        },
        0);
        const twoHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.twoHundredPeso;
        },
        0);
        const fiveHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.fiveHundredPeso;
        },
        0);
        const oneThousandPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.oneThousandPeso;
        },
        0);

        setCashes([
          onePesoTotal,
          fivePesoTotal,
          tenPesoTotal,
          twentyPesoTotal,
          fiftyPesoTotal,
          oneHundredPesoTotal,
          twoHundredPesoTotal,
          fiveHundredPesoTotal,
          oneThousandPesoTotal,
        ]);
      }
    }
    if (getCashList.isError) {
      triggerTopAlert(true, getCashList.error.message, "warning");
    }
  }, [getCashList.data, getCashList.isLoading]);

  useEffect(() => {
    if (getCashList2.isSuccess) {
      if (
        !getCashList2.data.data?.errors &&
        getCashList2.data.data?.data?.cashByUser
      ) {
        const dataDB = getCashList2.data.data?.data?.cashByUser;
        const dataDBFiltered = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        );
        const onePesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.onePeso;
        }, 0);
        const fivePesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.fivePeso;
        }, 0);
        const tenPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.tenPeso;
        }, 0);
        const twentyPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.twentyPeso;
        }, 0);
        const fiftyPesoTotal = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.fiftyPeso;
        }, 0);
        const oneHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.oneHundredPeso;
        },
        0);
        const twoHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.twoHundredPeso;
        },
        0);
        const fiveHundredPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.fiveHundredPeso;
        },
        0);
        const oneThousandPesoTotal = dataDBFiltered.reduce(function (
          sum,
          current
        ) {
          return sum + current.oneThousandPeso;
        },
        0);

        setCashes([
          onePesoTotal,
          fivePesoTotal,
          tenPesoTotal,
          twentyPesoTotal,
          fiftyPesoTotal,
          oneHundredPesoTotal,
          twoHundredPesoTotal,
          fiveHundredPesoTotal,
          oneThousandPesoTotal,
        ]);
      }
    }
    if (getCashList2.isError) {
      triggerTopAlert(true, getCashList2.error.message, "warning");
    }
  }, [getCashList2.data, getCashList2.isLoading]);

  useEffect(() => {
    if (getProductList.isSuccess) {
      if (
        !getProductList.data.data?.errors &&
        getProductList.data.data?.data?.products
      ) {
        const product = getProductList.data.data?.data?.products;
        setProducts(product);
      }
    }
  }, [getProductList.data]);

  useEffect(() => {
    if (getCashOnHandList.isSuccess) {
      if (
        !getCashOnHandList.data.data?.errors &&
        getCashOnHandList.data.data?.data?.cashOnHands
      ) {
        const dataDB = getCashOnHandList.data.data?.data?.cashOnHands;
        const dataDBFiltered = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        )
        const total = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.amount;
        }, 0);
        setCashOnHandTotal(total);
      }
    }
    if (getCashOnHandList.isError) {
      triggerTopAlert(true, getCashOnHandList.error.message, "warning");
    }
  }, [getCashOnHandList.data, getCashOnHandList.isLoading]);

  useEffect(() => {
    if (getCashOnHandList2.isSuccess) {
      if (
        !getCashOnHandList2.data.data?.errors &&
        getCashOnHandList2.data.data?.data?.cashOnHandByUser
      ) {
        const dataDB = getCashOnHandList2.data.data?.data?.cashOnHandByUser;
        const dataDBFiltered = dataDB.filter(
          (res) =>
            parseInt(res.createdAt) > parseInt(dateFrom) &&
            parseInt(res.createdAt) < parseInt(dateTo)
        )
        const total = dataDBFiltered.reduce(function (sum, current) {
          return sum + current.amount;
        }, 0);
        setCashOnHandTotal(total);
      }
    }
    if (getCashOnHandList2.isError) {
      triggerTopAlert(true, getCashOnHandList2.error.message, "warning");
    }
  }, [getCashOnHandList2.data, getCashOnHandList2.isLoading]);

  return (
    <div style={{ margin: 15 }}>
      {isLoading ? (
        <div style={{ margin: 15 }}>
          <Loader size="md" content="Loading..." />
        </div>
      ) : null}
      <p style={{ fontSize: 12, marginTop: 0 }}>
        <strong>
          DATE:{" "}
          {moment.unix(parseInt(dateFrom) / 1000).format("MM/DD/YYYY") ===
          moment.unix(parseInt(dateTo) / 1000).format("MM/DD/YYYY")
            ? moment.unix(parseInt(dateFrom) / 1000).format("MM/DD/YYYY")
            : `${moment
                .unix(parseInt(dateFrom) / 1000)
                .format("MM/DD/YYYY")} to ${moment
                .unix(parseInt(dateTo) / 1000)
                .format("MM/DD/YYYY")} `}
        </strong>
      </p>
      <p style={{ fontSize: 12, marginTop: 0, marginBottom: 15 }}>
        <strong>CASHIER: {autheticatedUserFullName}</strong>
      </p>
      <Grid fluid style={{ padding: 0 }}>
        <Row>
          <Col xs={24}>
            {isAllIncluded || isSalesIncluded ? (
              <table
                border="1"
                style={{ width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  {tableHeader1.map((res) => {
                    if (res !== "") {
                      return (
                        <td colSpan={fixedProduct.length}>
                          <strong>{res}</strong>
                        </td>
                      );
                    } else {
                      return (
                        <td>
                          <span style={{ color: "transparent" }}>
                            test test test test
                          </span>
                        </td>
                      );
                    }
                  })}
                </tr>
                <tr>
                  {tableCombined.map((res) => {
                    return (
                      <td>
                        <strong>{res}</strong>
                      </td>
                    );
                  })}
                </tr>
                {tableSales.map((res) => {
                  const columns = res.map((res2) => <td>{res2}</td>);
                  return <tr>{columns}</tr>;
                })}
                <tr>
                  <td colSpan={tableCombined.length}>
                    <span style={{ color: "transparent" }}>
                      test test test test
                    </span>
                  </td>
                </tr>
                <tr>
                  {totalResult.map((res, i) => {
                    if (i === 0) {
                      return (
                        <td>
                          <strong>Grand Total</strong>
                        </td>
                      );
                    } else {
                      return (
                        <td>
                          <strong>{res}</strong>
                        </td>
                      );
                    }
                  })}
                </tr>
              </table>
            ) : null}
          </Col>
        </Row>
      </Grid>
      <br />
      <Grid fluid style={{ padding: 0 }}>
        <Row>
          <Col xs={24}>
            {isAllIncluded || isExpensesIncluded ? (
              <table
                border="1"
                style={{ width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  <td colSpan={tableHeaderExpense.length}>
                    <strong>EXPENSE DETAILS</strong>
                  </td>
                </tr>
                <tr>
                  {tableHeaderExpense.map((res) => {
                    return (
                      <td>
                        <strong>{res}</strong>
                      </td>
                    );
                  })}
                </tr>
                {expenses.map((res) => {
                  return (
                    <tr>
                      {tableHeaderExpense.map((res2, i) => {
                        if (i === 0) {
                          return (
                            <td>
                              {moment
                                .unix(res.createdAt / 1000)
                                .format("MM/DD/YYYY")}
                            </td>
                          );
                        } else if (i === 2) {
                          return <td>{res.vendor ? res.vendor : "---"}</td>;
                        } else if (i === 5) {
                          return <td>{res.name}</td>;
                        } else if (i === 6) {
                          return <td>{res.cost}</td>;
                        } else {
                          return (
                            <td style={{ color: "transparent" }}>asdasdasd</td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={tableCombined.length}>
                    <span style={{ color: "transparent" }}>
                      test test test test
                    </span>
                  </td>
                </tr>
                <tr>
                  {tableHeaderExpense.map((res, i) => {
                    if (i === 0) {
                      return (
                        <td>
                          <strong>Grant Total</strong>
                        </td>
                      );
                    } else if (i === 6) {
                      return (
                        <td>
                          <strong>{expensesCostTotal}</strong>
                        </td>
                      );
                    } else {
                      return (
                        <td style={{ color: "transparent" }}>asdasdasd</td>
                      );
                    }
                  })}
                </tr>
              </table>
            ) : null}
          </Col>
        </Row>
      </Grid>
      <br />
      <Grid fluid style={{ padding: 0 }}>
        <Row>
          <Col xs={12}>
            {isAllIncluded || isTotalKilogramIncluded ? (
              <table
                border="1"
                style={{  width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  {tableHeaderTotalKilogram.map((res) => {
                    return (
                      <td>
                        <strong>{res}</strong>
                      </td>
                    );
                  })}
                </tr>
                {totalKiloGram.map((res) => {
                  return (
                    <tr>
                      {tableHeaderTotalKilogram.map((res2, i) => {
                        if (i === 0) {
                          return <td>{res.particulars}</td>;
                        } else if (i === 1) {
                          return <td>{res.totalQty}</td>;
                        } else if (i === 2) {
                          return <td>{res.totalKgs}</td>;
                        } else if (i === 3) {
                          return <td>{res.total}</td>;
                        } else {
                          return (
                            <td style={{ color: "transparent" }}>asdasdasd</td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={tableCombined.length}>
                    <span style={{ color: "transparent" }}>
                      test test test test
                    </span>
                  </td>
                </tr>
                <tr>
                  {tableHeaderTotalKilogram.map((res, i) => {
                    if (i === 0) {
                      return (
                        <td>
                          <strong>Grand Total</strong>
                        </td>
                      );
                    } else if (i === 3) {
                      return (
                        <td>
                          <strong>{totalKiloGrandTotal}</strong>
                        </td>
                      );
                    } else {
                      return (
                        <td style={{ color: "transparent" }}>asdasdasd</td>
                      );
                    }
                  })}
                </tr>
              </table>
            ) : null}
          </Col>
          <Col xs={12}>
            {isAllIncluded || isCashBreakdownIncluded ? (
              <table
                border="1"
                style={{ width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  {tableCashHeader.map((res) => {
                    return (
                      <td colSpan={4}>
                        <strong>{res}</strong>
                      </td>
                    );
                  })}
                </tr>
                {tableCash.map((res, i) => {
                  return (
                    <tr>
                      <td>{res}</td>
                      <td>{cashes[i] === 0 ? "---" : cashes[i]}</td>
                      <td>x</td>
                      <td>
                        {i === 0
                          ? cashes[i] * 1 !== 0
                            ? cashes[i] * 1
                            : "---"
                          : null}
                        {i === 1
                          ? cashes[i] * 5 !== 0
                            ? cashes[i] * 5
                            : "---"
                          : null}
                        {i === 2
                          ? cashes[i] * 10 !== 0
                            ? cashes[i] * 10
                            : "---"
                          : null}
                        {i === 3
                          ? cashes[i] * 20 !== 0
                            ? cashes[i] * 20
                            : "---"
                          : null}
                        {i === 4
                          ? cashes[i] * 50 !== 0
                            ? cashes[i] * 50
                            : "---"
                          : null}
                        {i === 5
                          ? cashes[i] * 100 !== 0
                            ? cashes[i] * 100
                            : "---"
                          : null}
                        {i === 6
                          ? cashes[i] * 200 !== 0
                            ? cashes[i] * 200
                            : "---"
                          : null}
                        {i === 7
                          ? cashes[i] * 500 !== 0
                            ? cashes[i] * 500
                            : "---"
                          : null}
                        {i === 8
                          ? cashes[i] * 1000 !== 0
                            ? cashes[i] * 1000
                            : "---"
                          : null}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={4} style={{ color: "transparent" }}>
                    asdasdasd
                  </td>
                </tr>
                <tr>
                  <td><strong>Total</strong></td>
                  <td></td>
                  <td></td>
                  <td>
                    {cashes.reduce((prev, curr, index) => {
                      let multiply;
                      switch (index) {
                        case 0:
                          multiply = 1;
                          break;
                        case 1:
                          multiply = 5;
                          break;
                        case 2:
                          multiply = 10;
                          break;
                        case 3:
                          multiply = 20;
                          break;
                        case 4:
                          multiply = 50;
                          break;
                        case 5:
                          multiply = 100;
                          break;
                        case 6:
                          multiply = 200;
                          break;
                        case 7:
                          multiply = 500;
                          break;
                        case 8:
                          multiply = 1000;
                          break;
                        default:
                          multiply = 0;
                      }
                      return prev + curr * multiply;
                    }, 0)}
                  </td>
                </tr>
              </table>
            ) : null}
          </Col>
        </Row>
      </Grid>
      <br/>
      <Grid fluid  style={{ padding: 0 }}>
      <Row>
      <Col xs={12}>
            {isAllIncluded || isTotalSalesIncluded ? (
              <table
                border="1"
                style={{ width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  <td><strong>TOTAL SALES</strong></td>
                  <td><strong>{parseInt((isAllIncluded || isSalesIncluded) && totalResult.slice(-1) > 0 ? totalResult.slice(-1) : 0)}</strong></td>
                </tr>
                <tr>
                  <td><strong>TOTAL PAID CREDIT</strong></td>
                  <td><strong>{isAllIncluded || isCustomerCreditsIncluded ? creditPaymentTotal : 0}</strong></td>
                </tr>
                <tr>
                  <td><strong>GRAND TOTAL SALES</strong></td>
                  <td><strong>{parseInt((isAllIncluded || isSalesIncluded) && totalResult.slice(-1) > 0 ? totalResult.slice(-1) : 0) + (isAllIncluded || isCustomerCreditsIncluded ? creditPaymentTotal : 0)}</strong></td>
                </tr>
                <tr>
                  <td><strong>TOTAL CREDIT</strong></td>
                  <td><strong>{isAllIncluded || isCustomerCreditsIncluded ? creditBorrowTotal : 0}</strong></td>
                </tr>
                <tr>
                  <td><strong>TOTAL EXPENSES</strong></td>
                  <td><strong>{isAllIncluded || isExpensesIncluded ? expensesCostTotal : 0}</strong></td>
                </tr>
                <tr>
                  <td><strong>TOTAL CASH SALES</strong></td>
                  <td><strong>{(parseInt((isSalesIncluded || isAllIncluded) && totalResult.slice(-1) > 0 ? totalResult.slice(-1) : 0) + parseInt(isAllIncluded || isCustomerCreditsIncluded ? creditPaymentTotal : 0)) - parseInt(isAllIncluded || isCustomerCreditsIncluded ? creditBorrowTotal : 0) - (isAllIncluded || isExpensesIncluded ? expensesCostTotal : 0)}</strong></td>
                </tr>
                <tr>
                  <td><strong>CASH ON HAND</strong></td>
                  <td><strong>{cashOnHandTotal}</strong></td>
                </tr>
              </table>
            ) : null}
          </Col>
          <Col xs={12}>
            {isAllIncluded || isCustomerCreditsIncluded ? (
              <table
                border="1"
                style={{ width: "100%", fontSize: 10, textAlign: "center" }}
              >
                <tr>
                  <td colSpan={4}>
                    <strong>Customer Credits</strong>
                  </td>
                </tr>
                <tr>
                  <td><strong>Date</strong></td>
                  <td><strong>Name</strong></td>
                  <td><strong>Amount</strong></td>
                  <td><strong>Type</strong></td>
                </tr>
                {credits?.map((res, i) => {
                    return (
                      <tr>
                        <td>{moment.unix(res.createdAt / 1000).format("MM/DD/YYYY")}</td>
                        <td>{res.customerId?.description}</td>
                        <td>{res.amount}</td>
                        <td>{res.isIn ? "Payment" : "Borrow"}</td>
                      </tr>
                    );
                  })}
              </table>
            ) : null}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ReportsList2);
