import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);

  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if(identifiedPlace) {
      setFormData({
        title: {
          value: identifiedPlace.title,
          isValid: true
        },
        description: {
          value: identifiedPlace.description,
          isValid: true
        }
      },true);
    }
    setIsLoading(false);
  },
  [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if(isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
