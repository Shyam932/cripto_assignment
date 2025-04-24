// File: src/components/SocialLogins.jsx
import React from "react";

const oauthProviders = [
  { name: "Google", url: "http://localhost:5000/api/auth/google", color: "bg-red-500" },
  { name: "Facebook", url: "http://localhost:5000/api/auth/facebook", color: "bg-blue-600" },
  { name: "LinkedIn", url: "http://localhost:5000/api/auth/linkedin", color: "bg-blue-700" },
  { name: "Twitter", url: "http://localhost:5000/api/auth/twitter", color: "bg-sky-400" },
];

const SocialLogins = () => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {oauthProviders.map((provider) => (
        <a
          key={provider.name}
          href={provider.url}
          className={`flex items-center justify-center py-2 text-white rounded-md ${provider.color} hover:opacity-90`}
        >
          Continue with {provider.name}
        </a>
      ))}
    </div>
  );
};

export default SocialLogins;
