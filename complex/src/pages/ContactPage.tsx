import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with message:', message);
    setMessage(''); // Clear message after submit
  };

  return (
    <div>
      <h1>Contact Page</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
