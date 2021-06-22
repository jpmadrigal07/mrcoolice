import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel, Row, Col } from "rsuite";
import { useMutation } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import axios from "axios";
import EditOrder from "./EditOrder";
import { graphqlUrl } from "../../services/constants";

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
  const deleteSales = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );
  const handleRemove = (id) => {
    deleteSales.mutate(
      `mutation{
        deleteSale(_id: "${id}") {
          iceType
          weight
        }
      }`
    );
    triggerTopAlert(true, "Order successfully deleted", "success");
  };
  useEffect(() => {
    const newProduct = orderList.map((res, i) => {
      return {
        number: i+1,
        description: res.customerId.description,
        iceType: res.productId.iceType,
        weight: res.productId.weight,
        scaleType: res.productId.scaleType,
        cost: res.productId.cost,
        receiptNumber: res.receiptNumber
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
              <HeaderCell>Cost Type</HeaderCell>
              <Cell dataKey="cost" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Receipt Number</HeaderCell>
              <Cell dataKey="receiptNumber" />
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
