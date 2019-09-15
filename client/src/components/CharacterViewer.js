import React, {useState, useEffect} from 'react';
import { postData, getAuthenticatedData } from '../utils';
import * as SpriteAnimator from 'react-sprite-animator';
import CharacterCustomizer from './CharacterCustomizer';
import { Link } from "react-router-dom";

const CharacterViewer = (props) => {
    const [error, setError] =  useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isNewUser, setIsNewUser] = useState(false)
    const [characterDefinition, setCharacterDefinition] = useState({})
    const [image, setImage] = useState(null)
    const [customizeCharacter, setCustomizeCharacter] = useState(false)
    useEffect(() => {
      getAuthenticatedData("/api/child/character", props.token)
        .then(
          (result) => {
            if (result === "Unauthorized") {
              setError("User does not exist");
              return;
            }
            const data = JSON.parse(result).characterDefinition;
            setIsLoaded(true);
            setCharacterDefinition(JSON.parse(result).characterDefinition);
            if (Object.entries(data).length === 0 && data.constructor === Object) {
              setIsNewUser(true);
            } else {
              loadSprite(data);
            }
          },
          (error) => {
            setIsLoaded(false)
            setError(error)
          }
        )
    },[])

    const loadSprite = (data) => {
      const row = data.animation;
      delete data.gender;
      delete data.animation;
      console.log(characterDefinition);
      postData("/sprites/layer",{
        layers: Object.values(data).sort(),
        row:row
      })
      .then(
        (result) => {
          setImage(result)
        },
        (error) => {
          setError(error)
        }
      )
    }

    if (isLoaded) {
      if (isNewUser) {
        return (
          <CharacterCustomizer token={props.token} newUser={true} characterDefinition={{}} />
        );
      } else {
        if (customizeCharacter) {
          console.log(characterDefinition);
          return (
            <CharacterCustomizer token={props.token} newUser={false} characterDefinition={characterDefinition} setCustomizeCharacter={(value, data) => {setCustomizeCharacter(value); loadSprite(data);}}/>
          );
        } else {
          return (
            <div>
              <SpriteAnimator
                sprite={image}
                width={64}
                height={64}
                fps={8}
                scale={0.1}
              />
              <button onClick={() => setCustomizeCharacter(true)}>Customize Character</button>
            </div>
          );
        }
      }
    } else {
      if (error) {
        return(
          <div>
            <h1>{error}</h1>
            <Link to="/">
              <button type="button" className="btn btn-primary m-3 mt-5">
                <h3 className="m-0">Home</h3>
              </button>
            </Link>
          </div>
        );
      } else {
        return (
          <div>
            <h1>Loading...</h1>
          </div>
        );
      }
    }
}

export default CharacterViewer;
