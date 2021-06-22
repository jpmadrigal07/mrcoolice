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

function Receipt(props) {
  const { triggerTopAlert } = props;
  const [cust, setCust] = useState("---");
  const [staff, setStaff] = useState("---");
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const { search } = useLocation();
  const receiptNumber = search ? search.replace("?receiptNumber=", "") : "";

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
                }
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
          setCust(firstValue.customerId.description);
          setStaff(
            `${firstValue.userId.firstName} ${firstValue.userId.lastName}`
          );

          const newOrders = orders.map((res) => {
            return {
              value: `${res.productId.weight} ${res.productId.scaleType} ${res.productId.iceType}`,
              cost: res.productId.cost
            };
          });

          const total = orders.map((res) => {
            return res.productId.cost
          }).reduce(function(a, b) { return a + b; }, 0);

          setTotalSales(total)
          setOrders(newOrders)
        }
      }
    }
    if (getOrders.isError) {
      triggerTopAlert(true, "Unknown error occured", "danger");
    }
  }, [getOrders.data]);

  useEffect(() => {
    if(cust && staff && orders.length > 0) {
      window.print()
    }
  }, [cust, staff, orders])

  return (
    <div>
      <Navigation currentPage={""} />
      {receiptNumber ? (
        <div id="receipt">
        <div>
          <p
            style={{ fontWeight: "800", fontSize: "18px", textAlign: "center" }}
          >
            MR. COOL ICE
          </p>
          <p
            style={{ fontWeight: "300", fontSize: "8px", textAlign: "center" }}
          >
            Address: Victoria Woods, Brgy. San Francisco, Victoria Laguna ●
            Telephone: (0997) 1162923, (0947) 8129639
          </p>
          <hr id="lineDivider" />
          <p style={{ fontSize: "10px", lineHeight: "13px" }}>
            <span style={{ fontWeight: "700" }}>RCPT#:</span> {receiptNumber}
            <br />
            <span style={{ fontWeight: "700" }}>DATE:</span>{" "}
            {moment().format("MM/DD/YYYY hh:mm A")}
            <br />
            <span style={{ fontWeight: "700" }}>CUST:</span> {cust}
            <br />
            <span style={{ fontWeight: "700" }}>STAFF:</span> {staff}
          </p>
          <br />
        </div>
        <table style={{ width: "100%", fontSize: "8px" }}>
          {orders.map((_, i) => {
            return (<tr>
              <td style={{ width: "70%", fontSize: 15 }}>{_.value} ice</td>
              <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
                P{_.cost.toLocaleString()}
              </td>
            </tr>)
          })}
        </table>
        <hr id="lineTotal" />
        <table style={{ width: "100%", fontSize: "8px" }}>
          <tr>
            <td style={{ width: "70%" }}>Total</td>
            <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
              P{totalSales.toLocaleString()}
            </td>
          </tr>
        </table>
        <hr id="lineDivider" />
        
        <br />
        <p style={{ fontSize: "8px", lineHeight: "10px", fontWeight: "400" }}>
          ----
        </p>
      </div>
      ) : <h5>No receipt number.</h5> }
    </div>
  );
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(Receipt);
