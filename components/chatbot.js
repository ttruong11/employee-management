import React, { useState, useEffect } from 'react';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const employeeInfoQuestions = [
    'First Name',
    'Last Name',
    'Date of Birth (DOB)',
    'Gender',
    'Phone Number',
    'Email',
    'Image URL',
    'Salary',
    'Job Role',
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  // Define the handleTaskClick function within the ChatBot component
  const handleTaskClick = (taskNumber) => {
    // When a task button is clicked, set the selected task and prompt user for input
    setSelectedTask(taskNumber);

    if (taskNumber === '1' && currentQuestionIndex < employeeInfoQuestions.length) {
      // User has selected "Add An Employee" task, ask for employee information
      const currentQuestion = employeeInfoQuestions[currentQuestionIndex];
      const employeeInfoMessage = {
        text: `Please provide ${currentQuestion}:`,
        type: 'bot',
      };
      // Display the employee information message and clear the other messages
      setConversation([employeeInfoMessage]);
    } else {
      // Clear the conversation by initializing it with a message for the selected task
      setConversation([
        {
          text: `Task ${taskNumber} selected.`,
          type: 'bot',
        },
      ]);
    }
  };
  
  const handleSendMessage = async () => {
    const userMessage = { text: message, type: 'user' };
    setConversation([...conversation, userMessage]);

    if (!selectedTask) {
      // No task selected, prompt user to select a task
      const selectTaskMessage = {
        text: 'Please select a task by typing the task number (e.g., "1" for Add An Employee):',
        type: 'bot',
      };
      setConversation([...conversation, selectTaskMessage]);
      return;
    }

    if (selectedTask === '1' && currentQuestionIndex < employeeInfoQuestions.length) {
      // User has selected "Add An Employee" task, ask for employee information
      const currentQuestion = employeeInfoQuestions[currentQuestionIndex];
      const employeeInfoMessage = {
        text: `Please provide ${currentQuestion}:`,
        type: 'bot',
      };
      setConversation([...conversation, employeeInfoMessage]);

      // Update the responses object with the user's response
      const updatedResponses = { ...userResponses, [currentQuestion]: message };
      setUserResponses(updatedResponses);

      // Increment the currentQuestionIndex to move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessage('');
      return;
    }

    if (selectedTask === '1' && currentQuestionIndex < employeeInfoQuestions.length) {
      // User has selected "Add An Employee" task, ask for employee information
      const currentQuestion = employeeInfoQuestions[currentQuestionIndex];
      const employeeInfoMessage = {
        text: `Please provide ${currentQuestion}:`,
        type: 'bot',
      };
    
      // Check if the current conversation already contains the employeeInfoMessage
      if (!conversation.some((item) => item.text === employeeInfoMessage.text)) {
        // Add the employeeInfoMessage only if it's not already in the conversation
        setConversation((prevConversation) => [...prevConversation, employeeInfoMessage]);
      }
    
      // Update the responses object with the user's response
      const updatedResponses = { ...userResponses, [currentQuestion]: message };
      setUserResponses(updatedResponses);
    
      // Increment the currentQuestionIndex to move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessage('');
      return;
    } else if (selectedTask === '1' && currentQuestionIndex === employeeInfoQuestions.length) {
      // User has provided all required information, proceed to submit the data
      const payload = { responses: userResponses, task: selectedTask };
      console.log('Sending payload to backend:', payload); // Debugging line
      const response = await fetch(backendURL + '/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const data = await response.json();
        const botMessage = { text: data.response, type: 'bot' };
        setConversation([...conversation, botMessage]);
        setMessage('');
    
        // Clear userResponses and reset the currentQuestionIndex when the employee record is inserted successfully
        setUserResponses({});
        setCurrentQuestionIndex(0);
      }
    } else {
      // Clear the conversation by initializing it with a message for the selected task
      setConversation([
        {
          text: `Task ${taskNumber} selected.`,
          type: 'bot',
        },
      ]);
    }    
  };

  // useEffect to send a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = {
      text: 'Welcome to the ChatBot! I can help you with the following tasks:',
      type: 'bot',
    };
    setConversation([welcomeMessage]);

    // Define the tasks with buttons
    const tasks = [
      { number: '1', description: 'Add An Employee' },
      // Add more tasks as needed
    ];

    // Add each task as a button
    tasks.forEach((task) => {
      const taskMessage = { text: `${task.number}. ${task.description}`, type: 'bot' };
      setConversation((prevConversation) => [...prevConversation, taskMessage]);
    });
  }, []);

  return (
    <div className='chatbot-container'>
      <div className='chat-window'>
        {conversation.map((item, index) => (
          <div key={index} className={item.type}>
            {item.type === 'bot' ? (
              // Check if the message contains "selected." or "Welcome to the ChatBot" and render it as plain text
              item.text.includes('selected.') || item.text.includes('Welcome to the ChatBot') ? (
                <div>{item.text}</div>
              ) : (
                // Render task selection buttons
                item.text.includes('Please provide') ? (
                  <div>{item.text}</div>
                ) : (
                  <button
                    onClick={() => handleTaskClick(item.text.split('. ')[0])} // Extract task number
                  >
                    {item.text}
                  </button>
                )
              )
            ) : (
              item.text
            )}
          </div>
        ))}
      </div>
      <div className='message-input'>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
