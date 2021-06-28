import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import "./Receipt.css";
import uniqBy from 'lodash/uniqBy'

const ReceiptNew = ({ cust, staff, orders, remappedNewOrder, birNumber, receiptNumber }) => {
  const [remappedOrders, setRemappedOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  useEffect(() => {
    if (orders.length > 0) {
      const total = orders
        .map((res) => {
          return res.cost;
        })
        .reduce(function (a, b) {
          return a + b;
        }, 0);
      setTotalSales(total);

      const uniqOrder = uniqBy(orders, "_id")
      const newOrders = uniqOrder.map(res => {
        const foundOrder = orders.filter(res2 => res2._id === res._id);
        return {
          count: foundOrder.length,
          ...res
        }
      })

      setRemappedOrders(newOrders)
    } else {
      setTotalSales(0);
    }
  }, [orders]);
  return (
    <>
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
            Address: Victoria Woods, Brgy. San Francisco, Victoria Laguna ●
            Telephone: (0997) 1162923, (0947) 8129639
          </p>
          <hr id="lineDivider" />
          <p style={{ fontSize: "10px", lineHeight: "13px" }}>
            <span style={{ fontWeight: "700" }}>RCPT#:</span> {receiptNumber}
            <br />
            <span style={{ fontWeight: "700" }}>BIR#:</span> {birNumber}
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
          {remappedOrders && remappedOrders.length > 0
            ? remappedOrders
                .map((_, i) => {
                  if (_.cost) {
                    return (
                      <tr>
                        <td style={{ width: "70%", fontSize: 10 }}>
                         x{_.count} {`${_.weight} ${_.scaleType} ${_.iceType}`} ice
                        </td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          P{_.cost*_.count.toLocaleString()}
                        </td>
                      </tr>
                    );
                  }
                })
                .filter((res) => res)
            : null}
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
        <p style={{ fontSize: "8px", lineHeight: "10px", fontWeight: "400" }}>
          ----
        </p>
      </div>
    </>
  );
};

export default ReceiptNew;
