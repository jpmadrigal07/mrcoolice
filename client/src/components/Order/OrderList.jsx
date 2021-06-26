import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import EditOrder from "./EditOrder";

const OrderList = (props) => {
  const {
    orderList,
    triggerTopAlert,
    iceTypeContent,
    weightContent,
    scaleContent,
    customerList,
  } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const newProduct = orderList?.reverse().map((res, i) => {
      return {
        number: i+1,
        description: res.customerId.description,
        iceType: res.productId.iceType,
        weight: res.productId.weight,
        scaleType: res.productId.scaleType,
        cost: res.productId.cost,
        receiptNumber: res.receiptNumber,
        birNumber: res.birNumber ? res.birNumber : "---"
      }
    })

    setProducts(newProduct);
  }, [])
  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={products}>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="number" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Customer</HeaderCell>
              <Cell dataKey="description" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Ice Type</HeaderCell>
              <Cell dataKey="iceType" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Weight</HeaderCell>
              <Cell dataKey="weight" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Scale Type</HeaderCell>
              <Cell dataKey="scaleType" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Cost</HeaderCell>
              <Cell dataKey="cost" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Receipt #</HeaderCell>
              <Cell dataKey="receiptNumber" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>BIR Receipt #</HeaderCell>
              <Cell dataKey="birNumber" />
            </Column>
            <Column flexGrow={100} minWidth={100} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
              {(rowData) => {
                  return (
              <a
                onClick={() => window.open(`/receipt?receiptNumber=${rowData.receiptNumber}`, "_blank")}
                style={{cursor: 'pointer'}}
              >
                Print Receipt
              </a>
              )}}
              </Cell>
            </Column>
          </Table>
        </Panel>
      );
    } else {
      return (
        <EditOrder
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          orderId={orderId}
          orderList={orderList}
          iceTypeContent={iceTypeContent}
          weightContent={weightContent}
          scaleContent={scaleContent}
          customerList={customerList}
        />
      );
    }
  };
  return <div>{renderEdit()}</div>;
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(OrderList);
