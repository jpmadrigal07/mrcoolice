import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {
    Table,
    DatePicker,
    ControlLabel,
    Panel
} from 'rsuite'
function SalesReports(props) {
    const { salesList } = props
    const { Column, HeaderCell, Cell } = Table
    const [selectedDate, setSelectedDate] = useState()
    const [sortedByDate, setSortedByDate] = useState([])

    useEffect(() => {
        setSortedByDate(salesList.filter((expense) => moment.unix(parseInt(expense.createdAt) / 1000).startOf('day') == selectedDate))
    }, [selectedDate])

    return (
        <Panel bordered style={{margin: 10}}> 
            <ControlLabel>Sort by Date</ControlLabel>
            <DatePicker
                onChange={(e) => setSelectedDate(moment(e).startOf('day').unix() * 1000)}
                style={{ marginLeft: 10, width: 150 }}
                oneTap
            />
            <Table
                data={selectedDate ? sortedByDate : salesList}
            >
                <Column width={70} align="center">
                    <HeaderCell>#</HeaderCell>
                    <Cell dataKey="number" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Customer</HeaderCell>
                    <Cell dataKey="customerId.description" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Ice Type</HeaderCell>
                    <Cell dataKey="iceType" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Weight</HeaderCell>
                    <Cell dataKey="weight" />
                </Column>
                <Column width={200}>
                    <HeaderCell>Scale Type</HeaderCell>
                    <Cell dataKey="scaleType" />
                </Column>
            </Table>
        </Panel>
    )
}

export default SalesReports
