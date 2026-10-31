 const init = async () => {
    try {
      // 1. Try local first
      let currentUser: any = null;
      const sessionRaw = localStorage.getItem('legend_session') || localStorage.getItem('legend_current_user');
      
      if (sessionRaw) {
        try {
          const parsed = JSON.parse(sessionRaw);
          currentUser = parsed?.id ? parsed : null;
          if (!currentUser && parsed) currentUser = { id: sessionRaw };
        } catch {
          currentUser = { id: sessionRaw };
        }
      }

      const usersRaw = localStorage.getItem('legend_users');
      const allUsers = JSON.parse(usersRaw||'[]');
      
      if (!currentUser && allUsers.length > 0) {
        // fallback to first user for testing
        currentUser = allUsers[0];
      }

      // 2. If still no user, DON'T redirect immediately on GitHub Pages
      // Check if we have any user at all
      if (!currentUser) {
        console.log("No session found, staying on page with empty data");
        setUser({ id: 'guest', referralCode: 'GUEST' });
        return;
      }

      setUser(currentUser);

      // Build team
      const l1 = allUsers.filter((u:any) => u?.referredBy === currentUser.id);
      const l2 = allUsers.filter((u:any) => l1.some((a:any) => a?.id === u?.referredBy));
      const l3 = allUsers.filter((u:any) => l2.some((a:any) => a?.id === u?.referredBy));
      setTeam({ l1, l2, l3 });

    } catch(e) { 
      console.error(e);
      setUser({ id: 'guest', referralCode: 'GUEST' });
    }
  }
  init();
},[]);
Did you set that in your LoginPage?
