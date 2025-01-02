import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useRef } from 'react';

const Wallet_Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const session_id = params.get('session_id'); // Extract the session_id from the URL

  console.log(session_id);

  // Ref to track if the request has already been made
  const hasCalled = useRef(false);

  useEffect(() => {
    const handle_success_wallet = async () => {
      if (!session_id) {
        console.error("Session ID is missing");
        return;
      }

      if (hasCalled.current) {
        console.log("Request already made, skipping...");
        return;
      }

      hasCalled.current = true; // Mark that the request has been made

      try {
        const res = await axios.get(`http://localhost:3000/user/handle_successful_payment/${session_id}`);
        if (res.status === 200) {
          console.log('Successfully added...');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Wrap the function call in a setTimeout to avoid strict mode duplicate calls
    const timeoutId = setTimeout(() => {
      if (session_id && !hasCalled.current) {
        handle_success_wallet();
      }
    }, 0);

    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, [session_id]); // Dependency array includes session_id

  return (
    <div>
      <h1>Amount Added Successfully</h1>
      <a href="/profile/wallet">Go to Wallet</a>
    </div>
  );
};

export default Wallet_Success;
