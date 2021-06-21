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

function Receipt(props) {
  const { triggerTopAlert } = props;
  const [cust, setCust] = useState("---");
  const [staff, setStaff] = useState("---");
  const [orders, setOrders] = useState([]);
  const receiptNumber = 72754;
  const getOrders = useQuery("getOrders", async () => {
    const query = `{
            sales(receiptNumber: ${receiptNumber}) {
                userId {
                    firstName,
                    lastName
                },
                customerId {
                    description
                },
                iceType,
                weight,
                scaleType,
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
        const orders = getOrders.data.data?.data?.sales;
        if (orders.length > 0) {
          const firstValue = orders[0];
          setCust(firstValue.customerId.description);
          setStaff(
            `${firstValue.userId.firstname} ${firstValue.userId.lastName}`
          );

          const newOrders = orders.map((res) => {
            // const costPerKilo = res.scaleType === "kg" ?
            return {
              values: `${res.weight} ${res.scaleType} ${res.iceType}`,
            };
          });
        }
      }
    }
    if (getOrders.isError) {
      triggerTopAlert(true, "Unknown error occured", "danger");
    }
  }, [getOrders.data]);
  return (
    <div>
      <Navigation currentPage={""} />
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
          <tr>
            <td style={{ width: "70%" }}>500 kg Ice</td>
            <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
              P312,343.00
            </td>
          </tr>
          <tr>
            <td style={{ width: "70%" }}>500 kg Ice</td>
            <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
              P312,343.00
            </td>
          </tr>
          <tr>
            <td style={{ width: "70%" }}>500 kg Ice</td>
            <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
              P312,343.00
            </td>
          </tr>
        </table>
        <hr id="lineTotal" />
        <table style={{ width: "100%", fontSize: "8px" }}>
          <tr>
            <td style={{ width: "70%" }}>Total</td>
            <td style={{ width: "30%", textAlign: "right", fontWeight: "600" }}>
              P500.00
            </td>
          </tr>
        </table>
        <hr id="lineDivider" />
        <p style={{ fontSize: "8px", lineHeight: "10px", fontWeight: "400" }}>
          THIS IS AN OFFICIAL RECEIPT AND THIS SHALL BE VALID FOR FIVE(5) YEARS
          FROM THE DATE OF PERMIT TO USE.
        </p>
        <br />
        <p style={{ fontSize: "8px", lineHeight: "10px", fontWeight: "400" }}>
          ----
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = (global) => ({});

export default connect(mapStateToProps, { triggerTopAlert })(Receipt);
