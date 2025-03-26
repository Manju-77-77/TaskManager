import React, { useState } from 'react';
import { Bell, Edit2, Github, Globe, Instagram, MapPin, MessageSquare, Phone, Smartphone, Twitter, User, Facebook } from 'lucide-react';

const UserProfile = () => {
  // Sample user data with gender
  const [userData, setUserData] = useState({
    avatar: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid",
    displayName: "John Doe",
    fullName: "Kenneth Valdez",
    title: "Full Stack Developer",
    location: "Bay Area, San Francisco, CA",
    email: "fip@jukmu.al",
    phone: "(239) 816-9029",
    mobile: "(320) 380-4539",
    address: "Bay Area, San Francisco, CA",
    website: "https://bootdey.com",
    github: "bootdey",
    twitter: "@bootdey",
    instagram: "bootdey",
    facebook: "bootdey",
    gender: "Male" // Added gender field
  });

  // Sample task progress data
  const [taskProgress, setTaskProgress] = useState([
    { name: "Web Design", progress: 80 },
    { name: "Website Markup", progress: 72 },
    { name: "One Page", progress: 89 },
    { name: "Mobile Template", progress: 55 },
    { name: "Backend API", progress: 66 }
  ]);

  // Sample performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    tasksCompleted: 48,
    tasksInProgress: 12,
    overdueTasks: 3,
    onTimeCompletionRate: 94,
    averageTaskTime: "2.3 days"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...userData});

  const handleEditToggle = () => {
    if (isEditing) {
      setUserData({...editData});
    } else {
      setEditData({...userData});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  // Calculate overall performance score (example metric)
  const overallScore = Math.round(
    (performanceMetrics.onTimeCompletionRate * 0.6) +
    ((performanceMetrics.tasksCompleted / (performanceMetrics.tasksCompleted + performanceMetrics.tasksInProgress + performanceMetrics.overdueTasks)) * 100 * 0.4)
  );

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      {/* Breadcrumb navigation */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - User info & social */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold">{userData.displayName}</h2>
            <p className="text-gray-600">{userData.title}</p>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <MapPin size={14} /> {userData.location}
            </p>

            <div className="flex gap-2 mt-4">

            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="font-semibold text-gray-700 mb-4">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="text-gray-600" size={20} />
                <span className="text-gray-600 w-24">Website</span>
                <a href={userData.website} className="text-blue-500 hover:underline">{userData.website.replace('https://', '')}</a>
              </div>
              <div className="flex items-center gap-3">
                <Github className="text-gray-600" size={20} />
                <span className="text-gray-600 w-24">GitHub</span>
                <a href={`https://github.com/${userData.github}`} className="text-blue-500 hover:underline">{userData.github}</a>
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="text-gray-600" size={20} />
                <span className="text-gray-600 w-24">Twitter</span>
                <a href={`https://twitter.com/${userData.twitter.replace('@', '')}`} className="text-blue-500 hover:underline">{userData.twitter}</a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="text-gray-600" size={20} />
                <span className="text-gray-600 w-24">Instagram</span>
                <a href={`https://instagram.com/${userData.instagram}`} className="text-blue-500 hover:underline">{userData.instagram}</a>
              </div>
              <div className="flex items-center gap-3">
                <Facebook className="text-gray-600" size={20} />
                <span className="text-gray-600 w-24">Facebook</span>
                <a href={`https://facebook.com/${userData.facebook}`} className="text-blue-500 hover:underline">{userData.facebook}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Center column - User details & edit */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700">Profile Information</h2>
              <button 
                onClick={handleEditToggle} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${isEditing ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
              >
                {isEditing ? 'Save' : <><Edit2 size={16} /> Edit</>}
              </button>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={editData.fullName} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={editData.email} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                {/* Remove Phone input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={editData.gender} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input 
                    type="text" 
                    name="mobile" 
                    value={editData.mobile} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={editData.address} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={editData.title} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{userData.gender}</p> {/* Display Gender */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium flex items-center gap-2">
                    <Smartphone size={16} className="text-gray-500" />
                    {userData.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{userData.title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Task progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center text-sm text-teal-600 mb-1">
                <span className="mr-2">assignment</span>
                <h3 className="font-semibold text-gray-700">Project Status</h3>
              </div>
              <div className="space-y-4 mt-4">
                {taskProgress.map((task, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{task.name}</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center text-sm text-teal-600 mb-4">
                <span className="mr-2">assignment</span>
                <h3 className="font-semibold text-gray-700">Performance Metrics</h3>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{overallScore}%</span>
                  </div>
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${overallScore}, 100`}
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Tasks Completed</p>
                  <p className="text-xl font-bold text-green-600">{performanceMetrics.tasksCompleted}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">In Progress</p>
                  <p className="text-xl font-bold text-blue-600">{performanceMetrics.tasksInProgress}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Overdue Tasks</p>
                  <p className="text-xl font-bold text-red-600">{performanceMetrics.overdueTasks}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">On-time Rate</p>
                  <p className="text-xl font-bold text-teal-600">{performanceMetrics.onTimeCompletionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6 mt-4">
            <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-blue-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                  <Bell size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Completed "Mobile App Homepage Design"</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-green-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                  <User size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Assigned to "API Integration Project"</p>
                  <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-orange-100 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                  <MessageSquare size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Commented on "Dashboard UI Revamp"</p>
                  <p className="text-sm text-gray-500">Monday at 10:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
