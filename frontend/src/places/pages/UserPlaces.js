import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'V Mart',
    description: 'The best place for shopping!',
    imageUrl:
      'https://lh3.googleusercontent.com/p/AF1QipNNBlyaYbH7EMYPNqaSKgd8wmtjcgTU8wbcGfax=s1600-w400',
    address: '716, Mangalam Marriage Hall, Medical College Road, Shahpur, Gorakhpur, Uttar Pradesh 273001',
    location: {
      lat: 26.77368,
      lng: 83.3813757
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'V Mart 2',
    description: 'The best place for shopping!',
    imageUrl:
      'https://lh3.googleusercontent.com/p/AF1QipNNBlyaYbH7EMYPNqaSKgd8wmtjcgTU8wbcGfax=s1600-w400',
    address: '716, Mangalam Marriage Hall, Medical College Road, Shahpur, Gorakhpur, Uttar Pradesh 273001',
    location: {
      lat: 26.77368,
      lng: 83.3813757
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
