import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'V Mart',
//     description: 'The best place for shopping!',
//     imageUrl:
//       'https://lh3.googleusercontent.com/p/AF1QipNNBlyaYbH7EMYPNqaSKgd8wmtjcgTU8wbcGfax=s1600-w400',
//     address: '716, Mangalam Marriage Hall, Medical College Road, Shahpur, Gorakhpur, Uttar Pradesh 273001',
//     location: {
//       lat: 26.77368,
//       lng: 83.3813757
//     },
//     creator: 'u1'
//   }
// ];

const UserPlaces = () => {
	const [loadedPlaces, setLoadedPlaces] = useState();
	const {isLoading, error, sendRequest, clearError} = useHttpClient();
	const userId = useParams().userId;

    useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/user/${userId}`
				);
				setLoadedPlaces(responseData.places);
			}
			catch(err) {}
		};
		fetchPlaces();
	}, [sendRequest, userId]);
	
	const placeDeletedHandler = deletedPlaceId => {
		setLoadedPlaces(prevPlaces => 
			prevPlaces.filter(place => 
				place.id !== deletedPlaceId
			)
		);
	};

    return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && 
				<div className="center">
					<LoadingSpinner asOverlay/>
				</div>}
			{!isLoading && loadedPlaces && 
				<PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
		</React.Fragment>
    );
};

export default UserPlaces;
