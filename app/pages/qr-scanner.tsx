import RenderResult from 'next/dist/server/render-result';
import React, { useEffect, useState } from 'react';
import { OnResultFunction, QrReader } from 'react-qr-reader';
import { checkNewCustomer } from '../services/businessQrScan';


export default function QRScanner () {
  const [data, setData] = useState("no result")
  const [qrString, setQrString] = useState("")

    const handleResult: OnResultFunction = async (result, error) => {
        if (result) {
            setQrString(result.getText())
        }

        if (error) {
            console.info(error);
        }
    }

    useEffect(() => {
        async function updateData() {
            const newCust = (await checkNewCustomer(qrString)).newUser
            if (newCust == -1) {
                setData("Invalid QR-code")
            } else {
                if (newCust) {
                    setData("This is a new customer! Treat them to a discount")
                } else {
                    setData("This customer has had a discount before...")
                }
            }
        }

        console.log("effect used")
        updateData()

    }, [qrString])


  return (
    <div>
      <QrReader
        onResult={handleResult}
        videoStyle={{ width: "100%" }}
        constraints={{ facingMode: 'user' }}
      />
      <p>{data}</p>
    </div>
  );
}