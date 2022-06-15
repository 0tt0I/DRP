import RenderResult from 'next/dist/server/render-result';
import React, { useEffect, useState } from 'react';
import { OnResultFunction, QrReader } from 'react-qr-reader';
import { auth } from '../firebase';
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
            const newCust = (await checkNewCustomer(
                qrString,
                (auth.currentUser) ? auth.currentUser!.uid : '')).newUser

            switch (newCust) {
                case -1:
                    setData("Invalid QR-code")
                    break;
                case 0:
                    setData("This customer has had a discount before...")
                    break;
                case 1:
                    setData("This is a new customer! Treat them to a discount")
                    break;
                case 2:
                    setData("This referral is for a different business.")
                default:
                    break;
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