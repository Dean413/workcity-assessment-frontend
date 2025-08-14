import React from 'react';

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "10px", fontSize: "14px", color: "#666" }}>
      &copy; {new Date().getFullYear()} Olalekan Bamigboye. All rights reserved.
    </footer>
  );
}
