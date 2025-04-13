import React from 'react';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Button from '../components/Button'; // Import Button

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
      <Card>
        <div className="flex items-center space-x-6">
          <Avatar
            src="https://via.placeholder.com/150/771796" // Placeholder image
            alt="User Avatar"
            size="lg"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Jane Doe</h3>
            <p className="text-gray-500">Software Engineer</p>
            <Button variant="secondary" className="mt-2" onClick={() => alert('Edit Profile!')}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <Card title="About Me">
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </Card>

       <Card title="Contact Information">
         <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Email: jane.doe@example.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Location: San Francisco, CA</li>
         </ul>
          <Button className="mt-4">Update Contact</Button>
       </Card>
    </div>
  );
};

export default ProfilePage;
