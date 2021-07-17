import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  ControlLabel,
  Panel,
  DateRangePicker,
  CheckPicker,
} from "rsuite";
import axios from "axios";
import { useQuery } from "react-query";
import { graphqlUrl, REPORTS_ITEMS } from "../../services/constants";
import Cookies from "js-cookie";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";

function ReportsList(props) {
  const { triggerTopAlert } = props;
  const token = Cookies.get("sessionToken");
  const { Column, HeaderCell, Cell } = Table;
  const [expenseList, setExpenseList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [expenseFilteredByDate, setExpenseFilteredByDate] = useState([]);
  const [salesFilteredByDate, setSalesFilteredByDate] = useState([]);
  const [autheticatedUserId, setAutheticatedUserId] = useState(null);
  const [reportInclusion, setReportInclusion] = useState(null);

  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const getAutheticatedUserId = useQuery("getAutheticatedUserId", async () => {
    const query = `{
            verifyToken(token: "${token}") {
                userId
            }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getExpenseList = useQuery(
    "getExpenseList",
    async () => {
      const query = `{
                expenseByUser(userId: "${autheticatedUserId}") {
                    _id,
                    name,
                    cost,
                    vendor,
                    createdAt,
                }
              }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  const getSalesList = useQuery(
    "getSalesList",
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
                scaleType,
                cost,
                weight,
                createdAt
              },
              receiptNumber,
              birNumber,
              drNumber,
              location,
              vehicleType,
              createdAt,
            }
          }`;
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (getExpenseList.isSuccess) {
      if (
        !getExpenseList.data.data?.errors &&
        getExpenseList.data.data?.data?.expenseByUser
      ) {
        const expenses = getExpenseList.data.data?.data?.expenseByUser;
        const expensesWithNumber = expenses?.map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setExpenseList(expensesWithNumber.reverse());
      }
    }
  }, [getExpenseList.data]);

  useEffect(() => {
    if (getSalesList.isSuccess) {
      if (
        !getSalesList.data.data?.errors &&
        getSalesList.data.data?.data?.salesByUser
      ) {
        const sales = getSalesList.data.data?.data?.salesByUser;
        const salesWithNumber = sales?.map((res, index) => {
          return {
            id: index + 1,
            description: res.customerId?.description,
            iceType: res.productId?.iceType,
            weight: res.productId?.weight,
            cost: res.productId?.cost,
            scaleType: res.productId?.scaleType,
            drNumber: res?.drNumber,
            birNumber: res?.birNumber,
            receiptNumber: res?.receiptNumber,
            location: res?.location,
            vehicleType: res?.vehicleType,
            createdAt: res.createdAt,
          };
        });
        setSalesList(salesWithNumber.reverse());
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
      getSalesList.refetch();
      getExpenseList.refetch();
    }
  }, [autheticatedUserId]);

  useEffect(() => {
    const total = salesFilteredByDate
      ?.reverse()
      .map((res) => {
        return res.cost;
      })
      .reduce(function (a, b) {
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
        <i style={{ fontSize: 11, color: "gray" }}>
          The data that will be shown on this page will only be the records of
          the staff that is currently logged in.
        </i>
        <br />
        <br />
        <ControlLabel>Sort by Date </ControlLabel>
        <DateRangePicker
          onChange={([date1, date2]) => {
            setSelectedDateFrom(moment(date1).startOf("day").unix() * 1000);
            setSelectedDateTo(moment(date2).endOf("day").unix() * 1000);
          }}
          placeholder="Select Date Range"
          onClean={() => setSelectedDateFrom(null)}
        />{" "}
        <CheckPicker
          data={REPORTS_ITEMS}
          onChange={(e) => setReportInclusion(e)}
          searchable={false}
          placeholder="Select Included"
          onClean={() => setReportInclusion(null)}
        />{" "}
        <Button
          appearance="primary"
          type="submit"
          style={{ marginRight: 10 }}
          disabled={!selectedDateFrom || !reportInclusion}
          onClick={() =>
            window.open(
              `/print-report?dateFrom=${selectedDateFrom}&dateTo=${selectedDateTo}&inclusion=${reportInclusion}`,
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
            <HeaderCell>Receipt #</HeaderCell>
            <Cell dataKey="receiptNumber" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>BIR #</HeaderCell>
            <Cell dataKey="birNumber" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>DR #</HeaderCell>
            <Cell dataKey="drNumber" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Location</HeaderCell>
            <Cell dataKey="location" />
          </Column>
          <Column flexGrow={100} minWidth={100}>
            <HeaderCell>Vehicle Type</HeaderCell>
            <Cell dataKey="vehicleType" />
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
            <HeaderCell>Vendor/Client</HeaderCell>
            <Cell dataKey="vendor" />
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

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ReportsList);
