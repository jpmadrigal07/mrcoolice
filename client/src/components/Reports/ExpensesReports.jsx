import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {
    Table,
    DatePicker,
    ControlLabel
} from 'rsuite'
function ExpensesReports(props) {
    const { expenseList } = props
    const { Column, HeaderCell, Cell } = Table
    const [selectedDate, setSelectedDate] = useState()
    const [sortedDate, setSortedDate] = useState([])

    useEffect(() => {
        setSortedDate(expenseList.filter((expense) => moment.unix(parseInt(expense.createdAt) / 1000).startOf('day') == selectedDate))
        console.log(selectedDate)
    }, [selectedDate])

    return (
        <div>
            <ControlLabel>Sort by Date</ControlLabel>
            <DatePicker 
                onChange={(e) => setSelectedDate(moment(e).startOf('day').unix() * 1000)} 
                style={{ marginLeft: 10, width: 150 }}
                oneTap
            />
            <Table
                height={400}
                data={selectedDate ? sortedDate : expenseList}
            >
                <Column width={200}>
                    <HeaderCell>Expense name</HeaderCell>
                    <Cell dataKey="name" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Cost</HeaderCell>
                    <Cell dataKey="cost" />
                </Column>
            </Table>
        </div>
    )
}

export default ExpensesReports
