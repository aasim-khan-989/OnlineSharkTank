export const isAuthenticated=():boolean=>{
    const token = localStorage.getItem("jwtToken");
    return token ?true:true
};

export const isProfileComplete = (): boolean => {
    // return true
    // Retrieve from localStorage or backend if the profile is complete
    return localStorage.getItem('profileCompleted') === 'true';
  };

 