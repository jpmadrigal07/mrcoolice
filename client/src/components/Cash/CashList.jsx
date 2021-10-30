import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel } from "rsuite";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import axios from "axios";
import EditCash from "./EditCash";
import { GRAPHQL_ENDPOINT } from "../../services/constants";
import moment from "moment";

const CashList = (props) => {
  const { triggerTopAlert, userType } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [cashId, setCashId] = useState("");
  const [cashList, setCashList] = useState([]);

  useEffect(() => {
    if (!isEditActive) {
      getCashList.refetch();
    }
  }, [isEditActive]);

  const getCashList = useQuery("getCashList", async () => {
    const query = `{
        cashes {
            _id,
            onePeso,
            fivePeso,
            tenPeso,
            twentyPeso,
            fiftyPeso,
            oneHundredPeso,
            twoHundredPeso,
            fiveHundredPeso,
            oneThousandPeso,
            createdAt
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getCashList.isSuccess) {
      if (
        !getCashList.data.data?.errors &&
        getCashList.data.data?.data?.cashes
      ) {
        const cash = getCashList.data.data?.data?.cashes;
        const cashWithNumber = cash?.reverse().map((res, index) => {
          return {
            id: index + 1,
            createdAtFormatted: moment.unix(res.createdAt / 1000).format("MM/DD/YYYY"),
            ...res,
          };
        });
        setCashList(cashWithNumber);
      }
    }
  }, [getCashList.data]);

  const deleteCash = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const remove = (id) => {
    deleteCash.mutate(
      `mutation{
        deleteCash(_id: "${id}") {
            _id
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteCash.isSuccess) {
      if (!deleteCash.data?.data?.errors) {
        getCashList.refetch();
        deleteCash.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteCash.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteCash.isError) {
      triggerTopAlert(true, deleteCash.error.message, "danger");
    }
  }, [deleteCash]);

  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <Table height={400} data={cashList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>One Peso</HeaderCell>
              <Cell dataKey="onePeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Five Peso</HeaderCell>
              <Cell dataKey="fivePeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Ten Peso</HeaderCell>
              <Cell dataKey="tenPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Twenty Peso</HeaderCell>
              <Cell dataKey="twentyPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Fifty Peso</HeaderCell>
              <Cell dataKey="fiftyPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>One Hundred Peso</HeaderCell>
              <Cell dataKey="oneHundredPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Two Hundred Peso</HeaderCell>
              <Cell dataKey="twoHundredPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Five Hundred Peso</HeaderCell>
              <Cell dataKey="fiveHundredPeso" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>One Thousand Peso</HeaderCell>
              <Cell dataKey="oneThousandPeso" />
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
                            setCashId(rowData._id);
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
        <EditCash
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          cashId={cashId}
          cashList={cashList}
        />
      );
    }
  };
  return <div>{renderEdit()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(CashList);
