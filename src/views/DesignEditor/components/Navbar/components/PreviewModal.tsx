import React, { useState } from "react";
import PreviewALl from "../../Preview/TestPreview";

interface props {
    isClose: () => void;

}

export default function PreviewModal({isClose}:props)  {



 
  return (
    <div>
      
       <div className="w-screen right-0 z-50 absolute top-0 h-screen bg-purple-500">
        <button onClick={isClose} className="btn btn-warning">Close </button>
        <PreviewALl />
       </div>
        
    </div>
  );
}