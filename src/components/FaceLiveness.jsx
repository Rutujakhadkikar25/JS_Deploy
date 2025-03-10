import React from "react";
import { useEffect } from "react";
import { Loader } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";

function FaceLiveness({ faceLivenessAnalysis,jwtToken,latitude,
  longitude,
  radius,
  overrideFlag,
  distance }) {
  const [loading, setLoading] = React.useState(true);
  const [sessionId, setSessionId] = React.useState(null);
  const endpoint =`/api/`;
  const Prodendpoint=import.meta.env.VITE_API_AWS_URL
  useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await fetch(Prodendpoint + "createfacelivenesssession");
      const data = await response.json();
      setSessionId(data.sessionId);
      setLoading(false);
    };
    fetchCreateLiveness();
  }, []);
 
  const handleAnalysisComplete = async () => {
    try {
        const response = await fetch(`/api/scenario4/getfacelivenesssessionresults`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ 
              sessionId: sessionId,
              latitude,
              longitude,
              radius,
              overrideFlag,
              distance,
            }),
        });
        const data = await response.json();
        
        if (data.body?.face_liveness_result?.Confidence !== undefined) {
            faceLivenessAnalysis(data.body?.face_liveness_result?.Confidence,data);
            console.log(data.body.face_liveness_result?.Confidence)
        } else {
            throw new Error("Confidence not found in response");
        }
    } catch (error) {
        console.error("Error fetching liveness results:", error);
    }
};


  return loading ? (
    <Loader />
  ) : (
    <FaceLivenessDetector
      sessionId={sessionId}
      region="us-east-1"
      onAnalysisComplete={handleAnalysisComplete}
      onError={(error) => console.error(error)}
    />
  );
}

export default FaceLiveness;


