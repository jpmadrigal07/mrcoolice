import React from "react";
import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import "./Receipt.css";
import axios from "axios";
import { useQuery } from "react-query";
import { graphqlUrl } from "../../services/constants";
import { triggerTopAlert } from "../../actions/topAlertActions";
import { connect } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import _, { uniq } from "lodash";
import uniqBy from "lodash/uniqBy";

function Receipt(props) {
  const { triggerTopAlert } = props;
  const [cust, setCust] = useState("---");
  const [staff, setStaff] = useState("---");
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const { search } = useLocation();
  const forValues = ["Cashier", "Guard", "Customer", "Production"];
  const receiptNumber = search ? search.replace("?receiptNumber=", "") : "";
  const [birNumber, setBirNumber] = useState("---");
  const [drNumber, setDrNumber] = useState("---");
  const [location, setLocation] = useState("---");
  const [vehicleType, setVehicleType] = useState("---");
  const [remarks, setRemarks] = useState("---");

  const getOrders = useQuery("getOrders", async () => {
    const query = `{
      salesByReceiptNumber(receiptNumber: ${receiptNumber}) {
                userId {
                    firstName,
                    lastName
                },
                customerId {
                    description
                },
                productId {
                  _id,
                  iceType,
                  weight,
                  scaleType,
                  cost
                },
                birNumber,
                drNumber,
                location,
                vehicleType,
                remarks,
                createdAt
            }
        }`;
    return await axios.post(graphqlUrl, { query });
  });
  useEffect(() => {
    if (getOrders.isSuccess) {
      if (getOrders.data.data?.errors) {
        triggerTopAlert(true, "Unknown error occured", "danger");
      } else {
        const orders = getOrders.data.data?.data?.salesByReceiptNumber;
        if (orders.length > 0) {
          const firstValue = orders[0];
          setCust(firstValue.customerId?.description);
          setStaff(
            `${firstValue.userId.firstName} ${firstValue.userId.lastName}`
          );
          setBirNumber(firstValue.birNumber ? firstValue.birNumber : "---");
          setDrNumber(firstValue.drNumber ? firstValue.drNumber : "---");
          setLocation(firstValue.location ? firstValue.location : "---");
          setVehicleType(firstValue.vehicleType ? firstValue.vehicleType : "---");
          setRemarks(firstValue.remarks ? firstValue.remarks : "---");
          const uniqOrder = uniqBy(orders, "productId._id");
          const newData = uniqOrder.map((res) => {
            const foundOrder = orders.filter(
              (res2) => res2.productId?._id === res.productId?._id
            );
            return {
              count: foundOrder.length,
              ...res,
            };
          });
          const newOrders = newData.map((res) => {
            return {
              value: `x${res.count} ${res.productId?.weight} ${res.productId?.scaleType} ${res.productId?.iceType}`,
              cost: res.productId?.cost * res.count,
            };
          });

          const total = orders
            .map((res) => {
              return res.productId?.cost;
            })
            .reduce(function (a, b) {
              return a + b;
            }, 0);

          setTotalSales(total);
          setOrders(newOrders);
        }
      }
    }
    if (getOrders.isError) {
      triggerTopAlert(true, "Unknown error occured", "danger");
    }
  }, [getOrders.data]);

  useEffect(() => {
    if (cust && staff && orders.length > 0) {
      window.print();
    }
  }, [cust, staff, orders]);

  return (
    <div>
      <Navigation currentPage={""} />
      {receiptNumber ? (
        <>
          {forValues.map((res) => {
            return (
              <div id="receipt">
                <div>
                  <p
                    style={{
                      fontWeight: "800",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    MR. COOL ICE
                  </p>
                  <p
                    style={{
                      fontWeight: "300",
                      fontSize: "8px",
                      textAlign: "center",
                    }}
                  >
                    Address: Victoria Woods, Brgy. San Francisco, Victoria
                    Laguna ● Telephone: (0997) 1162923, (0947) 8129639
                  </p>
                  <hr id="lineDivider" />
                  <p style={{ fontSize: "10px", lineHeight: "13px" }}>
                    <span style={{ fontWeight: "700" }}>RCPT#:</span>{" "}
                    {receiptNumber}
                    <br />
                    <span style={{ fontWeight: "700" }}>DR:</span> {drNumber}
                    <br />
                    <span style={{ fontWeight: "700" }}>BIR#:</span> {birNumber}
                    <br />
                    <span style={{ fontWeight: "700" }}>LOC:</span> {location}
                    <br />
                    <span style={{ fontWeight: "700" }}>VEHICLE:</span> {vehicleType}
                    <br />
                    <span style={{ fontWeight: "700" }}>DATE:</span>{" "}
                    {moment().format("MM/DD/YYYY hh:mm A")}
                    <br />
                    <span style={{ fontWeight: "700" }}>CUST:</span> {cust}
                    <br />
                    <span style={{ fontWeight: "700" }}>STAFF:</span> {staff}
                    <br />
                    <span style={{ fontWeight: "700" }}>RMRKS:</span> {remarks}
                  </p>
                  <br />
                </div>
                <table style={{ width: "100%", fontSize: "8px" }}>
                  {orders.map((_, i) => {
                    return (
                      <tr>
                        <td style={{ width: "70%", fontSize: 10 }}>
                          {_.value} ice
                        </td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          P{_.cost.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </table>
                <hr id="lineTotal" />
                <table style={{ width: "100%", fontSize: "8px" }}>
                  <tr>
                    <td style={{ width: "70%" }}>Total</td>
                    <td
                      style={{
                        width: "30%",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      P{totalSales.toLocaleString()}
                    </td>
                  </tr>
                </table>
                <hr id="lineDivider" />

                <br />
                <p
                  style={{
                    fontSize: "8px",
                    lineHeight: "10px",
                    fontWeight: "400",
                  }}
                >
                  {res}
                  <br/>
                  ----
                </p>
              </div>
            );
          })}
        </>
      ) : (
        <h5>No receipt number.</h5>
      )}
    </div>
  );
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(Receipt);
