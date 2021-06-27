import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import "./Receipt.css";

const ReceiptNew = ({ cust, staff, remappedNewOrder, birNumber, receiptNumber }) => {
  const [totalSales, setTotalSales] = useState(0);
  useEffect(() => {
    if (remappedNewOrder.length > 0) {
      const total = remappedNewOrder
        .map((res) => {
          return res.cost;
        })
        .reduce(function (a, b) {
          return a + b;
        }, 0);
      setTotalSales(total);
    } else {
      setTotalSales(0);
    }
  }, [remappedNewOrder]);
  console.log(remappedNewOrder)
  console.log(remappedNewOrder)
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
          {remappedNewOrder && remappedNewOrder.length > 0
            ? remappedNewOrder
                .map((_, i) => {
                  if (_.cost) {
                    return (
                      <tr>
                        <td style={{ width: "70%", fontSize: 10 }}>
                         x{_.quantity} {`${_.weight} ${_.scaleType} ${_.iceType}`} ice
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
