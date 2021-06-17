import React from 'react'
import { useState, useEffect } from 'react'
import {
  Table
} from 'rsuite'
import { useMutation } from 'react-query'
import { triggerTopAlert } from '../../actions/topAlertActions';
import { connect } from 'react-redux';
import axios from "axios";
import EditCustomer from './EditCustomer';

const CustomerList = (props) => {
  const { customerList, triggerTopAlert } = props
  const { Column, HeaderCell, Cell } = Table
  const [isEditActive, setIsEditActive] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const deleteCustomer = useMutation((query) =>
    axios.post("http://localhost:5000/mrcoolice", { query })
  );
  const handleRemove = (id) => {
    deleteCustomer.mutate(
      `mutation{
        deleteCustomer(_id: "${id}") {
            description
        }
      }`
    )
    triggerTopAlert(true, "Customer successfully deleted", "success")
  }
  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Table
          height={400}
          data={customerList}
        >
          <Column width={70} align="center" fixed>
            <HeaderCell>#</HeaderCell>
            <Cell dataKey="number" />
          </Column>
          <Column width={200} fixed>
            <HeaderCell>Customer description</HeaderCell>
            <Cell dataKey="description" />
          </Column>
          <Column width={120} fixed="right">
            <HeaderCell>Action</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <span>
                    <a onClick={() => {setIsEditActive(!isEditActive); setCustomerId(rowData._id)}}>
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
      return <EditCustomer 
        isEditActive={isEditActive} 
        setIsEditActive={setIsEditActive}
        customerId={customerId} 
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

export default connect(mapStateToProps, { triggerTopAlert })(CustomerList);
