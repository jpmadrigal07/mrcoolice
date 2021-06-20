import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {
    Table,
    DatePicker,
    ControlLabel,
    Panel
} from 'rsuite'
import axios from "axios";
import { useQuery } from "react-query";

function ReportsList() {
    const { Column, HeaderCell, Cell } = Table
    const [expenseList, setExpenseList] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [selectedDate, setSelectedDate] = useState()
    const [expenseFilteredByDate, setExpenseFilteredByDate] = useState([])
    const [salesFilteredByDate, setSalesFilteredByDate] = useState([])

    const getExpenseList = useQuery(
        "getExpenseList",
        async () => {
            const query = `{
                expenses {
                    _id
                    name
                    cost
                    createdAt
                }
              }`;
            return await axios.post("http://localhost:5000/mrcoolice", { query });
        }
    );

    const getSalesList = useQuery(
        "getSalesList",
        async () => {
            const query = `{
            sales {
              customerId {
                  _id
                  description
                }
              _id
              iceType
              weight
              scaleType
              createdAt
            }
          }`;
            return await axios.post("http://localhost:5000/mrcoolice", { query });
        }
    );

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
    }, [
        getExpenseList.data,
        getSalesList.data,
    ]);

    useEffect(() => {
        setExpenseFilteredByDate(expenseList.filter((expense) => moment.unix(parseInt(expense.createdAt) / 1000).startOf('day') == selectedDate))
        setSalesFilteredByDate(salesList.filter((sales) => moment.unix(parseInt(sales.createdAt) / 1000).startOf('day') == selectedDate))
        console.log("sales", salesFilteredByDate)
        console.log("expenses", expenseFilteredByDate)
    }, [selectedDate])

    return (
        <>
            <Panel bordered style={{ margin: 10 }}>
                <ControlLabel>Sort by Date</ControlLabel>
                <DatePicker
                    onChange={(e) => setSelectedDate(moment(e).startOf('day').unix() * 1000)}
                    style={{ marginLeft: 10, width: 150 }}
                    oneTap
                />
                <h5 style={{ marginTop: 20 }}>Expense Report</h5>
                <Table
                    style={{ marginTop: 20 }}
                    data={selectedDate ? expenseFilteredByDate : expenseList}
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
                        <HeaderCell>Cost</HeaderCell>
                        <Cell dataKey="cost" />
                    </Column>
                </Table>
                <hr />
                <h5 style={{ marginTop: 20 }}>Sales Report</h5>
                <Table
                    style={{ marginTop: 20 }}
                    data={selectedDate ? salesFilteredByDate : salesList}
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
                </Table>
            </Panel>
        </>
    )
}

export default ReportsList
