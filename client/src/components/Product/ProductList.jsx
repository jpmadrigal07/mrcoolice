import React, { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import EditProduct from "./EditProduct";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import axios from "axios";
import { connect } from "react-redux";
import { graphqlUrl } from "../../services/constants";

const ProductList = (props) => {
  const { userId, triggerTopAlert } = props;
  const [isEditActive, setIsEditActive] = useState(false);
  const [expenseId, setProductId] = useState("");
  const [expenseList, setProductList] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  const getProductList = useQuery("getProductList", async () => {
    const query = `{
        expenses {
            _id
            name
            cost
        }
      }`;
    return await axios.post(graphqlUrl, { query });
  });

  useEffect(() => {
    if (!isEditActive) {
      getProductList.refetch();
    }
  }, [isEditActive]);

  useEffect(() => {
    if (getProductList.isSuccess) {
      if (
        !getProductList.data.data?.errors &&
        getProductList.data.data?.data?.expenses
      ) {
        const expenses = getProductList.data.data?.data?.expenses;
        const expensesWithNumber = expenses?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setProductList(expensesWithNumber);
      }
    }
  }, [getProductList.data]);

  const deleteProduct = useMutation((query) =>
    axios.post(graphqlUrl, { query })
  );

  const remove = (id) => {
    deleteProduct.mutate(
      `mutation{
        deleteProduct(_id: "${id}") {
            name
            cost
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteProduct.isSuccess) {
      if (!deleteProduct.data?.data?.errors) {
        getProductList.refetch();
        deleteProduct.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteProduct.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteProduct.isError) {
      triggerTopAlert(true, deleteProduct.error.message, "danger");
    }
  }, [deleteProduct]);

  const renderProduct = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={expenseList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column flexGrow={100} minWidth={100}>
              <HeaderCell>Product name</HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column flexGrow={100} minWidth={100}>
              <HeaderCell>Cost</HeaderCell>
              <Cell dataKey="cost" />
            </Column>
            <Column flexGrow={100} minWidth={100} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  return (
                    <span style={{ cursor: "pointer" }}>
                      <a
                        onClick={() => {
                          setIsEditActive(!isEditActive);
                          setProductId(rowData._id);
                        }}
                      >
                        Edit
                      </a>{" "}
                      {"  "}|{"  "}
                      <a onClick={() => remove(rowData._id)}>Remove</a>
                    </span>
                  );
                }}
              </Cell>
            </Column>
          </Table>
        </Panel>
      );
    } else {
      return (
        <EditProduct
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          expenseId={expenseId}
          userId={userId}
          expenseList={expenseList}
        />
      );
    }
  };
  return <div>{renderProduct()}</div>;
};

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(ProductList);
