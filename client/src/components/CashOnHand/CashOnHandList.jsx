import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel, InputGroup, Input, Icon } from "rsuite";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import axios from "axios";
import EditCashOnHand from "./EditCashOnHand";
import { GRAPHQL_ENDPOINT } from "../../services/constants";
import moment from "moment";

const CashOnHandList = (props) => {
  const { triggerTopAlert, userType } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [cashOnHandId, setCashOnHandId] = useState("");
  const [cashOnHandList, setCashOnHandList] = useState([]);

  useEffect(() => {
    if (!isEditActive) {
      getCashOnHandList.refetch();
    }
  }, [isEditActive]);

  const getCashOnHandList = useQuery("getCashOnHandList", async () => {
    const query = `{
        cashOnHands {
            _id,
            amount,
            createdAt
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getCashOnHandList.isSuccess) {
      if (
        !getCashOnHandList.data.data?.errors &&
        getCashOnHandList.data.data?.data?.cashOnHands
      ) {
        const cash = getCashOnHandList.data.data?.data?.cashOnHands;
        const cashOnHandWithNumber = cash?.reverse().map((res, index) => {
          return {
            id: index + 1,
            description: res.customerId?.description,
            createdAtFormatted: moment.unix(res.createdAt / 1000).format("MM/DD/YYYY"),
            type: res.isIn ? "Payment" : "Credit",
            ...res,
          };
        });
        setCashOnHandList(cashOnHandWithNumber);
      }
    }
  }, [getCashOnHandList.data]);

  const deleteCashOnHand = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const remove = (id) => {
    deleteCashOnHand.mutate(
      `mutation{
        deleteCashOnHand(_id: "${id}") {
            _id
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteCashOnHand.isSuccess) {
      if (!deleteCashOnHand.data?.data?.errors) {
        getCashOnHandList.refetch();
        deleteCashOnHand.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteCashOnHand.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteCashOnHand.isError) {
      triggerTopAlert(true, deleteCashOnHand.error.message, "danger");
    }
  }, [deleteCashOnHand]);

  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={cashOnHandList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Amount</HeaderCell>
              <Cell dataKey="amount" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Date Created</HeaderCell>
              <Cell dataKey="createdAtFormatted" />
            </Column>
            <Column flexGrow={100} minWidth={50} fixed="right">
              <HeaderCell>Action</HeaderCell>
              <Cell>
                {(rowData) => {
                  if(userType === "Admin") {
                    return (
                      <span style={{ cursor: "pointer" }}>
                        <a
                          onClick={() => {
                            setIsEditActive(!isEditActive);
                            setCashOnHandId(rowData._id);
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
        <EditCashOnHand
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          cashOnHandId={cashOnHandId}
          cashOnHandList={cashOnHandList}
        />
      );
    }
  };
  return <div>{renderEdit()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(CashOnHandList);
