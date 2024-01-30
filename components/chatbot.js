import React, { useState, useEffect } from 'react';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

    // Handle other tasks as needed
    const response = await fetch(backendURL + '/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, task: selectedTask }),
    });

    if (response.ok) {
      const data = await response.json();
      const botMessage = { text: data.response, type: 'bot' };
      setConversation([...conversation, botMessage]);
      setMessage('');
    }
  };

  const handleTaskClick = (taskNumber) => {
    // When a task button is clicked, set the selected task and prompt user for input
    setSelectedTask(taskNumber);

    if (taskNumber === '1') {
      // User has selected "Add An Employee" task, provide information required
      const employeeInfoMessage = {
        text: 'Please provide the following information to add an employee:\n' +
          '- First Name\n' +
          '- Last Name\n' +
          '- Date of Birth (DOB)\n' +
          '- Gender\n' +
          '- Phone Number\n' +
          '- Email\n' +
          '- Image URL\n' +
          '- Salary\n' +
          '- Job Role',
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
                item.text.includes('Please provide the following information') ? (
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
