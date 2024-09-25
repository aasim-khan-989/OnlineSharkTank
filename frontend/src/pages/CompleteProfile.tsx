import { useState } from 'react';

export const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userType: '', // Entrepreneur, Investor, or Visitor
    aadhar: '',
    gstNumber: '',
    businessDescription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form logic here (e.g., send data to backend)
    console.log(formData);
    // Redirect to homepage after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded"
              required
            />
          </div>

          {/* User Type (Entrepreneur, Investor, Visitor) */}
          <div className="mb-4">
            <label className="block text-gray-700">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded"
              required
            >
              <option value="">Select user type</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>

          {/* Conditional fields based on userType */}
          {formData.userType === 'entrepreneur' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Aadhar Number</label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Business Description</label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border w-full rounded"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
};


