import RenderResult from 'next/dist/server/render-result';
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export default function QRScanner () {
  const [data, setData] = useState("no result");

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            setData(result.getText());
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