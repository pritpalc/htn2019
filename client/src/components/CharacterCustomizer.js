import React, {useState, useEffect} from 'react';
import { postData, postAuthenticatedData } from '../utils';
import * as SpriteAnimator from 'react-sprite-animator';

const CharacterCustomizer = (props) => {
    const [error, setError] =  useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [characterDefinition, setCharacterDefinition] = useState(props.characterDefinition)
    const [image, setImage] = useState(null)
    useEffect(() => {
      fetch("/sprites")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setItems(result)
          loadSprite()
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
    },[])

    const loadSprite = () => {
      const row = characterDefinition.animation;
      let data = {...characterDefinition};
      delete data.gender;
      delete data.animation;
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

    const saveSprite = () => {
      postAuthenticatedData("/api/child/character", {
        characterDefinition
      }, props.token)
      .then(
        (result) => {
          console.log(result);
          props.setCustomizeCharacter(false, characterDefinition);
        },
        (error) => {
          setError(error)
        }
      )
    }

    const x = () => {
      let output = [];
      const gender = characterDefinition.gender;
      for(const category in items){
        output.push(<h4>{category}</h4>)
        for (const el of items[category][gender]) {
          const val = category+"/"+gender+"/"+el;
          output.push(
            <div>
              <input 
                // onChange={() => characterDefinition[category] = val} 
                onChange={() => {let data = {... characterDefinition}; data[category] = val; setCharacterDefinition(data)}}
                type="radio" id={el} 
                name={category} 
                value={category + "/" + gender + "/" + el}
                checked={characterDefinition[category] === val}
              />
              <label htmlFor={el}>{el}</label>
            </div>
          );
        }
      }
      return output;
    }

    const y = () => {
      let output = [];
      for (let i=1; i<21; i++) {
        output.push(
          <div>
            <input onChange={() => {let data = {... characterDefinition}; data.animation = i; setCharacterDefinition(data)}} type="radio" id={i} name="Animation" value={i} checked={characterDefinition.animation === i}/>
            <label htmlFor={i}>{i}</label>
          </div>
        )
      }
      return output;
    }

    if (isLoaded) {
      if (props.newUser) {
        return(
          <div>
            <form id="choices">
              <h4>Gender</h4>
              <div>
                <input 
                  // onChange={() => setCharacterDefinition({"gender": "male", "animation": 1})} 
                  onChange={() => {let data = {... characterDefinition}; data.gender = "male"; data.animation = 1; setCharacterDefinition(data)}}
                  type="radio" 
                  id="male" 
                  name="gender" 
                  value="male"
                  checked={characterDefinition.gender === "male"}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input 
                  // onChange={() => setCharacterDefinition({"gender": "female", "animation": 1})} 
                  onChange={() => {let data = {... characterDefinition}; data.gender = "female"; data.animation = 1; setCharacterDefinition(data)}}
                  type="radio" 
                  id="female" 
                  name="gender" 
                  value="female"
                  checked={characterDefinition.gender === "female"}
                />
                <label htmlFor="female">Female</label>
              </div>
              {characterDefinition.gender && x()}
              <div>
                <h4>Animation</h4>
                {characterDefinition.animation && y()}
              </div>
            </form>
            <button onClick={loadSprite}>Update Character</button>
            <SpriteAnimator
              sprite={image}
              width={64}
              height={64}
              fps={8}
              scale={0.1}
            />
            <button onClick={saveSprite}>Save and Exit</button>
            {/* <img src="/sprites/pants/male/magenta_pants_male.png" width={64} height={64}/> */}
          </div>
        );
      } else {
        return (
          <div>
            <form id="choices">
              <h4>Gender</h4>
              <div>
                <input 
                  // onChange={() => characterDefinition.gender = "male"} 
                  onChange={() => {let data = {... characterDefinition}; data.gender = "male"; setCharacterDefinition(data)}}
                  type="radio" 
                  id="male" 
                  name="gender" 
                  value="male" 
                  checked={characterDefinition.gender === "male"}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div>
                <input 
                  // onChange={() => characterDefinition.gender = "female"} 
                  onChange={() => {let data = {... characterDefinition}; data.gender = "female"; setCharacterDefinition(data)}}
                  type="radio" 
                  id="female" 
                  name="gender" 
                  value="female" 
                  checked={characterDefinition.gender === "female"}
                />
                <label htmlFor="female">Female</label>
              </div>
              {characterDefinition.gender && x()}
              <div>
                <h4>Animation</h4>
                {characterDefinition.animation && y()}
              </div>
            </form>
            <button onClick={loadSprite}>Update Character</button>
            <SpriteAnimator
              sprite={image}
              width={64}
              height={64}
              fps={8}
              scale={0.1}
            />
            <button onClick={saveSprite}>Save and Exit</button>
            {/* <img src="/sprites/pants/male/magenta_pants_male.png" width={64} height={64}/> */}
          </div>
        );
      }
    } else {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
}

export default CharacterCustomizer;
