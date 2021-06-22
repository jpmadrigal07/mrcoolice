import moment from "moment";
import React, { useState, useEffect } from "react";
import { Table, DatePicker, ControlLabel, Panel } from "rsuite";
import axios from "axios";
import { useQuery } from "react-query";
import { graphqlUrl } from "../../services/constants";

function ReportsList() {
  const { Column, HeaderCell, Cell } = Table;
  const [expenseList, setExpenseList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expenseFilteredByDate, setExpenseFilteredByDate] = useState([]);
  const [salesFilteredByDate, setSalesFilteredByDate] = useState([]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const getExpenseList = useQuery("getExpenseList", async () => {
    const query = `{
                expenses {
                    _id
                    name
                    cost
                    createdAt
                }
              }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getSalesList = useQuery("getSalesList", async () => {
    const query = `{
            sales {
              customerId {
                  _id
                  description
                },
              _id,
              productId,
              createdAt
            }
          }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenses
      ) {
        const expenses = getExpenseList.data.data?.data?.expenses;
        const expensesWithNumber = expenses?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setExpenseList(expensesWithNumber);
      }
    }
  }, [getExpenseList.data]);

  useEffect(() => {
    if (getSalesList.isSuccess) {
      if (
        !getSalesList.data.data?.errors &&
        getSalesList.data.data?.data?.sales
      ) {
        const sales = getSalesList.data.data?.data?.sales;
        const salesWithNumber = sales?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setSalesList(salesWithNumber);
      }
    }
  }, [getSalesList.data]);

  useEffect(() => {
    setExpenseFilteredByDate(
      expenseList.filter(
        (expense) =>
          moment.unix(parseInt(expense.createdAt) / 1000).startOf("day") ==
          selectedDate
      )
    );
    
    setSalesFilteredByDate(
      salesList.filter(
        (sales) =>
          moment.unix(parseInt(sales.createdAt) / 1000).startOf("day") ==
          selectedDate
      )
    );

  }, [selectedDate]);

  useEffect(() => {
    const total = salesFilteredByDate?.reverse().map((res) => {
      return res.productId.cost;
    }).reduce(function(a, b) { return a + b; }, 0);
    setTotalSales(total);
  }, [salesFilteredByDate])

  useEffect(() => {
    const total = expenseFilteredByDate?.reverse().map((res) => {
      return res.cost;
    }).reduce(function(a, b) { return a + b; }, 0);
    setTotalExpenses(total);
  }, [expenseFilteredByDate])

  return (
    <>
      <Panel bordered style={{ margin: 10 }}>
        <ControlLabel>Sort by Date</ControlLabel>
        <DatePicker
          onChange={(e) =>
            setSelectedDate(moment(e).startOf("day").unix() * 1000)
          }
          style={{ marginLeft: 10, width: 150 }}
          oneTap
        />
                <h5 style={{ marginTop: 20 }}>Sales Report</h5>
                <p style={{marginTop: 20}}>Total Sales: <strong>P {totalSales}</strong></p>
        <Table
          style={{ marginTop: 20 }}
          data={salesFilteredByDate}
          height={300}
        >
          <Column>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Customer</HeaderCell>
            <Cell dataKey="customerId.description" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Ice Type</HeaderCell>
            <Cell dataKey="productId.iceType" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Weight</HeaderCell>
            <Cell dataKey="productId.weight" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Scale Type</HeaderCell>
            <Cell dataKey="productId.scaleType" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Cost</HeaderCell>
            <Cell dataKey="productId.cost" />
          </Column>
        </Table>
        <hr/>
        <h5 style={{ marginTop: 20 }}>Expense Report</h5>
        <p style={{marginTop: 20}}>Total Expense: <strong>P {totalExpenses}</strong></p>
        <Table
          style={{ marginTop: 20 }}
          data={expenseFilteredByDate}
          height={300}
        >
          <Column>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Expense Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Cost (Pesos)</HeaderCell>
            <Cell dataKey="cost" />
          </Column>
        </Table>
      </Panel>
    </>
  );
}

export default ReportsList;
