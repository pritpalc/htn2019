import React, {useState, useEffect} from 'react';
import { postData, postAuthenticatedData } from '../utils';
import * as SpriteAnimator from 'react-sprite-animator';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

const Gallery = (props) => {
  const handleOnDragStart = e => e.preventDefault()
  return (
    <AliceCarousel mouseDragEnabled >
      {props.children}
    </AliceCarousel>
  )
}

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
      const {gender, animation, ...data} = characterDefinition
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

      const responsive = {}
      for(let i = 0,j=1; i <=1024; i += 64,j+=1){
        responsive[i] = {items:j}
      }
      const gender = characterDefinition.gender;
      return ( <div> {Object.keys(items).map(category => <div>
          <h4>{category}</h4>
          <AliceCarousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            items={items[category][gender].map(el => {
              const val = category+"/"+gender+"/"+el;
              return <div>
                <figure className="cropped-image">
                    <img src={"/sprites/" + val} />
                  </figure>
              </div>})}
          />
        </div>)
      }</div>
      )
      /*
      for(const category in items){
        output.push(<h4>{category}</h4>)

        for (const el of items[category][gender]) {
          
          output.push(
            <div>
              <input 
                onChange={() => {let data = {... characterDefinition}; data[category] = val; setCharacterDefinition(data)}}
                type="radio" id={el} 
                name={category} 
                value={category + "/" + gender + "/" + el}
                checked={characterDefinition[category] === val}
              />
              <label htmlFor={el}>
                <figure className="cropped-image">
                  <img src={"/sprites/" + val} />
                </figure>
              </label>
            </div>
          );
        }
      }
      return output;*/
    }

    const y = () => {
      let output = [];
      const animationNames = ["Spellcast", "Thrust", "Walk", "Slash", "Shoot"];
      const animationPositions = ["Back", "Left", "Front", "Right"];
      for (let i=0; i<animationNames.length; i++) {
        for (let j=0; j< animationPositions.length; j++) {
          const id = animationPositions.length*i+j;
          output.push(
            <div>
              <input onChange={() => {let data = {... characterDefinition}; data.animation = id; setCharacterDefinition(data)}} type="radio" id={id} name="Animation" value={id} checked={characterDefinition.animation === id}/>
              <label htmlFor={id}>{animationNames[i] + " " + animationPositions[j]}</label>
            </div>
          )
        }
      }
      output.push(
        <div>
          <input onChange={() => {let data = {... characterDefinition}; data.animation = 20; setCharacterDefinition(data)}} type="radio" id={20} name="Animation" value={20} checked={characterDefinition.animation === 20}/>
          <label htmlFor={20}>Hurt</label>
        </div>
      )
      return output;
    }

    if (isLoaded) {
      if (props.newUser) {
        return(
          <div className="w-100">
            <form id="choices">
              <h4>Gender</h4>
              <div>
                <input 
                  onChange={() => setCharacterDefinition({...characterDefinition, gender:'male', animation:1})}
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
                  onChange={() => setCharacterDefinition({...characterDefinition, gender:'male', animation:1})}
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
              scale={0.2}
            />
            <button onClick={saveSprite}>Save and Exit</button>
          </div>
        );
      } else {
        return (
          <div className="w-100">
            <form id="choices">
              <h4>Gender</h4>
              <div>
                <input 
                  onChange={() => setCharacterDefinition({...characterDefinition, gender:'male'})}
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
                  onChange={() => setCharacterDefinition({...characterDefinition, gender:'female'})}
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
                {characterDefinition !== {} && y()}
              </div>
            </form>
            <button onClick={loadSprite}>Update Character</button>
            <SpriteAnimator
              sprite={image}
              width={64}
              height={64}
              fps={8}
              scale={0.2}
            />
            <button onClick={saveSprite}>Save and Exit</button>
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
