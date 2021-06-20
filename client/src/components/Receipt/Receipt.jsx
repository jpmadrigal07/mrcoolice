import React from 'react'
import { useState } from 'react'
import Navigation from '../../components/Navigation/Navigation'
import './Receipt.css'

function Receipt(props) {
    const { receiptNumber, dateCreated, customerDescription, staffName, orderData } = props
    const [order, setOrder] = useState([])
    return (
        <div>
        <Navigation currentPage={""} />
            <div id="receipt">
                <div>
                    <p style={{fontWeight: '800', fontSize: '18px', textAlign: 'center'}}>MR. COOL ICE</p>
                    <p style={{fontWeight: '300', fontSize: '8px', textAlign: 'center'}}>
                        Address: Victoria Woods, Brgy. San Francisco, Victoria Laguna ● Telephone: (0997) 1162923, (0947) 8129639
                    </p>
                    <hr id="lineDivider"/>
                    <p style={{fontSize: '10px', lineHeight: '13px'}}><span style={{fontWeight: '700'}}>RCPT#:</span> 1223345<br/><span style={{fontWeight: '700'}}>DATE:</span> 11/07/1994 09:25 PM<br/><span style={{fontWeight: '700'}}>CUST:</span> KUYA BOYET<br/><span style={{fontWeight: '700'}}>STAFF:</span> TRIXIE C. AGUILA</p>
                    <br/>
                </div>
                    <table style={{width: '100%', fontSize: '8px'}}>
                        <tr>
                            <td style={{width: '70%'}}>500 kg Ice</td>
                            <td style={{width: '30%', textAlign: 'right', fontWeight: '600'}}>P312,343.00</td>
                        </tr>
                        <tr>
                            <td style={{width: '70%'}}>500 kg Ice</td>
                            <td style={{width: '30%', textAlign: 'right', fontWeight: '600'}}>P312,343.00</td>
                        </tr>
                        <tr>
                            <td style={{width: '70%'}}>500 kg Ice</td>
                            <td style={{width: '30%', textAlign: 'right', fontWeight: '600'}}>P312,343.00</td>
                        </tr>
                    </table>
                    <hr id="lineTotal"/>
                    <table style={{width: '100%', fontSize: '8px'}}>
                        <tr>
                            <td style={{width: '70%'}}>Total</td>
                            <td style={{width: '30%', textAlign: 'right', fontWeight: '600'}}>P500.00</td>
                        </tr>
                    </table>
                    <hr id="lineDivider"/>
                    <p style={{fontSize: '8px', lineHeight: '10px', fontWeight: '400'}}>THIS IS AN OFFICIAL RECEIPT AND THIS SHALL BE VALID FOR FIVE(5) YEARS FROM THE DATE OF PERMIT TO USE.</p>
                    <br/>
                    <p style={{fontSize: '8px', lineHeight: '10px', fontWeight: '400'}}>----</p>
            </div>
        </div>
    )
}

export default Receipt
