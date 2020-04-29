import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Adi Ksh',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTi5Z_HsL_dybcvjfB4IAaLYPH9xkwGl4hN-mP1Rdr5zzKW58EV&usqp=CAU',
      places: 1
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
