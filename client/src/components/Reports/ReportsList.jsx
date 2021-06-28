import moment from "moment";
import React, { useState, useEffect } from "react";
import { Table, Button, ControlLabel, Panel, DateRangePicker } from "rsuite";
import axios from "axios";
import { useQuery } from "react-query";
import { graphqlUrl } from "../../services/constants";

function ReportsList() {
  const { Column, HeaderCell, Cell } = Table;
  const [expenseList, setExpenseList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
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
              productId {
                _id,
                iceType,
                scaleType,
                cost,
                weight,
                createdAt
              },
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
            description: res.customerId?.description,
            iceType: res.productId?.iceType,
            weight: res.productId?.weight,
            cost: res.productId?.cost,
            scaleType: res.productId?.scaleType,
            createdAt: res.createdAt,
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
          parseInt(expense.createdAt) > selectedDateFrom &&
          parseInt(expense.createdAt) < selectedDateTo
      )
    );

    setSalesFilteredByDate(
      salesList.filter((sales) => {
        return (
          parseInt(sales.createdAt) > selectedDateFrom &&
          parseInt(sales.createdAt) < selectedDateTo
        );
      })
    );
  }, [selectedDateFrom, selectedDateTo]);

  useEffect(() => {
    const total = salesFilteredByDate
      ?.reverse()
      .map((res) => {
        return res.cost;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    setTotalSales(total);
  }, [salesFilteredByDate]);

  useEffect(() => {
    const total = expenseFilteredByDate
      ?.reverse()
      .map((res) => {
        return res.cost;
      })
      .reduce(function (a, b) {
        return a + b;
      }, 0);
    setTotalExpenses(total);
  }, [expenseFilteredByDate]);

  return (
    <>
      <Panel bordered style={{ margin: 10 }}>
        <ControlLabel>Sort by Date </ControlLabel>
        <DateRangePicker
          onChange={([date1, date2]) => {
            setSelectedDateFrom(moment(date1).startOf("day").unix() * 1000);
            setSelectedDateTo(moment(date2).endOf("day").unix() * 1000);
          }}
          placeholder="Select Date Range"
        />{" "}
        <Button
          appearance="primary"
          type="submit"
          style={{ marginRight: 10 }}
          disabled={!selectedDateFrom}
          onClick={() =>
            window.open(
              `/print-report?dateFrom=${selectedDateFrom}&dateTo=${selectedDateTo}`,
              "_blank"
            )
          }
        >
          Print Report
        </Button>
        <h5 style={{ marginTop: 20 }}>Sales Report</h5>
        <p style={{ marginTop: 20 }}>
          Total Sales: <strong>P {totalSales}</strong>
        </p>
        <Table
          style={{ marginTop: 20 }}
          data={selectedDate ? salesList : salesFilteredByDate}
          height={300}
        >
          <Column>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Customer</HeaderCell>
            <Cell dataKey="description" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Ice Type</HeaderCell>
            <Cell dataKey="iceType" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Weight</HeaderCell>
            <Cell dataKey="weight" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Scale Type</HeaderCell>
            <Cell dataKey="scaleType" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Cost (Pesos)</HeaderCell>
            <Cell dataKey="cost" />
          </Column>
        </Table>
        <hr />
        <h5 style={{ marginTop: 20 }}>Expense Report</h5>
        <p style={{ marginTop: 20 }}>
          Total Expense: <strong>P {totalExpenses}</strong>
        </p>
        <Table
          style={{ marginTop: 20 }}
          data={selectedDate ? expenseList : expenseFilteredByDate}
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
