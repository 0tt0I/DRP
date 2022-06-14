import RenderResult from 'next/dist/server/render-result';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { checkNewCustomer } from '../services/businessQrScan';

export default function QRScanner () {
  const [data, setData] = useState("no result");

  return (
    <>
      <QrReader
        onResult={async (result, error) => {
          if (result) {
            setData(result.getText())
            setData((await checkNewCustomer(data)).discount)
          }

          if (!!error) {
            console.info(error);
          }
        }}
        videoStyle={{ width: '100%' }}
        constraints={{ facingMode: 'user' }}
      />
      <p>{data}</p>
    </>
  );
};