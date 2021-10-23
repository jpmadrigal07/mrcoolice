import React from "react";
import { useState, useEffect } from "react";
import { Table, Panel, InputGroup, Input, Icon } from "rsuite";
import { useMutation, useQuery } from "react-query";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import axios from "axios";
import EditCredit from "./EditCredit";
import { GRAPHQL_ENDPOINT } from "../../services/constants";
import moment from "moment";

const CreditList = (props) => {
  const { triggerTopAlert, userType } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [creditId, setCreditId] = useState("");
  const [creditList, setCreditList] = useState([]);
  const [searchCredits, setSearchCredits] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    if (!isEditActive) {
      getCreditList.refetch();
    }
  }, [isEditActive]);

  const getCreditList = useQuery("getCreditList", async () => {
    const query = `{
        credits {
            _id,
            customerId {
              description
            },
            amount,
            isIn,
            createdAt
        }
      }`;
    return await axios.post(GRAPHQL_ENDPOINT, { query });
  });

  useEffect(() => {
    if (getCreditList.isSuccess) {
      if (
        !getCreditList.data.data?.errors &&
        getCreditList.data.data?.data?.credits
      ) {
        const cash = getCreditList.data.data?.data?.credits;
        const creditWithNumber = cash?.reverse().map((res, index) => {
          return {
            id: index + 1,
            description: res.customerId?.description,
            createdAtFormatted: moment.unix(res.createdAt / 1000).format("MM/DD/YYYY"),
            type: res.isIn ? "Payment" : "Credit",
            ...res,
          };
        });
        setCreditList(creditWithNumber);
      }
    }
  }, [getCreditList.data]);

  const deleteCredit = useMutation((query) =>
    axios.post(GRAPHQL_ENDPOINT, { query })
  );

  const remove = (id) => {
    deleteCredit.mutate(
      `mutation{
        deleteCredit(_id: "${id}") {
            _id
        }
      }`
    );
  };

  useEffect(() => {
    if (deleteCredit.isSuccess) {
      if (!deleteCredit.data?.data?.errors) {
        getCreditList.refetch();
        deleteCredit.reset();
        triggerTopAlert(true, "Successfully deleted", "success");
      } else {
        triggerTopAlert(
          true,
          deleteCredit.data?.data?.errors[0].message,
          "danger"
        );
      }
    }
    if (deleteCredit.isError) {
      triggerTopAlert(true, deleteCredit.error.message, "danger");
    }
  }, [deleteCredit]);

  useEffect(() => {
    if (searchPhrase !== "") {
      const searchCreditList = creditList.filter((res) => {
        return res.description?.toLowerCase()?.includes(searchPhrase.toLowerCase())
      });
      setSearchCredits(searchCreditList);
    }
  }, [searchPhrase]);

  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <InputGroup>
            <Input placeholder="Search customer" onChange={(e) => setSearchPhrase(e)} />
            <InputGroup.Button>
              <Icon icon="search" />
            </InputGroup.Button>
          </InputGroup>
          <Table height={400} data={searchPhrase !== "" ? searchCredits : creditList}>
            <Column>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Customer</HeaderCell>
              <Cell dataKey="description" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Amount</HeaderCell>
              <Cell dataKey="amount" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>Type</HeaderCell>
              <Cell dataKey="type" />
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
                            setCreditId(rowData._id);
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
        <EditCredit
          isEditActive={isEditActive}
          setIsEditActive={setIsEditActive}
          creditId={creditId}
          creditList={creditList}
        />
      );
    }
  };
  return <div>{renderEdit()}</div>;
};

const mapStateToProps = (global) => ({
  userType: global.loggedInUser.userType
});

export default connect(mapStateToProps, { triggerTopAlert })(CreditList);
