import React, { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import EditProduct from "./EditProduct";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import axios from "axios";
import { connect } from "react-redux";
import { GRAPHQL_ENDPOINT } from "../../services/constants";

const ProductList = (props) => {
  const { userId, triggerTopAlert, userType } = props;
  const [isEditActive, setIsEditActive] = useState(false);
  const [productId, setProductId] = useState("");
  const [productList, setProductList] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  const getProductList = useQuery("getProductList", async () => {
    const query = `{
        products {
            _id
            iceType,
            weight,
            scaleType,
            cost
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
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
        getProductList.data.data?.data?.products
      ) {
        const product = getProductList.data.data?.data?.products;
        const productWithNumber = product?.reverse().map((res, index) => {
          return {
            id: index + 1,
            ...res,
          };
        });
        setProductList(productWithNumber);
      }
    }
  }, [getProductList.data]);

  const deleteProduct = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const remove = (id) => {
    deleteProduct.mutate(
      `mutation{
        deleteProduct(_id: "${id}") {
            weight
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
          <Table height={400} data={productList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
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
            <Column flexGrow={100} minWidth={100} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  if(userType === "Admin") {
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
                        |{"  "}
                        <a onClick={() => remove(rowData._id)}>Remove</a>
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ cursor: "pointer" }}>
                        <a onClick={() => remove(rowData._id)}>Remove</a>
                      </span>
                    );
                  }
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
          productId={productId}
          userId={userId}
          productList={productList}
        />
      );
    }
  };
  return <div>{renderProduct()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(ProductList);
