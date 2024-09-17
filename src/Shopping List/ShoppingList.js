import React,{useState, useEffect} from "react";
import CapstoneApi from "../Api";
import ListAddForm from "../Forms/ListAddForm";
import ListGenerateForm from "../Forms/ListGenerateForm"
import "./ShoppingList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const ShoppingList = () => {

    const [list, setList] = useState([]);
   const [items, setItems] = useState("");
    const [start, setStart ] = useState("")
    const [end, setEnd] = useState("")
    
console.log(items, "before mount")
    useEffect(function getItemsOnMount(){
        console.debug("ShoppingList useEffect getItemsOnMount")
        show();
    },[])

    async function show(){
           let itemsRes = await CapstoneApi.getList();
           setList(itemsRes.aisles); 
    }
   
    
    async function addItem (newItem){
        let res =  await CapstoneApi.postList(newItem)
          const obj = list[list.length-1]
          const updatedItems = [...obj.items]
          updatedItems.push(res)
          setList(list => [...list,{...obj,items:updatedItems}])
          
    }

   
    async function generate({startDate, endDate}){
        setStart(startDate)
        setEnd(endDate)
        let plans = await CapstoneApi.generateList(startDate, endDate);
        setItems(plans);
    }

     async function remove(id){
        await CapstoneApi.removeFromList(+id)
        setItems(items.filter((_,index) => index !== id))
    }


     
    return (
        <div className="ShoppingList">
            <h2 className="ShoppingList-title">Shopping List</h2>
           
            {list.length > 0 ? (
                <>
                <div className="ShoppingList-list">
                    <ul className="list">
                     {list.length > 0 && list.map((item, index) => (
                        <div key={index}>
                        {item.items.map((t, i) => (
                            <> 
                         <li className="list-item" key={i}><span> {t.name} Metric: {t.measures.metric.amount}{t.measures.metric.unit} Imperial: {t.measures.us.amount}{t.measures.us.unit}</span><button onClick={() => remove(t.id)}><FontAwesomeIcon icon="fa-solid fa-rectangle-xmark" /></button></li>
                         </>
                        ))}
                     
                      </div>
                ))}
                 </ul>
                 </div>

                 <div>
                  
                 <h4 className="ShoppingList-add" >Add Item to List: </h4> 
                 <ListAddForm  addItem={addItem}/>
                 <h4 className="ShoppingList-gen">Generate From Meal Plan:</h4> 
                 <ListGenerateForm generate={generate} />
                 </div>
                </>
            ):(
                <div>
              <h3 className="ShoppingList-top">Your List is Empty</h3>
              <h4 className="ShoppingList-add">Add Item to List: </h4> 
              <ListAddForm  addItem={addItem}/>
              <h4 className="ShoppingList-or">Or</h4>
             <h4 className="ShoppingList-gen">Generate From Meal Plan:</h4> 
             <ListGenerateForm generate={generate}/>
             
             </div>
            )}
    
        </div>
    );
}

export default ShoppingList