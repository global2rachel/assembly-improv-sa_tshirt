import React, {}  from "react";
import {Modal} from "react-bootstrap";


const CustomModal = (props)=>{

  const renderSaveButton = ()=>{
    if(!props.isSaveDisabled) return (
      <button onClick={props.addPhoto} type="button" className="btn btn-primary"
      data-bs-dismiss="modal">Save changes</button>
    )
    return (
      <div
          className="tooltipwrapper position-relative"
        >
            <span className="tooltiptext"
              >Please Crop first</span>
          
            <button onClick={props.addPhoto} type="button" className="btn btn-primary" disabled
                        data-bs-dismiss="modal" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Save changes</button>
      </div>
         
    )

  }


    return(
        <Modal size={props.size} show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'scroll'}}>
            {props.children}
        </Modal.Body>
        <Modal.Footer>
             <button onClick={props.resetModal} type="button" className="btn btn-secondary"
                        data-bs-dismiss="modal">Reset</button>
            
            {renderSaveButton()}
           
        </Modal.Footer>
      </Modal>
    )
}

export default CustomModal







