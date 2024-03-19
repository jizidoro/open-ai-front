import React, { useEffect, useState, useRef } from 'react';

const StreamPage = () => {
  const [display, setDisplay] = useState('');
  const messageBuffer = useRef(''); // Using useRef to keep a mutable buffer
  const intervalRef = useRef(null); // To keep reference of the interval

  const appendToBuffer = (data: string) => {
    messageBuffer.current += data; // Add new data to the buffer
  };

  useEffect(() => {
    // Set up the EventSource connection
    const eventSource = new EventSource('https://localhost:44304/api/v1/open-ai-playground/stream');

    eventSource.onmessage = (event) => {
      appendToBuffer(event.data); // Append incoming data to the buffer
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    // Set up an interval to update the display from the buffer
    intervalRef.current = setInterval(() => {
      if (messageBuffer.current.length > 0) {
        // Take the first character from the buffer and add it to the display
        setDisplay(display => display + messageBuffer.current.charAt(0));
        // Remove the first character from the buffer
        messageBuffer.current = messageBuffer.current.substring(1);
      }
    }, 50); // Update every 10ms

    return () => {
      eventSource.close();
      clearInterval(intervalRef.current); // Clear the interval on cleanup
    };
  }, []);

  return (
    <div>
      <h2>Live Stream Data</h2>
      <p>{display}</p> {/* Display the accumulated text */}
    </div>
  );
};

export default StreamPage;