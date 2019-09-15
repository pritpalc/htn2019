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
    const constantFeatures = (gender) => ({eyes:"eyes/"+gender+"/"+items.eyes[gender][0], facial:undefined, nose:"nose/"+gender+"/"+items.nose[gender][0]})
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
      postAuthenticatedData("/api/child/character", 
        {characterDefinition:{...characterDefinition, ...constantFeatures(characterDefinition.gender)}}
      , props.token)
      .then(
        (result) => {
          console.log(result);
          props.setCustomizeCharacter(false, {...characterDefinition, ...constantFeatures(characterDefinition.gender)});
        },
        (error) => {
          setError(error)
        }
      )
    }
    const x = () => {
      let output = [];
      
      const gender = characterDefinition.gender;
      const responsive = {}
      for(let i = 0,j=1; i <=1024; i += 64,j+=1){
        responsive[i] = {items:j}
      }
      
      return(
        <div> 
          {Object.keys(items).filter(catagory => Object.keys(constantFeatures(gender)).indexOf(catagory) === -1)
            .map(category => 
            <div>
              <h4 className="text-capitalize">{category}</h4>
              <AliceCarousel
                responsive={responsive}
                infinite={true}
                autoPlay={false}
                items={items[category][gender].map(el => {
                  const val = category+"/"+gender+"/"+el;
                  return (
                    <div onClick={() => setCharacterDefinition({...characterDefinition, [category]: val})} onDragStart={e => e.preventDefault()}>
                      <figure className={"cropped-image"+(characterDefinition[category] === val?" highlighted":"")}>
                        <img src={"/sprites/" + val} />
                      </figure>
                    </div>
                  )
                })}
              />
            </div>
          )}
        </div>
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
            <option value={id}>{animationNames[i] + " " + animationPositions[j]}</option>
          )
        }
      }
      output.push(
        <option value={20}>Hurt</option>
      )
      return (
        <select className="mb-3" value={characterDefinition.animation} onChange={(event) => setCharacterDefinition({...characterDefinition, animation: event.target.value})}>
          {output}
        </select>
      );
    }

    if (isLoaded) {
      if (props.newUser) {
        return(
          <div className="container">
            <div className="row">
              <form id="choices" className="col-12">
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
              <div className="col-12 flex-column align-items-center">
                <button onClick={loadSprite} type="button" className="btn btn-primary mt-5">Update Character</button>
                <SpriteAnimator
                  sprite={image}
                  width={64}
                  height={64}
                  fps={8}
                  scale={0.2}
                />
                <button onClick={saveSprite} type="button" className="btn btn-success mt-5">Save and Exit</button>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="container">
            <div className="row">
              <form id="choices" className="col-12">
                <h2 className="pt-3">Customize Your Character</h2>
                <h4>Gender</h4>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label htmlFor="male"
                      className={characterDefinition.gender === "male"?"btn btn-primary active":"btn btn-secondary"}

                  ><input 
                    onChange={() => setCharacterDefinition({...characterDefinition, gender:'male'})}
                    type="radio" 
                    id="male" 
                    name="gender" 
                    value="male" 
                    checked={characterDefinition.gender === "male"}
                  />Male</label>
                  
                  <label htmlFor="female"                     className={characterDefinition.gender === "female"?"btn btn-primary active":"btn btn-secondary"}><input 
                    onChange={() => setCharacterDefinition({...characterDefinition, gender:'female'})}
                    type="radio" 
                    id="female" 
                    name="gender" 
                    value="female" 
                    checked={characterDefinition.gender === "female"}
                  /> Female</label>
                </div>
                {characterDefinition.gender && x()}
                <div>
                  <h4>Animation</h4>
                  {characterDefinition !== {} && y()}
                </div>
              </form>
              <div className="w-100 align-items-center justify-content-center d-flex flex-column mb-5">
                <SpriteAnimator
                  sprite={image}
                  width={64}
                  height={64}
                  fps={8}
                  scale={0.2}
                />
                <div className="w-100 d-flex flex-row justify-content-around">
                  <button onClick={loadSprite} type="button" className="btn btn-primary mt-5">Update Character</button>
                  <button onClick={saveSprite} type="button" className="btn btn-success mt-5">Save and Exit</button>
                </div>
              </div>
            </div>
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
