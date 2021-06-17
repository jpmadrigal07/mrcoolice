import React from 'react'
import { useState, useEffect } from 'react'
import {
  Table
} from 'rsuite'
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';
import { connect } from 'react-redux';
import axios from "axios";
import EditOrder from './EditOrder';

const OrderList = (props) => {
  const { 
    orderList, 
    triggerTopAlert, 
    iceTypeContent,
    weightContent,
    scaleContent,
    customerList 
  } = props
  const { Column, HeaderCell, Cell } = Table
  const [isEditActive, setIsEditActive] = useState(false)
  const [orderId, setOrderId] = useState("")
  const deleteSales = useMutation((query) =>
    axios.post("http://localhost:5000/mrcoolice", { query })
  );
  const handleRemove = (id) => {
    deleteSales.mutate(
      `mutation{
        deleteSale(_id: "${id}") {
          iceType
          weight
        }
      }`
    )
    triggerTopAlert(true, "Order successfully deleted", "success")
  }
  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Table
          height={400}
          data={orderList}
        >
          <Column width={70} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="number" />
          </Column>
          <Column width={200} fixed>
            <HeaderCell>Customer</HeaderCell>
            <Cell dataKey="customerId.description" />
          </Column>
          <Column width={200} fixed>
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
          <Column width={120} fixed="right">
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <span>
                    <a onClick={() => { setOrderId(rowData._id); setIsEditActive(!isEditActive) }}>
                      Edit
                    </a> |{'  '}
                    <a onClick={() => handleRemove(rowData._id)}>
                      Remove
                    </a>
                  </span>
                );
              }}
            </Cell>
          </Column>
        </Table>
      )
    } else {
      return <EditOrder 
        isEditActive={isEditActive} 
        setIsEditActive={setIsEditActive} 
        orderId={orderId}
        orderList={orderList}
        iceTypeContent={iceTypeContent}
        weightContent={weightContent}
        scaleContent={scaleContent}
        customerList={customerList}
      />
    }
  }
  return (
    <div>
      {renderEdit()}
    </div>
  )
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(OrderList);
