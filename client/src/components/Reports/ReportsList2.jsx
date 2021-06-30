import React, { useEffect, useState } from "react";
import { Loader } from "rsuite";
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
  const [autheticatedUserFullName, setAutheticatedUserFullName] =
    useState(null);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const { triggerTopAlert } = props;
  const { search } = useLocation();
  const dates = search.split("&");
  const dateFrom = dates[0]?.replace("?dateFrom=", "");
  const dateTo = dates[1]?.replace("dateTo=", "");

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

  const getOrderList = useQuery("OrderList", async () => {
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
          receiptNumber,
          birNumber,
          createdAt
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  },{
    refetchInterval: 3000
  });

  const getExpenseList = useQuery("getExpenseList", async () => {
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
  });

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

  const tableHeader1 = [
    "",
    "",
    "",
    "",
    "SALES QUANTITY",
    "",
    "SALES AMOUNT",
    "",
  ];
  const tableHeader2 = ["DR", "SALES INV", "DESC.", "PARTICULARS"];
  const tableHeader3 = products.map((res) => {
    return `${capitalize(res.iceType)} (${res.weight} ${res.scaleType})`;
  });

  const tableCombined = [
    ...tableHeader2,
    ...tableHeader3,
    "TOTAL",
    ...tableHeader3,
    "TOTAL AMNT",
  ];

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

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
          const customer = res[0].customerId;
          if (res2 === "DR") {
            return res[0].receiptNumber;
          } else if (res2 === "SALES INV") {
            return "";
          } else if (res2 === "DESC.") {
            return "";
          } else if (res2 === "PARTICULARS") {
            return customer ? customer.description : `---`;
          } else {
            return "";
          }
        });
        const rowValuesSecondPart = products.map((res3) => {
          const foundProducts = res.filter(
            (res4) => res4.productId._id === res3._id
          );
          return foundProducts.length > 0 ? foundProducts.length : "";
        });
        const totalSecondPart = rowValuesSecondPart.reduce(function (a, b) {
          const num1 = a === "" ? 0 : a;
          const num2 = b === "" ? 0 : b;
          return num1 + num2;
        }, 0);
        const rowValuesThirdPart = products.map((res5) => {
          const foundProducts = res.filter(
            (res6) => res6.productId._id === res5._id
          );
          const costsValue = foundProducts
            .map((res) => res.productId.cost)
            .filter((res2) => res2);
          const sum = costsValue.reduce(function (a, b) {
            const num1 = a === "" ? 0 : a;
            const num2 = b === "" ? 0 : b;
            return num1 + num2;
          }, 0);
          return foundProducts.length > 0 ? sum : "";
        });
        const totalThirdPart = rowValuesThirdPart.reduce(function (a, b) {
          const num1 = a === "" ? 0 : a;
          const num2 = b === "" ? 0 : b;
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
    }
  }, [sales]);

  useEffect(() => {
    if (tableSales.length > 0) {
      const convertedTableValue = tableSales.map((res) => {
        const toZero = res.map((res2) => {
          return res2 === "" ? 0 : res2;
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

  const salesProducts = sales.map((res) => res.productId);
  const uniqSales = uniqBy(salesProducts, "_id");
  const totalKiloGramData = uniqSales.map((res) => {
    const totalData = salesProducts.filter((res2) => res2._id === res._id);
    const totalDataCost = totalData
      .map((res2) => res2.cost)
      .reduce(function (a, b) {
        const num1 = a === "" ? 0 : a;
        const num2 = b === "" ? 0 : b;
        return num1 + num2;
      }, 0);
    return {
      particulars: `${capitalize(res.iceType)} (${res.weight} ${
        res.scaleType
      })`,
      totalQty: totalData.length,
      kgs: res.weight,
      total: totalData.length * res.weight,
    };
  });

  const totalKiloGrandTotal = totalKiloGramData
    .map((res) => res.total)
    .reduce(function (a, b) {
      const num1 = a === "" ? 0 : a;
      const num2 = b === "" ? 0 : b;
      return num1 + num2;
    }, 0);

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
        setSales(
          dataDB.filter(
            (res) =>
              parseInt(res.createdAt) > parseInt(dateFrom) &&
              parseInt(res.createdAt) < parseInt(dateTo)
          )
        );
      }
    }
    if (getOrderList.isError) {
      triggerTopAlert(true, getOrderList.error.message, "warning");
    }
  }, [getOrderList.data, getOrderList.isLoading]);

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
  }, [getExpenseList.data]);

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
      <table
        border="1"
        style={{ width: "100%", fontSize: 10, textAlign: "center" }}
      >
        <tr>
          {tableHeader1.map((res) => {
            if (res !== "") {
              return (
                <td colSpan={tableHeader3.length}>
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
            <span style={{ color: "transparent" }}>test test test test</span>
          </td>
        </tr>
        <tr>
          {totalResult.map((res, i) => {
            if (i === 0) {
              return (
                <td>
                  <strong>Grant Total</strong>
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
      <br />
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
                if (i === 2) {
                  return <td>{res.vendor ? res.vendor : "---"}</td>;
                } else if (i === 5) {
                  return <td>{res.name}</td>;
                } else if (i === 6) {
                  return <td>{res.cost}</td>;
                } else {
                  return <td style={{ color: "transparent" }}>asdasdasd</td>;
                }
              })}
            </tr>
          );
        })}
        <tr>
          <td colSpan={tableCombined.length}>
            <span style={{ color: "transparent" }}>test test test test</span>
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
              return <td style={{ color: "transparent" }}>asdasdasd</td>;
            }
          })}
        </tr>
      </table>
      <br />
      <table
        border="1"
        style={{ width: "50%", fontSize: 10, textAlign: "center" }}
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
        {totalKiloGramData.map((res) => {
          return (
            <tr>
              {tableHeaderTotalKilogram.map((res2, i) => {
                if (i === 0) {
                  return <td>{res.particulars}</td>;
                } else if (i === 1) {
                  return <td>{res.totalQty}</td>;
                } else if (i === 2) {
                  return <td>{res.kgs}</td>;
                } else if (i === 3) {
                  return <td>{res.total}</td>;
                } else {
                  return <td style={{ color: "transparent" }}>asdasdasd</td>;
                }
              })}
            </tr>
          );
        })}
        <tr>
          <td colSpan={tableCombined.length}>
            <span style={{ color: "transparent" }}>test test test test</span>
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
              return <td style={{ color: "transparent" }}>asdasdasd</td>;
            }
          })}
        </tr>
      </table>
    </div>
  );
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ReportsList2);
