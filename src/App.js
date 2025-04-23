import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScanType } from 'html5-qrcode';

import "./App.css";

const App = () => {
  const [treeData, setTreeData] = useState(null);
  const [scanner, setScanner] = useState();

  useEffect(() => {
    if (!treeData) {
      const scannerInstance = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10,
          qrbox: {width: 250, height: 250},
          rememberLastUsedCamera: true, 
        },  
        false
    );

    scannerInstance.render(
      (decodedText) => 
      {
        try 
        {
          const tree = JSON.parse(decodedText);
          setTreeData(tree);
          scannerInstance.clear(); // Stop scanner after successful scan
        } 
        catch (e) 
        {
          console.error("Invalid QR Code");
        }
      },
      (error) => console.error(error)
    );

      setScanner(scannerInstance);
      console.log(scannerInstance);

      return () => {
        scannerInstance.clear().catch((err) =>
          console.error("Error clearing scanner:", err)
        );
      };
    }
  }, [treeData]);

  const clickHandler = () => {
    setTreeData(null); // Reset scanned data to re-enable scanner
  };

  return (
    <div className="container">
      <h1 className="header-title">🌳 Tree QR Scanner 🌳</h1>

      {!treeData && <div id="qr-reader" className="scanner-box"></div>}

      {treeData && (
        <div className="tree-info">
          <h2>{treeData.english_name} ({treeData.marathi_name})</h2>
          <p><strong>ID:</strong> {treeData.id}</p>
          <p><strong>Species:</strong> {treeData.species}</p>
          <p><strong>Age:</strong> {treeData.age}</p>
          <p><strong>Ecological Importance:</strong> {treeData.ecological_significance}</p>
          <p><strong>Maintenance Tips:</strong> {treeData.maintenance}</p>
          <p><strong>Total in Campus:</strong> {treeData.count_in_campus}</p>
          <button className="scan-btn" onClick={clickHandler}>
            🔄 Scan QR
          </button>
        </div>
      )}
    </div>
  );
};

export default App; 
