import React from 'react'
import { useState } from 'react'
import Navigation from '../../components/Navigation/Navigation'

function Receipt(props) {
    const {} = props
    const [order, setOrder] = useState([])
    const dateNow = Date.now();
    console.log(dateNow)
    return (
        <div>
        <Navigation currentPage={"reports"} />
            <div style="text-align: center;">
                <h1>MR. COOL ICE</h1>
                <h3 style="margin-top: -20px; font-weight: normal;">
                    Victoria Woods
                    <br />
                    Brgy. San Francisco, Victoria Laguna
                    <br />
                    Tel: (0997) 1162923 ● (0947) 8129639
                </h3>
            </div>
            <div style="display: inline-block;">
                <h2>DELIVERY RECEIPT</h2>
                <h3 style="font-weight: normal;">SOLD TO:_____________</h3>
                <h3 style="font-weight: normal;">Vehicle no.:___________</h3>
            </div>
            <div style="float: right;">
                <h2 style="font-weight: normal;">Order number</h2>
                <h3 style="font-weight: normal;">Date:__________</h3>
                <h3 style="font-weight: normal;">Time:__________</h3>
            </div>
            <div style="text-align: center; padding-bottom: 40vh; border-top: 0.5px solid gray; border-bottom: 0.5px solid gray;">
                <table style="border-collapse: collapse;">
                    <th>Qty.</th>
                    <th style="padding-left: 36.5vw; padding-right: 36.5vw;">Articles</th>
                    <th>Total kgs.</th>
                </table>
            </div>
            <div style="float: right;">
                <h4 style="font-weight: normal; text-align: center;">Received the above merchandise
                    <br />in good order and condition</h4>
            </div>
            <div style="display: inline-block;">
                <br />
                <br />
                <h3 style="font-weight: normal;">Issued by:_____________</h3>
                <h3 style="font-weight: normal;">Checked by:____________________________</h3>
            </div>
        </div>
    )
}

export default Receipt
