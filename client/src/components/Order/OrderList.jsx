import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Panel,
  InputGroup,
  Input,
  Icon,
  Pagination,
  Divider,
} from "rsuite";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import EditOrder from "./EditOrder";
import { useQuery } from "react-query";
import axios from "axios";
import { graphqlUrl } from "../../services/constants";

const OrderList = (props) => {
  const {
    iceTypeContent,
    weightContent,
    scaleContent,
    customerList,
  } = props;
  const { Column, HeaderCell, Cell } = Table;
  const [isEditActive, setIsEditActive] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [newDocu, setNewDocu] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const [newDocuSearch, setNewDocuSearch] = useState([]);
  const [activePageSearch, setActivePageSearch] = useState(1);
  const [orderCountSearch, setOrderCountSearch] = useState(0);
  const [query, setQuery] = useState(`{
    sales(first: 10, after: 0) {
      customerId {
          _id
          description
        },
      _id,
      productId {
        _id,
        iceType,
        weight,
        scaleType,
        cost
      },
      receiptNumber,
      birNumber,
      drNumber
    }
  }`);
  const [querySearch, setQuerySearch] = useState("");

  const getOrderCount = useQuery("OrderCount", async () => {
    const query = `{
      salesCount 
    }`;
    return await axios.post(graphqlUrl, { query });
  });

  const getOrderSearchCount = useQuery(["OrderSearchCount", searchPhrase], async ({ pageParam, queryKey }) => {
    const search = queryKey[1];
    const query = `{
      salesSearchCount(searchPhrase: "${search}")
    }`;
    return await axios.post(graphqlUrl, { query });
  },
  {
    enabled: false,
  });

  const getOrderList = useQuery(["OrderList", querySearch], async ({ pageParam, queryKey }) => {
    const query = queryKey[1];
    return await axios.post(graphqlUrl, { query });
  },
  {
    enabled: false,
  });

  const getOrderList2 = useQuery(
    ["OrderList2", query],
    async ({ pageParam, queryKey }) => {
      const query = queryKey[1];
      return await axios.post(graphqlUrl, { query });
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (getOrderList.isSuccess) {
      if (
        !getOrderList.data.data?.errors &&
        getOrderList.data.data?.data?.salesSearch
      ) {
        const sales = getOrderList.data.data?.data?.salesSearch;
        const isPageNumberExist = newDocuSearch.find(
          (res) => res.pageNumber === activePageSearch
        );
        if (!isPageNumberExist) {
          let counter = (activePageSearch - 1) * 10;
          const newProduct = sales?.map((res, i) => {
            counter++;
            return {
              number: counter,
              description: res.customerId?.description,
              iceType: res.productId?.iceType,
              weight: res.productId?.weight,
              scaleType: res.productId?.scaleType,
              cost: res.productId?.cost,
              receiptNumber: res.receiptNumber,
              birNumber: res.birNumber ? res.birNumber : "---",
              drNumber: res.drNumber ? res.drNumber : "---",
            };
          });
          setNewDocuSearch([
            ...newDocuSearch,
            { pageNumber: activePageSearch, data: newProduct },
          ]);
        }
      }
    }
  }, [getOrderList.data]);

  useEffect(() => {
    if (getOrderList2.isSuccess) {
      if (
        !getOrderList2.data.data?.errors &&
        getOrderList2.data.data?.data?.sales
      ) {
        const sales = getOrderList2.data.data?.data?.sales;
        const isPageNumberExist = newDocu.find(
          (res) => res.pageNumber === activePage
        );
        if (!isPageNumberExist) {
          let counter = (activePage - 1) * 10;
          const newProduct = sales?.map((res, i) => {
            counter++;
            return {
              number: counter,
              description: res.customerId?.description,
              iceType: res.productId?.iceType,
              weight: res.productId?.weight,
              scaleType: res.productId?.scaleType,
              cost: res.productId?.cost,
              receiptNumber: res.receiptNumber,
              birNumber: res.birNumber ? res.birNumber : "---",
              drNumber: res.drNumber ? res.drNumber : "---",
            };
          });
          setNewDocu([
            ...newDocu,
            { pageNumber: activePage, data: newProduct },
          ]);
        }
      }
    }
  }, [getOrderList2.data]);

  useEffect(() => {
    if (searchPhrase !== "" && searchPhrase.length > 2) {
      setSearchProducts([]);
      setOrderCountSearch(0);
      setNewDocuSearch([])
      setActivePageSearch(1)
      setQuerySearch(`{
        salesSearch(searchPhrase: "${searchPhrase}", first: 10, after: 0 ) {
          customerId {
              _id
              description
            },
          _id,
          productId {
            _id,
            iceType,
            weight,
            scaleType,
            cost  
          },
          receiptNumber,
          birNumber,
          drNumber
        }
      }`);
    }
  }, [searchPhrase]);

  useEffect(() => {
    if(querySearch !== "") {
      getOrderList.refetch();
      getOrderSearchCount.refetch();
    }
  }, [querySearch])

  useEffect(() => {
    const isPageNumberExist = newDocu.find(
      (res) => res.pageNumber === activePage
    );
    if (!isPageNumberExist) {
      getOrderList2.refetch();
    }
  }, [activePage]);

  useEffect(() => {
    const current = newDocu.find((res) => res.pageNumber === activePage);
    if (current) {
      setProducts(current.data);
    }
  }, [activePage, newDocu]);

  useEffect(() => {
    const current = newDocuSearch.find((res) => res.pageNumber === activePageSearch);
    if (current) {
      setSearchProducts(current.data);
    }
  }, [activePageSearch, newDocuSearch]);

  useEffect(() => {
    if (getOrderCount.isSuccess) {
      if (
        !getOrderCount.data.data?.errors &&
        getOrderCount.data.data?.data?.salesCount
      ) {
        const count = getOrderCount.data.data?.data?.salesCount;
        setOrderCount(Math.ceil(count / 10));
      }
    }
  }, [getOrderCount.data]);

  useEffect(() => {
    if (getOrderSearchCount.isSuccess) {
      if (
        !getOrderSearchCount.data.data?.errors &&
        getOrderSearchCount.data.data?.data?.salesSearchCount
      ) {
        const count = getOrderSearchCount.data.data?.data?.salesSearchCount;
        setOrderCountSearch(Math.ceil(count / 10));
      }
    }
  }, [getOrderSearchCount.data]);

  const newPage = (pageNumber) => {
    setQuery(`{
      sales(first: 10, after: ${(pageNumber - 1) * 10} ) {
        customerId {
            _id
            description
          },
        _id,
        productId {
          _id,
          iceType,
          weight,
          scaleType,
          cost  
        },
        receiptNumber,
        birNumber,
        drNumber
      }
    }`);
    setActivePage(pageNumber);
  };

  const newPageSearch = (pageNumber) => {
    setQuerySearch(`{
      salesSearch(searchPhrase: "${searchPhrase}", first: 10, after: ${(pageNumber - 1) * 10} ) {
        customerId {
            _id
            description
          },
        _id,
        productId {
          _id,
          iceType,
          weight,
          scaleType,
          cost  
        },
        receiptNumber,
        birNumber,
        drNumber
      }
    }`);
    setActivePageSearch(pageNumber);
  };

  const renderEdit = () => {
    if (!isEditActive) {
      return (
        <Panel bordered style={{ margin: "10px" }}>
          <InputGroup>
            <Input
              placeholder="Search customer"
              onChange={(e) => setSearchPhrase(e)}
            />
            <InputGroup.Button>
              <Icon icon="search" />
            </InputGroup.Button>
          </InputGroup>
          <Table
            height={400}
            data={searchPhrase !== "" ? searchProducts : products}
          >
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>#</HeaderCell>
              <Cell dataKey="number" />
            </Column>
            <Column flexGrow={100} minWidth={50}>
              <HeaderCell>DR</HeaderCell>
              <Cell dataKey="drNumber" />
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
                      onClick={() =>
                        window.open(
                          `/receipt?receiptNumber=${rowData.receiptNumber}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      Print Receipt
                    </a>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <Divider />
          {searchPhrase === "" ? (
            <Pagination
              pages={orderCount}
              prev={true}
              maxButtons={10}
              next={true}
              onSelect={newPage}
              ellipsis={true}
              boundaryLinks={true}
              activePage={activePage}
            />
          ) : (
            <Pagination
              pages={orderCountSearch}
              prev={true}
              maxButtons={10}
              next={true}
              onSelect={newPageSearch}
              ellipsis={true}
              boundaryLinks={true}
              activePage={activePageSearch}
            />
          )}
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
